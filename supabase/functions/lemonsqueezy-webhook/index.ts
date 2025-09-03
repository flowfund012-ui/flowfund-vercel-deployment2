import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.42.0"
import { crypto } from "https://deno.land/std@0.168.0/crypto/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-signature',
}

serve(async (req ) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', {
      status: 405,
      headers: corsHeaders
    })
  }

  try {
    const signature = req.headers.get('x-signature')
    const webhookSecret = Deno.env.get('LEMONSQUEEZY_WEBHOOK_SECRET')

    if (!signature || !webhookSecret) {
      return new Response('Missing signature or webhook secret', {
        status: 400,
        headers: corsHeaders
      })
    }

    const rawBody = await req.text()

    // Verify webhook signature
    const encoder = new TextEncoder()
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(webhookSecret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    )

    const expectedSignature = await crypto.subtle.sign(
      'HMAC',
      key,
      encoder.encode(rawBody)
    )

    const expectedHex = Array.from(new Uint8Array(expectedSignature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')

    if (signature !== expectedHex) {
      return new Response('Invalid signature', {
        status: 403,
        headers: corsHeaders
      })
    }

    const payload = JSON.parse(rawBody)
    const eventType = payload.meta.event_name

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    )

    // Process webhook event
    if (eventType === 'subscription_created' || eventType === 'subscription_updated') {
      const subscription = payload.data
      const customData = subscription.attributes?.custom_data
      const userId = customData?.user_id

      if (!userId) {
        console.error('No user ID found in webhook payload for subscription event')
        return new Response('No user ID found', { status: 400, headers: corsHeaders })
      }

      // Determine the subscription plan based on variant ID
      const variantId = subscription.attributes?.variant_id
      let subscriptionPlan = 'free'

      // These environment variables will be set in Supabase Edge Functions settings
      const starterVariantId = Deno.env.get('VITE_LEMONSQUEEZY_STARTER_VARIANT_ID')
      const businessVariantId = Deno.env.get('VITE_LEMONSQUEEZY_BUSINESS_VARIANT_ID')
      const premiumVariantId = Deno.env.get('VITE_LEMONSQUEEZY_PREMIUM_VARIANT_ID')

      if (variantId == starterVariantId) {
        subscriptionPlan = 'starter'
      } else if (variantId == businessVariantId) {
        subscriptionPlan = 'business'
      } else if (variantId == premiumVariantId) {
        subscriptionPlan = 'premium'
      }

      // Update the user's profile in Supabase
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          subscription_plan: subscriptionPlan,
          is_subscribed: true,
          subscription_updated_at: new Date().toISOString(),
          lemonsqueezy_subscription_id: subscription.id
        })
        .eq('id', userId)

      if (profileError) {
        throw profileError
      }

      // Store raw webhook payload in subscriptions table
      const { error: subscriptionInsertError } = await supabase
        .from('subscriptions')
        .upsert({
          user_id: userId,
          lemonsqueezy_subscription_id: subscription.id,
          plan_id: subscriptionPlan,
          status: subscription.attributes.status,
          current_period_start: subscription.attributes.renews_at ? new Date(subscription.attributes.renews_at).toISOString() : null,
          current_period_end: subscription.attributes.ends_at ? new Date(subscription.attributes.ends_at).toISOString() : null,
          raw_webhook_payload: payload,
        }, { onConflict: 'lemonsqueezy_subscription_id' })

      if (subscriptionInsertError) {
        throw subscriptionInsertError
      }

      console.log(`Updated user ${userId} to ${subscriptionPlan} plan and recorded subscription.`) 

    } else if (eventType === 'subscription_cancelled' || eventType === 'subscription_expired') {
      const subscription = payload.data
      const customData = subscription.attributes?.custom_data
      const userId = customData?.user_id

      if (!userId) {
        console.error('No user ID found in webhook payload for cancellation event')
        return new Response('No user ID found', { status: 400, headers: corsHeaders })
      }

      // Downgrade user to free plan
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          subscription_plan: 'free',
          is_subscribed: false,
          subscription_updated_at: new Date().toISOString()
        })
        .eq('id', userId)

      if (profileError) {
        throw profileError
      }

      // Update subscription status in subscriptions table
      const { error: subscriptionUpdateError } = await supabase
        .from('subscriptions')
        .update({ status: subscription.attributes.status })
        .eq('lemonsqueezy_subscription_id', subscription.id)

      if (subscriptionUpdateError) {
        throw subscriptionUpdateError
      }

      console.log(`Downgraded user ${userId} to free plan and updated subscription status.`) 

    } else if (eventType === 'order_created') {
      const order = payload.data
      const customData = order.attributes?.first_order_item?.attributes?.custom_data
      const userId = customData?.user_id

      if (!userId) {
        console.error('No user ID found in webhook payload for order created event')
        return new Response('No user ID found', { status: 400, headers: corsHeaders })
      }

      // For lifetime plans, update profile and record purchase
      const variantId = order.attributes?.first_order_item?.attributes?.variant_id
      const premiumVariantId = Deno.env.get('VITE_LEMONSQUEEZY_PREMIUM_VARIANT_ID')

      if (variantId == premiumVariantId) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            subscription_plan: 'premium',
            is_subscribed: true,
            subscription_updated_at: new Date().toISOString()
          })
          .eq('id', userId)

        if (profileError) {
          throw profileError
        }

        // Store raw webhook payload in purchases table
        const { error: purchaseInsertError } = await supabase
          .from('purchases')
          .upsert({
            user_id: userId,
            lemonsqueezy_order_id: order.id,
            product_id: order.attributes.product_id,
            variant_id: variantId,
            price: order.attributes.total,
            currency: order.attributes.currency,
            raw_webhook_payload: payload,
          }, { onConflict: 'lemonsqueezy_order_id' })

        if (purchaseInsertError) {
          throw purchaseInsertError
        }

        console.log(`User ${userId} purchased Premium plan and recorded purchase.`) 
      }
    }

    return new Response('Webhook processed successfully', {
      status: 200,
      headers: corsHeaders
    })
  } catch (error) {
    console.error('Webhook processing error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    )
  }
})
