import React, { useState } from 'react';
import { Crown, Check, X, Star, Zap, Shield, ArrowRight, Sparkles, Rocket, Target, TrendingUp } from 'lucide-react';

const UpgradePage = () => {
    const [selectedPlan, setSelectedPlan] = useState('premium');
    const [isAnnual, setIsAnnual] = useState(false);

    const plans = {
        free: {
            name: 'Free Explorer',
            price: { monthly: 0, annual: 0 },
            description: 'Perfect for getting started with basic financial tracking',
            features: [
                'Basic expense tracking',
                'Simple budget creation',
                '3 savings goals',
                'Monthly reports',
                'Mobile app access'
            ],
            limitations: [
                'Limited to 50 transactions/month',
                'Basic support only',
                'No advanced analytics',
                'No automation features'
            ],
            color: 'from-gray-500 to-gray-600',
            icon: Target
        },
        premium: {
            name: 'Elite Commander',
            price: { monthly: 29, annual: 290 },
            description: 'Unlock the full power of FlowFund with advanced features',
            features: [
                'Unlimited transactions',
                'Advanced AI insights',
                'Unlimited savings goals',
                'AutoPilot automation',
                'Growth Engine tools',
                'Personal Academy access',
                'Priority support',
                'Advanced security features',
                'Custom categories',
                'Export capabilities',
                'Investment tracking',
                'Tax optimization'
            ],
            limitations: [],
            color: 'from-yellow-400 to-orange-500',
            icon: Crown,
            popular: true
        }
    };

    const handleUpgrade = (planType) => {
        // Handle upgrade logic here
        console.log(`Upgrading to ${planType} plan`);
    };

    const PlanCard = ({ planKey, plan, isSelected }) => {
        const IconComponent = plan.icon;
        const currentPrice = isAnnual ? plan.price.annual : plan.price.monthly;
        const savings = isAnnual && planKey === 'premium' ? (plan.price.monthly * 12 - plan.price.annual) : 0;

        return (
            <div 
                className={`relative space-themed-card rounded-2xl p-8 transition-all duration-300 cursor-pointer ${
                    isSelected ? 'ring-2 ring-yellow-400 scale-105' : 'hover:scale-102'
                } ${plan.popular ? 'border-yellow-400/50' : ''}`}
                onClick={() => setSelectedPlan(planKey)}
            >
                {/* Popular Badge */}
                {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                            <Sparkles size={14} />
                            MOST POPULAR
                        </div>
                    </div>
                )}

                {/* Plan Header */}
                <div className="text-center mb-6">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${plan.color} flex items-center justify-center`}>
                        <IconComponent className="text-white" size={32} />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                    <p className="text-gray-400 text-sm">{plan.description}</p>
                </div>

                {/* Pricing */}
                <div className="text-center mb-6">
                    <div className="flex items-baseline justify-center gap-1">
                        <span className="text-4xl font-bold text-white">
                            ${currentPrice}
                        </span>
                        {planKey !== 'free' && (
                            <span className="text-gray-400">
                                /{isAnnual ? 'year' : 'month'}
                            </span>
                        )}
                    </div>
                    {savings > 0 && (
                        <div className="mt-2">
                            <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-sm">
                                Save ${savings}/year
                            </span>
                        </div>
                    )}
                </div>

                {/* Features */}
                <div className="mb-6">
                    <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                        <Check className="text-green-400" size={16} />
                        What's Included
                    </h4>
                    <ul className="space-y-2">
                        {plan.features.map((feature, index) => (
                            <li key={index} className="flex items-center gap-2 text-gray-300">
                                <Check className="text-green-400 flex-shrink-0" size={16} />
                                <span className="text-sm">{feature}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Limitations */}
                {plan.limitations.length > 0 && (
                    <div className="mb-6">
                        <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                            <X className="text-red-400" size={16} />
                            Limitations
                        </h4>
                        <ul className="space-y-2">
                            {plan.limitations.map((limitation, index) => (
                                <li key={index} className="flex items-center gap-2 text-gray-400">
                                    <X className="text-red-400 flex-shrink-0" size={16} />
                                    <span className="text-sm">{limitation}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Action Button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleUpgrade(planKey);
                    }}
                    className={`w-full py-3 px-4 rounded-lg font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                        planKey === 'free'
                            ? 'bg-gray-600 hover:bg-gray-500 text-white'
                            : 'glow-button bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:from-yellow-500 hover:to-orange-600'
                    }`}
                >
                    {planKey === 'free' ? (
                        <>
                            <Target size={20} />
                            Current Plan
                        </>
                    ) : (
                        <>
                            <Rocket size={20} />
                            Upgrade Now
                            <ArrowRight size={20} />
                        </>
                    )}
                </button>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-deep-space text-white">
            {/* Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-[#0a1128] to-[#001f3f] opacity-100"></div>
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-yellow-500/20 blur-xl animate-pulse"></div>
                    <div className="absolute top-2/3 right-1/3 w-48 h-48 rounded-full bg-orange-500/10 blur-xl animate-pulse"></div>
                    <div className="absolute bottom-1/4 left-1/3 w-40 h-40 rounded-full bg-purple-500/15 blur-xl animate-pulse"></div>
                </div>
            </div>

            <div className="relative container mx-auto px-4 py-12 max-w-6xl">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-4">
                        Upgrade Your Financial Power
                    </h1>
                    <p className="text-gray-300 text-lg mb-8">
                        Unlock advanced features and take your financial management to the next level
                    </p>

                    {/* Billing Toggle */}
                    <div className="flex items-center justify-center gap-4 mb-8">
                        <span className={`text-sm ${!isAnnual ? 'text-white font-semibold' : 'text-gray-400'}`}>
                            Monthly
                        </span>
                        <button
                            onClick={() => setIsAnnual(!isAnnual)}
                            className={`relative w-14 h-7 rounded-full transition-colors ${
                                isAnnual ? 'bg-yellow-500' : 'bg-gray-600'
                            }`}
                        >
                            <div
                                className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                                    isAnnual ? 'translate-x-8' : 'translate-x-1'
                                }`}
                            />
                        </button>
                        <span className={`text-sm ${isAnnual ? 'text-white font-semibold' : 'text-gray-400'}`}>
                            Annual
                        </span>
                        {isAnnual && (
                            <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs font-semibold">
                                Save 17%
                            </span>
                        )}
                    </div>
                </div>

                {/* Plans Comparison */}
                <div className="grid md:grid-cols-2 gap-8 mb-12">
                    {Object.entries(plans).map(([planKey, plan]) => (
                        <PlanCard
                            key={planKey}
                            planKey={planKey}
                            plan={plan}
                            isSelected={selectedPlan === planKey}
                        />
                    ))}
                </div>

                {/* Feature Comparison Table */}
                <div className="space-themed-card rounded-2xl p-8 mb-8">
                    <h2 className="text-2xl font-bold text-center mb-6 flex items-center justify-center gap-2">
                        <Star className="text-yellow-400" />
                        Feature Comparison
                    </h2>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-700">
                                    <th className="text-left py-3 px-4 text-gray-300">Feature</th>
                                    <th className="text-center py-3 px-4 text-gray-300">Free Explorer</th>
                                    <th className="text-center py-3 px-4 text-yellow-400">Elite Commander</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {[
                                    { feature: 'Transaction Tracking', free: '50/month', premium: 'Unlimited' },
                                    { feature: 'Savings Goals', free: '3', premium: 'Unlimited' },
                                    { feature: 'AI Insights', free: false, premium: true },
                                    { feature: 'AutoPilot Automation', free: false, premium: true },
                                    { feature: 'Growth Engine', free: false, premium: true },
                                    { feature: 'Personal Academy', free: false, premium: true },
                                    { feature: 'Investment Tracking', free: false, premium: true },
                                    { feature: 'Priority Support', free: false, premium: true },
                                    { feature: 'Advanced Security', free: false, premium: true },
                                    { feature: 'Custom Categories', free: false, premium: true }
                                ].map((row, index) => (
                                    <tr key={index} className="border-b border-gray-800 hover:bg-gray-800/30">
                                        <td className="py-3 px-4 text-white">{row.feature}</td>
                                        <td className="py-3 px-4 text-center">
                                            {typeof row.free === 'boolean' ? (
                                                row.free ? (
                                                    <Check className="text-green-400 mx-auto" size={16} />
                                                ) : (
                                                    <X className="text-red-400 mx-auto" size={16} />
                                                )
                                            ) : (
                                                <span className="text-gray-300">{row.free}</span>
                                            )}
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            {typeof row.premium === 'boolean' ? (
                                                row.premium ? (
                                                    <Check className="text-green-400 mx-auto" size={16} />
                                                ) : (
                                                    <X className="text-red-400 mx-auto" size={16} />
                                                )
                                            ) : (
                                                <span className="text-yellow-400 font-semibold">{row.premium}</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Benefits Section */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <div className="space-themed-card rounded-xl p-6 text-center hover:scale-105 transition-all">
                        <Zap className="text-yellow-400 mx-auto mb-4" size={48} />
                        <h3 className="text-xl font-bold text-white mb-2">Lightning Fast</h3>
                        <p className="text-gray-400">
                            Experience blazing-fast performance with our optimized algorithms and real-time sync.
                        </p>
                    </div>
                    <div className="space-themed-card rounded-xl p-6 text-center hover:scale-105 transition-all">
                        <Shield className="text-blue-400 mx-auto mb-4" size={48} />
                        <h3 className="text-xl font-bold text-white mb-2">Bank-Level Security</h3>
                        <p className="text-gray-400">
                            Your data is protected with military-grade encryption and advanced security protocols.
                        </p>
                    </div>
                    <div className="space-themed-card rounded-xl p-6 text-center hover:scale-105 transition-all">
                        <TrendingUp className="text-green-400 mx-auto mb-4" size={48} />
                        <h3 className="text-xl font-bold text-white mb-2">Smart Analytics</h3>
                        <p className="text-gray-400">
                            Gain deep insights into your spending habits with our AI-powered analytics engine.
                        </p>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .bg-deep-space {
                    background-color: #0a1128;
                }

                .space-themed-card {
                    background: rgba(10, 20, 40, 0.6);
                    backdrop-filter: blur(10px);
                    -webkit-backdrop-filter: blur(10px);
                    border: 1px solid rgba(70, 130, 180, 0.3);
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
                }

                .glow-button {
                    box-shadow: 0 0 8px rgba(255, 215, 0, 0.6), 0 0 15px rgba(255, 215, 0, 0.4);
                    transition: all 0.3s ease;
                }

                .glow-button:hover {
                    box-shadow: 0 0 12px rgba(255, 215, 0, 0.8), 0 0 20px rgba(255, 215, 0, 0.6);
                    transform: translateY(-2px);
                }

                .animate-pulse {
                    animation: pulse 4s infinite ease-in-out;
                }

                @keyframes pulse {
                    0%, 100% { transform: scale(1); opacity: 0.2; }
                    50% { transform: scale(1.1); opacity: 0.4; }
                }
            `}</style>
        </div>
    );
};

export default UpgradePage;
