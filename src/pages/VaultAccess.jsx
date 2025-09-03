import { useState } from 'react'
import { 
  Lock, 
  Download, 
  Star, 
  FileText, 
  Folder,
  Calendar,
  TrendingUp,
  DollarSign,
  Target,
  Users,
  Briefcase,
  PieChart,
  BarChart3,
  Calculator,
  Crown,
  Shield,
  Zap
} from 'lucide-react'

const VaultAccess = () => {
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const categories = [
    { id: 'all', name: 'All Resources', icon: Folder },
    { id: 'templates', name: 'Templates', icon: FileText },
    { id: 'calculators', name: 'Calculators', icon: Calculator },
    { id: 'guides', name: 'Guides', icon: Star },
    { id: 'business', name: 'Business Tools', icon: Briefcase }
  ]

  const vaultResources = [
    {
      id: 'ultimate-budget-template',
      title: 'Ultimate Budget Planning Template',
      description: 'Comprehensive Excel template with automated calculations, charts, and 12-month planning',
      category: 'templates',
      type: 'Excel Template',
      size: '2.4 MB',
      downloads: 3420,
      rating: 4.9,
      premium: true,
      tags: ['budgeting', 'planning', 'excel'],
      lastUpdated: '2024-01-15'
    },
    {
      id: 'investment-tracker',
      title: 'Investment Portfolio Tracker',
      description: 'Track your investments across multiple accounts with real-time performance metrics',
      category: 'templates',
      type: 'Google Sheets',
      size: '1.8 MB',
      downloads: 2890,
      rating: 4.8,
      premium: true,
      tags: ['investing', 'portfolio', 'tracking'],
      lastUpdated: '2024-01-20'
    },
    {
      id: 'business-financial-model',
      title: 'Startup Financial Model Template',
      description: 'Complete 5-year financial model for startups with revenue projections and funding scenarios',
      category: 'business',
      type: 'Excel Template',
      size: '4.2 MB',
      downloads: 1560,
      rating: 4.9,
      premium: true,
      tags: ['startup', 'financial-model', 'business'],
      lastUpdated: '2024-01-10'
    },
    {
      id: 'retirement-calculator',
      title: 'Advanced Retirement Calculator',
      description: 'Calculate retirement needs with inflation, tax considerations, and multiple income sources',
      category: 'calculators',
      type: 'Interactive Tool',
      size: '850 KB',
      downloads: 4120,
      rating: 4.7,
      premium: true,
      tags: ['retirement', 'calculator', 'planning'],
      lastUpdated: '2024-01-25'
    },
    {
      id: 'debt-payoff-strategy',
      title: 'Debt Payoff Strategy Guide',
      description: 'Complete guide with templates for debt snowball, avalanche, and hybrid strategies',
      category: 'guides',
      type: 'PDF + Templates',
      size: '3.1 MB',
      downloads: 2750,
      rating: 4.8,
      premium: true,
      tags: ['debt', 'payoff', 'strategy'],
      lastUpdated: '2024-01-18'
    },
    {
      id: 'tax-optimization-kit',
      title: 'Tax Optimization Toolkit',
      description: 'Templates and guides for maximizing tax deductions and minimizing tax liability',
      category: 'templates',
      type: 'Multi-file Kit',
      size: '5.6 MB',
      downloads: 1890,
      rating: 4.9,
      premium: true,
      tags: ['tax', 'optimization', 'deductions'],
      lastUpdated: '2024-01-12'
    },
    {
      id: 'cash-flow-projector',
      title: 'Business Cash Flow Projector',
      description: 'Predict and manage business cash flow with scenario planning and alerts',
      category: 'business',
      type: 'Excel Template',
      size: '2.9 MB',
      downloads: 1340,
      rating: 4.6,
      premium: true,
      tags: ['cash-flow', 'business', 'projections'],
      lastUpdated: '2024-01-22'
    },
    {
      id: 'real-estate-analyzer',
      title: 'Real Estate Investment Analyzer',
      description: 'Analyze rental properties with ROI calculations, cash flow analysis, and market comparisons',
      category: 'calculators',
      type: 'Excel Calculator',
      size: '3.3 MB',
      downloads: 2100,
      rating: 4.8,
      premium: true,
      tags: ['real-estate', 'investment', 'roi'],
      lastUpdated: '2024-01-08'
    }
  ]

  const filteredResources = vaultResources.filter(resource => {
    const matchesCategory = activeCategory === 'all' || resource.category === activeCategory
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  const getTypeIcon = (type) => {
    if (type.includes('Excel')) return BarChart3
    if (type.includes('PDF')) return FileText
    if (type.includes('Calculator') || type.includes('Tool')) return Calculator
    if (type.includes('Sheets')) return PieChart
    return Folder
  }

  const handleDownload = (resourceId) => {
    // In a real app, this would trigger the actual download
    console.log(`Downloading resource: ${resourceId}`)
  }

  return (
    <div className="space-y-8">
      <div className="page-header">
        <h1 className="page-title flex items-center gap-3">
          <Lock className="w-8 h-8 text-purple-400" />
          Vault Access
        </h1>
        <p className="page-subtitle">Exclusive premium templates, tools, and resources for FlowFund members</p>
        <div className="flex items-center gap-2 mt-2">
          <Crown className="w-5 h-5 text-yellow-400" />
          <span className="text-yellow-400 font-medium">Premium Member Benefits</span>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="dashboard-card">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-grow">
            <input
              type="text"
              placeholder="Search resources, templates, and tools..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-purple-500 focus:outline-none"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  activeCategory === category.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                <category.icon className="w-4 h-4" />
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-purple-600/20 border border-purple-500/30 rounded-lg">
            <div className="flex items-center gap-2">
              <Folder className="w-5 h-5 text-purple-400" />
              <div>
                <p className="text-purple-400 text-sm">Total Resources</p>
                <p className="text-white font-semibold">{vaultResources.length}</p>
              </div>
            </div>
          </div>
          <div className="p-4 bg-blue-600/20 border border-blue-500/30 rounded-lg">
            <div className="flex items-center gap-2">
              <Download className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-blue-400 text-sm">Total Downloads</p>
                <p className="text-white font-semibold">
                  {vaultResources.reduce((sum, r) => sum + r.downloads, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          <div className="p-4 bg-green-600/20 border border-green-500/30 rounded-lg">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-green-400" />
              <div>
                <p className="text-green-400 text-sm">Avg Rating</p>
                <p className="text-white font-semibold">
                  {(vaultResources.reduce((sum, r) => sum + r.rating, 0) / vaultResources.length).toFixed(1)}
                </p>
              </div>
            </div>
          </div>
          <div className="p-4 bg-yellow-600/20 border border-yellow-500/30 rounded-lg">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              <div>
                <p className="text-yellow-400 text-sm">New This Month</p>
                <p className="text-white font-semibold">3</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((resource) => {
          const TypeIcon = getTypeIcon(resource.type)
          
          return (
            <div key={resource.id} className="dashboard-card hover:border-purple-500/50 transition-colors">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <TypeIcon className="w-5 h-5 text-purple-400" />
                  <span className="text-xs text-purple-400 bg-purple-400/20 px-2 py-1 rounded">
                    {resource.type}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Crown className="w-4 h-4 text-yellow-400" />
                  <span className="text-xs text-yellow-400">Premium</span>
                </div>
              </div>

              <h3 className="text-white font-semibold text-lg mb-2">{resource.title}</h3>
              <p className="text-gray-400 text-sm mb-4 line-clamp-2">{resource.description}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-4">
                {resource.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Stats */}
              <div className="flex justify-between items-center text-sm text-gray-400 mb-4">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Download className="w-4 h-4" />
                    {resource.downloads.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    {resource.rating}
                  </span>
                </div>
                <span>{resource.size}</span>
              </div>

              {/* Last Updated */}
              <div className="flex items-center gap-1 text-xs text-gray-500 mb-4">
                <Calendar className="w-3 h-3" />
                Updated {new Date(resource.lastUpdated).toLocaleDateString()}
              </div>

              {/* Download Button */}
              <button
                onClick={() => handleDownload(resource.id)}
                className="w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download Now
              </button>
            </div>
          )
        })}
      </div>

      {/* Empty State */}
      {filteredResources.length === 0 && (
        <div className="dashboard-card text-center py-12">
          <Folder className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-white font-semibold text-lg mb-2">No resources found</h3>
          <p className="text-gray-400">
            {searchTerm 
              ? `No resources match "${searchTerm}". Try adjusting your search terms.`
              : 'No resources available in this category.'
            }
          </p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Clear Search
            </button>
          )}
        </div>
      )}

      {/* Premium Benefits */}
      <div className="dashboard-card bg-gradient-to-r from-purple-600/20 to-yellow-600/20 border-purple-500/30">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-6 h-6 text-yellow-400" />
          <h3 className="text-xl font-semibold text-white">Premium Member Benefits</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <Download className="w-5 h-5 text-purple-400" />
            <div>
              <p className="text-white font-medium">Unlimited Downloads</p>
              <p className="text-gray-400 text-sm">Access all premium resources</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Zap className="w-5 h-5 text-yellow-400" />
            <div>
              <p className="text-white font-medium">Early Access</p>
              <p className="text-gray-400 text-sm">Get new resources first</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-green-400" />
            <div>
              <p className="text-white font-medium">Priority Support</p>
              <p className="text-gray-400 text-sm">Get help when you need it</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VaultAccess

