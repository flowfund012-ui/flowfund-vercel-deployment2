import { useState } from 'react'
import { 
  TrendingUp, 
  Target, 
  Users, 
  DollarSign, 
  BarChart3, 
  PieChart, 
  Calculator,
  Lightbulb,
  Rocket,
  Building,
  Globe,
  Zap
} from 'lucide-react'

const GrowthEngine = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [businessMetrics, setBusinessMetrics] = useState({
    revenue: 0,
    customers: 0,
    conversionRate: 0,
    averageOrderValue: 0
  })

  const businessTools = [
    {
      id: 'revenue-calculator',
      name: 'Revenue Calculator',
      description: 'Calculate projected revenue based on different scenarios',
      icon: Calculator,
      category: 'Planning'
    },
    {
      id: 'market-analyzer',
      name: 'Market Analyzer',
      description: 'Analyze your target market and competition',
      icon: BarChart3,
      category: 'Research'
    },
    {
      id: 'pricing-optimizer',
      name: 'Pricing Optimizer',
      description: 'Find the optimal pricing strategy for your products',
      icon: DollarSign,
      category: 'Strategy'
    },
    {
      id: 'customer-insights',
      name: 'Customer Insights',
      description: 'Understand your customer behavior and preferences',
      icon: Users,
      category: 'Analytics'
    },
    {
      id: 'growth-planner',
      name: 'Growth Planner',
      description: 'Plan and track your business growth milestones',
      icon: TrendingUp,
      category: 'Planning'
    },
    {
      id: 'idea-validator',
      name: 'Idea Validator',
      description: 'Validate your business ideas before investing',
      icon: Lightbulb,
      category: 'Research'
    }
  ]

  const growthMetrics = [
    { label: 'Monthly Revenue', value: '$12,450', change: '+15.3%', positive: true },
    { label: 'Customer Acquisition', value: '234', change: '+8.7%', positive: true },
    { label: 'Conversion Rate', value: '3.2%', change: '+0.5%', positive: true },
    { label: 'Average Order Value', value: '$89', change: '-2.1%', positive: false }
  ]

  const businessIdeas = [
    {
      title: 'Digital Product Launch',
      description: 'Launch an online course or digital product',
      potential: 'High',
      difficulty: 'Medium',
      timeframe: '2-3 months'
    },
    {
      title: 'Subscription Service',
      description: 'Create a recurring revenue subscription model',
      potential: 'Very High',
      difficulty: 'High',
      timeframe: '3-6 months'
    },
    {
      title: 'Affiliate Marketing',
      description: 'Monetize through affiliate partnerships',
      potential: 'Medium',
      difficulty: 'Low',
      timeframe: '1-2 months'
    }
  ]

  const handleMetricUpdate = (metric, value) => {
    setBusinessMetrics(prev => ({
      ...prev,
      [metric]: value
    }))
  }

  return (
    <div className="space-y-8">
      <div className="page-header">
        <h1 className="page-title flex items-center gap-3">
          <Rocket className="w-8 h-8 text-blue-400" />
          Growth Engine
        </h1>
        <p className="page-subtitle">Advanced business tools for entrepreneurs and growing companies</p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-800/50 p-1 rounded-lg">
        {[
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'tools', label: 'Business Tools', icon: Building },
          { id: 'ideas', label: 'Growth Ideas', icon: Lightbulb },
          { id: 'metrics', label: 'Metrics Tracker', icon: TrendingUp }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Growth Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {growthMetrics.map((metric, index) => (
              <div key={index} className="dashboard-card">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-400 text-sm">{metric.label}</p>
                    <p className="text-2xl font-bold text-white mt-1">{metric.value}</p>
                  </div>
                  <div className={`flex items-center gap-1 text-sm ${
                    metric.positive ? 'text-green-400' : 'text-red-400'
                  }`}>
                    <TrendingUp className={`w-4 h-4 ${metric.positive ? '' : 'rotate-180'}`} />
                    {metric.change}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="dashboard-card">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="p-4 bg-blue-600/20 border border-blue-500/30 rounded-lg hover:bg-blue-600/30 transition-colors">
                <Calculator className="w-6 h-6 text-blue-400 mb-2" />
                <p className="text-white font-medium">Revenue Calculator</p>
                <p className="text-gray-400 text-sm">Calculate growth projections</p>
              </button>
              <button className="p-4 bg-green-600/20 border border-green-500/30 rounded-lg hover:bg-green-600/30 transition-colors">
                <Target className="w-6 h-6 text-green-400 mb-2" />
                <p className="text-white font-medium">Set Growth Goals</p>
                <p className="text-gray-400 text-sm">Define your targets</p>
              </button>
              <button className="p-4 bg-purple-600/20 border border-purple-500/30 rounded-lg hover:bg-purple-600/30 transition-colors">
                <Users className="w-6 h-6 text-purple-400 mb-2" />
                <p className="text-white font-medium">Customer Analysis</p>
                <p className="text-gray-400 text-sm">Understand your audience</p>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Business Tools Tab */}
      {activeTab === 'tools' && (
        <div className="space-y-6">
          <div className="dashboard-card">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Building className="w-5 h-5 text-blue-400" />
              Business Tools Suite
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {businessTools.map((tool) => (
                <div key={tool.id} className="p-6 bg-gray-800/50 border border-gray-700 rounded-lg hover:border-blue-500/50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3 mb-3">
                    <tool.icon className="w-6 h-6 text-blue-400" />
                    <div>
                      <h4 className="text-white font-medium">{tool.name}</h4>
                      <span className="text-xs text-blue-400 bg-blue-400/20 px-2 py-1 rounded">{tool.category}</span>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm">{tool.description}</p>
                  <button className="mt-4 w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Launch Tool
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Growth Ideas Tab */}
      {activeTab === 'ideas' && (
        <div className="space-y-6">
          <div className="dashboard-card">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-400" />
              Growth Opportunities
            </h3>
            <div className="space-y-4">
              {businessIdeas.map((idea, index) => (
                <div key={index} className="p-6 bg-gray-800/50 border border-gray-700 rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-white font-semibold text-lg">{idea.title}</h4>
                    <div className="flex gap-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        idea.potential === 'Very High' ? 'bg-green-400/20 text-green-400' :
                        idea.potential === 'High' ? 'bg-blue-400/20 text-blue-400' :
                        'bg-yellow-400/20 text-yellow-400'
                      }`}>
                        {idea.potential} Potential
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-400 mb-4">{idea.description}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex gap-4 text-sm">
                      <span className="text-gray-400">
                        Difficulty: <span className="text-white">{idea.difficulty}</span>
                      </span>
                      <span className="text-gray-400">
                        Timeline: <span className="text-white">{idea.timeframe}</span>
                      </span>
                    </div>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Explore
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Metrics Tracker Tab */}
      {activeTab === 'metrics' && (
        <div className="space-y-6">
          <div className="dashboard-card">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              Business Metrics Tracker
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Monthly Revenue ($)</label>
                  <input
                    type="number"
                    value={businessMetrics.revenue}
                    onChange={(e) => handleMetricUpdate('revenue', e.target.value)}
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                    placeholder="Enter monthly revenue"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Number of Customers</label>
                  <input
                    type="number"
                    value={businessMetrics.customers}
                    onChange={(e) => handleMetricUpdate('customers', e.target.value)}
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                    placeholder="Enter customer count"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Conversion Rate (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={businessMetrics.conversionRate}
                    onChange={(e) => handleMetricUpdate('conversionRate', e.target.value)}
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                    placeholder="Enter conversion rate"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Average Order Value ($)</label>
                  <input
                    type="number"
                    value={businessMetrics.averageOrderValue}
                    onChange={(e) => handleMetricUpdate('averageOrderValue', e.target.value)}
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                    placeholder="Enter average order value"
                  />
                </div>
              </div>
            </div>
            
            {/* Calculated Metrics */}
            <div className="mt-6 p-4 bg-blue-600/20 border border-blue-500/30 rounded-lg">
              <h4 className="text-white font-semibold mb-3">Calculated Insights</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Revenue per Customer</p>
                  <p className="text-white font-semibold">
                    ${businessMetrics.customers > 0 ? (businessMetrics.revenue / businessMetrics.customers).toFixed(2) : '0.00'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">Annual Revenue Projection</p>
                  <p className="text-white font-semibold">
                    ${(businessMetrics.revenue * 12).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">Growth Rate Needed</p>
                  <p className="text-white font-semibold">15% MoM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default GrowthEngine

