import { useState } from 'react'
import { generateCheckoutUrl, PLANS } from '../lib/lemonsqueezy'
import { useAuth } from '../contexts/AuthContext'
import { Loader2, Crown, Zap, Star } from 'lucide-react'

const LemonSqueezyButton = ({ 
  planId, 
  className = '', 
  children,
  variant = 'default',
  size = 'default',
  disabled = false 
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()
  
  const plan = PLANS[planId]
  
  if (!plan) {
    console.error(`Invalid plan ID: ${planId}`)
    return null
  }

  const handleCheckout = async () => {
    if (!user) {
      // Redirect to login if user is not authenticated
      window.location.href = '/login'
      return
    }

    setIsLoading(true)
    
    try {
      const customData = {
        userId: user.id,
        email: user.email,
        successUrl: `${window.location.origin}/dashboard?success=true&plan=${planId}`,
        cancelUrl: `${window.location.origin}/upgrade?cancelled=true`
      }
      
      const checkoutUrl = generateCheckoutUrl(planId, customData)
      
      // Open checkout in the same window
      window.location.href = checkoutUrl
    } catch (error) {
      console.error('Error initiating checkout:', error)
      alert('There was an error starting the checkout process. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Get button styles based on variant and size
  const getButtonStyles = () => {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
    
    const variantStyles = {
      default: 'bg-blue-600 hover:bg-blue-700 text-white',
      primary: 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl',
      popular: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl border-2 border-yellow-400',
      premium: 'bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white shadow-lg hover:shadow-xl',
      outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white',
      ghost: 'text-blue-600 hover:bg-blue-600/10'
    }
    
    const sizeStyles = {
      sm: 'px-3 py-1.5 text-sm',
      default: 'px-4 py-2',
      lg: 'px-6 py-3 text-lg',
      xl: 'px-8 py-4 text-xl'
    }
    
    return `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`
  }

  // Get icon based on plan
  const getPlanIcon = () => {
    switch (planId) {
      case 'premium':
        return <Crown className="w-4 h-4" />
      case 'business':
        return <Zap className="w-4 h-4" />
      case 'starter':
        return <Star className="w-4 h-4" />
      default:
        return null
    }
  }

  // Default button content if children not provided
  const defaultContent = (
    <>
      {getPlanIcon()}
      {plan.interval === 'lifetime' 
        ? `Get ${plan.name} - $${plan.price}` 
        : `Subscribe to ${plan.name} - $${plan.price}/${plan.interval}`
      }
    </>
  )

  return (
    <button
      onClick={handleCheckout}
      disabled={disabled || isLoading}
      className={getButtonStyles()}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Processing...
        </>
      ) : (
        children || defaultContent
      )}
    </button>
  )
}

// Preset button components for common use cases
export const StarterButton = ({ className, ...props }) => (
  <LemonSqueezyButton 
    planId="starter" 
    variant="default" 
    className={className}
    {...props}
  >
    <Star className="w-4 h-4 mr-2" />
    Get Starter Plan
  </LemonSqueezyButton>
)

export const BusinessButton = ({ className, ...props }) => (
  <LemonSqueezyButton 
    planId="business" 
    variant="popular" 
    className={className}
    {...props}
  >
    <Zap className="w-4 h-4 mr-2" />
    Get Business+ Plan
  </LemonSqueezyButton>
)

export const PremiumButton = ({ className, ...props }) => (
  <LemonSqueezyButton 
    planId="premium" 
    variant="premium" 
    className={className}
    {...props}
  >
    <Crown className="w-4 h-4 mr-2" />
    Get Lifetime Access
  </LemonSqueezyButton>
)

// Pricing card component with integrated checkout
export const PricingCard = ({ planId, featured = false }) => {
  const plan = PLANS[planId]
  
  if (!plan || planId === 'free') {
    return null
  }

  return (
    <div className={`relative p-6 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
      featured 
        ? 'border-yellow-400 bg-gradient-to-br from-purple-900/50 to-blue-900/50' 
        : 'border-gray-700 bg-gray-800/50 hover:border-blue-500/50'
    }`}>
      {featured && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black px-3 py-1 rounded-full text-sm font-semibold">
            Most Popular
          </span>
        </div>
      )}
      
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
        <div className="flex items-center justify-center gap-1">
          <span className="text-4xl font-bold text-white">${plan.price}</span>
          {plan.interval && (
            <span className="text-gray-400">/{plan.interval}</span>
          )}
        </div>
        {plan.interval === 'lifetime' && (
          <p className="text-green-400 text-sm mt-1">One-time payment</p>
        )}
      </div>
      
      <ul className="space-y-3 mb-8">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2 text-gray-300">
            <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0"></div>
            {feature}
          </li>
        ))}
      </ul>
      
      <LemonSqueezyButton
        planId={planId}
        variant={featured ? 'popular' : 'primary'}
        size="lg"
        className="w-full"
      />
    </div>
  )
}

export default LemonSqueezyButton

