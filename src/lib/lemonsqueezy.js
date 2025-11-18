// LemonSqueezy Integration Configuration
const LEMONSQUEEZY_CONFIG = {
  storeId: import.meta.env.VITE_LEMONSQUEEZY_STORE_ID || 'your-store-id',
  apiKey: import.meta.env.VITE_LEMONSQUEEZY_API_KEY || 'your-api-key',
  webhookSecret: import.meta.env.LEMONSQUEEZY_WEBHOOK_SECRET || 'your-webhook-secret',
  
  // Product Variant IDs for different plans
  variants: {
    starter: import.meta.env.VITE_LEMONSQUEEZY_STARTER_VARIANT_ID || 'starter-variant-id',
    business: import.meta.env.VITE_LEMONSQUEEZY_BUSINESS_VARIANT_ID || 'business-variant-id',
    premium: import.meta.env.VITE_LEMONSQUEEZY_PREMIUM_VARIANT_ID || 'premium-variant-id'
  },
  
  // Checkout URLs
  checkoutUrl: 'https://checkout.lemonsqueezy.com/checkout/buy/',
  
  // Environment
  isProduction: import.meta.env.PROD || false
}

// Plan configurations
export const PLANS = {
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    interval: null,
    features: [
      'Basic Dashboard',
      'Income Tracker',
      'Expense Manager',
      'Security Hub',
      'Email Support'
    ],
    limits: {
      transactions: 50,
      budgets: 1,
      goals: 1
    }
  },
  starter: {
    id: 'starter',
    name: 'Starter',
    price: 29,
    interval: 'month',
    variantId: LEMONSQUEEZY_CONFIG.variants.starter,
    features: [
      'Everything in Free',
      'Budget Planner',
      'Savings Goals',
      'Mission Tracker',
      'Advanced Analytics',
      'Priority Support'
    ],
    limits: {
      transactions: 500,
      budgets: 5,
      goals: 10
    }
  },
  business: {
    id: 'business',
    name: 'Business+',
    price: 49,
    interval: 'month',
    variantId: LEMONSQUEEZY_CONFIG.variants.business,
    popular: true,
    features: [
      'Everything in Starter',
      'AutoPilot Automation',
      'Growth Engine',
      'Personal Academy',
      'Advanced Reports',
      'API Access',
      'Priority Support'
    ],
    limits: {
      transactions: 'unlimited',
      budgets: 'unlimited',
      goals: 'unlimited'
    }
  },
  premium: {
    id: 'premium',
    name: 'Premium',
    price: 297,
    interval: 'lifetime',
    variantId: LEMONSQUEEZY_CONFIG.variants.premium,
    features: [
      'Everything in Business+',
      'Vault Access',
      'Exclusive Templates',
      'Premium Resources',
      'Lifetime Updates',
      'VIP Support',
      'Early Access to New Features'
    ],
    limits: {
      transactions: 'unlimited',
      budgets: 'unlimited',
      goals: 'unlimited'
    }
  }
}

// Generate checkout URL for a specific plan
export const generateCheckoutUrl = (planId, customData = {} ) => {
  const plan = PLANS[planId]
  if (!plan || !plan.variantId) {
    throw new Error(`Invalid plan ID: ${planId}`)
  }

const checkoutUrl = new URL(`${LEMONSQUEEZY_CONFIG.checkoutUrl}${plan.variantId}`)
  
  // Add custom data as URL parameters
  if (customData.userId) {
    checkoutUrl.searchParams.set('checkout[custom][user_id]', customData.userId)
  }
  
  if (customData.email) {
    checkoutUrl.searchParams.set('checkout[email]', customData.email)
  }
  
  // Add success and cancel URLs
  if (customData.successUrl) {
    checkoutUrl.searchParams.set('checkout[success_url]', customData.successUrl)
  }
  
  if (customData.cancelUrl) {
    checkoutUrl.searchParams.set('checkout[cancel_url]', customData.cancelUrl)
  }

  return checkoutUrl.toString()
}

// Get user's current plan
export const getUserPlan = (subscriptionPlan) => {
  return PLANS[subscriptionPlan] || PLANS.free
}

// Check if user has access to a feature
export const hasFeatureAccess = (userPlan, requiredPlan) => {
  const planHierarchy = {
    free: 0,
    starter: 1,
    business: 2,
    premium: 3
  }
  
  const userLevel = planHierarchy[userPlan] || 0
  const requiredLevel = planHierarchy[requiredPlan] || 0
  
  return userLevel >= requiredLevel
}

export default LEMONSQUEEZY_CONFIG
