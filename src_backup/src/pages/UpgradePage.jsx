import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { PLANS } from '../lib/lemonsqueezy'
import { PricingCard } from '../components/LemonSqueezyButton'
import { 
  Crown, 
  Check, 
  X, 
  Star, 
  Zap, 
  Shield,
  ArrowRight,
  Sparkles
} from 'lucide-react'

const UpgradePage = () => {
  const { user, profile, getCurrentPlan, hasAccess } = useAuth()
  const [currentPlan, setCurrentPlan] = useState(null)
  const [showComparison, setShowComparison] = useState(false)

  useEffect(() => {
    if (profile) {
      setCurrentPlan(getCurrentPlan())
    }
  }, [profile, getCurrentPlan])

  // Get URL parameters for success/cancel messages
  const urlParams = new URLSearchParams(window.location.search)
  const success = urlParams.get('success')
  const cancelled = urlParams.get('cancelled')
  const planParam = urlParams.get('plan')

  const features = {
    'Basic Dashboard': { free: true, starter: true, business: true, premium: true },
    'Income Tracker': { free: true, starter: true, business: true, premium: true },
    'Expense Manager': { free: true, starter: true, business: true, premium: true },
    'Security Hub': { free: true, starter: true, business: true, premium: true },
    'Budget Planner': { free: false, starter: true, business: true, premium: true },
    'Savings Goals': { free: false, starter: true, business: true, premium: true },
    'Mission Tracker': { free: false, starter: true, business: true, premium: true },
    'Advanced Analytics': { free: false, starter: true, business: true, premium: true },
    'AutoPilot Automation': { free: false, starter: false, business: true, premium: true },
    'Growth Engine': { free: false, starter: false, business: true, premium: true },
    'Personal Academy': { free: false, starter: false, business: true, premium: true },
    'API Access': { free: false, starter: false, business: true, premium: true },
    'Vault Access': { free: false, starter: false, business: false, premium: true },
    'Premium Templates': { free: false, starter: false, business: false, premium: true },
    'Lifetime Updates': { free: false, starter: false, business: false, premium: true },
    'VIP Support': { free: false, starter: false, business: false, premium: true }
  }

  const planOrder = ['free', 'starter', 'business', 'premium']
  const paidPlans = planOrder.filter(planId => planId !== 'free')

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="container mx-auto px-4 py-12">
        {/* Success Message */}
        {success && (
          <div className="mb-8 p-4 bg-green-600/20 border border-green-500/30 rounded-lg">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-400" />
              <h3 className="text-green-400 font-semibold">Payment Successful!</h3>
            </div>
            <p className="text-gray-300 mt-1">
              Welcome to {PLANS[planParam]?.name || 'your new plan'}! Your account has been upgraded.
            </p>
          </div>
        )}

        {/* Cancel Message */}
        {cancelled && (
          <div className="mb-8 p-4 bg-yellow-600/20 border border-yellow-500/30 rounded-lg">
            <div className="flex items-center gap-2">
              <X className="w-5 h-5 text-yellow-400" />
              <h3 className="text-yellow-400 font-semibold">Payment Cancelled</h3>
            </div>
            <p className="text-gray-300 mt-1">
              No worries! You can upgrade anytime when you're ready.
            </p>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">FlowFund</span> Plan
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            Unlock powerful financial tools and take control of your money
          </p>
          
          {currentPlan && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/20 border border-blue-500/30 rounded-lg">
              <Shield className="w-5 h-5 text-blue-400" />
              <span className="text-blue-400">Current Plan: {currentPlan.name}</span>
            </div>
          )}
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {paidPlans.map((planId) => (
            <PricingCard 
              key={planId} 
              planId={planId} 
              featured={PLANS[planId].popular} 
            />
          ))}
        </div>

        {/* Feature Comparison Toggle */}
        <div className="text-center mb-8">
          <button
            onClick={() => setShowComparison(!showComparison)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white hover:bg-gray-700 transition-colors"
          >
            <Sparkles className="w-5 h-5" />
            {showComparison ? 'Hide' : 'Show'} Feature Comparison
            <ArrowRight className={`w-4 h-4 transition-transform ${showComparison ? 'rotate-90' : ''}`} />
          </button>
        </div>

        {/* Feature Comparison Table */}
        {showComparison && (
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 mb-12">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">Feature Comparison</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-4 text-white font-semibold">Features</th>
                    {planOrder.map(planId => (
                      <th key={planId} className="text-center py-3 px-4">
                        <div className="flex flex-col items-center">
                          <span className="text-white font-semibold">{PLANS[planId].name}</span>
                          {planId !== 'free' && (
                            <span className="text-sm text-gray-400">
                              ${PLANS[planId].price}{PLANS[planId].interval && `/${PLANS[planId].interval}`}
                            </span>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(features).map(([feature, availability]) => (
                    <tr key={feature} className="border-b border-gray-700/50">
                      <td className="py-3 px-4 text-gray-300">{feature}</td>
                      {planOrder.map(planId => (
                        <td key={planId} className="text-center py-3 px-4">
                          {availability[planId] ? (
                            <Check className="w-5 h-5 text-green-400 mx-auto" />
                          ) : (
                            <X className="w-5 h-5 text-gray-600 mx-auto" />
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* FAQ Section */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">Frequently Asked Questions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-white font-semibold mb-2">Can I change plans anytime?</h4>
              <p className="text-gray-400 text-sm">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-2">What payment methods do you accept?</h4>
              <p className="text-gray-400 text-sm">
                We accept all major credit cards, PayPal, and other secure payment methods through LemonSqueezy.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-2">Is there a free trial?</h4>
              <p className="text-gray-400 text-sm">
                Yes! You can start with our free plan and upgrade when you're ready for more features.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-2">What about the lifetime plan?</h4>
              <p className="text-gray-400 text-sm">
                Our Premium lifetime plan gives you access to all features forever with a one-time payment.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Support */}
        <div className="text-center mt-12">
          <p className="text-gray-400 mb-4">
            Need help choosing the right plan?
          </p>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  )
}

export default UpgradePage

