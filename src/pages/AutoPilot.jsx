import { useState } from 'react'
import { Button } from '../components/ui/button'
import { Play, Pause, Settings, Zap, TrendingUp, DollarSign, Target, AlertCircle } from 'lucide-react'

const AutoPilot = () => {
  const [automationRules, setAutomationRules] = useState([
    {
      id: 1,
      name: 'Emergency Fund Auto-Save',
      description: 'Automatically save 10% of income to emergency fund',
      type: 'savings',
      trigger: 'income_received',
      action: 'transfer_percentage',
      percentage: 10,
      targetAccount: 'Emergency Fund',
      isActive: true,
      totalSaved: 2450
    },
    {
      id: 2,
      name: 'Bill Payment Reminder',
      description: 'Automatically pay recurring bills 3 days before due date',
      type: 'bills',
      trigger: 'due_date_approaching',
      action: 'auto_pay',
      daysBeforeDue: 3,
      isActive: true,
      billsPaid: 12
    },
    {
      id: 3,
      name: 'Investment Auto-Pilot',
      description: 'Invest $500 monthly in index funds',
      type: 'investment',
      trigger: 'monthly_schedule',
      action: 'invest_amount',
      amount: 500,
      targetInvestment: 'S&P 500 Index',
      isActive: false,
      totalInvested: 0
    },
    {
      id: 4,
      name: 'Expense Category Alert',
      description: 'Alert when dining out exceeds $200/month',
      type: 'alert',
      trigger: 'category_limit',
      action: 'send_notification',
      category: 'Dining',
      limit: 200,
      isActive: true,
      alertsTriggered: 2
    }
  ])

  const [showAddForm, setShowAddForm] = useState(false)
  const [newRule, setNewRule] = useState({
    name: '',
    description: '',
    type: 'savings',
    trigger: 'income_received',
    action: 'transfer_percentage',
    percentage: 10,
    amount: 100,
    targetAccount: '',
    category: 'Food',
    limit: 100,
    daysBeforeDue: 3
  })

  const activeRules = automationRules.filter(rule => rule.isActive).length
  const totalSaved = automationRules.reduce((sum, rule) => sum + (rule.totalSaved || 0), 0)
  const totalInvested = automationRules.reduce((sum, rule) => sum + (rule.totalInvested || 0), 0)

  const handleToggleRule = (ruleId) => {
    setAutomationRules(automationRules.map(rule => 
      rule.id === ruleId ? { ...rule, isActive: !rule.isActive } : rule
    ))
  }

  const handleAddRule = (e) => {
    e.preventDefault()
    const rule = {
      id: Date.now(),
      name: newRule.name,
      description: newRule.description,
      type: newRule.type,
      trigger: newRule.trigger,
      action: newRule.action,
      percentage: newRule.percentage,
      amount: newRule.amount,
      targetAccount: newRule.targetAccount,
      category: newRule.category,
      limit: newRule.limit,
      daysBeforeDue: newRule.daysBeforeDue,
      isActive: false,
      totalSaved: 0,
      totalInvested: 0,
      billsPaid: 0,
      alertsTriggered: 0
    }
    setAutomationRules([...automationRules, rule])
    setNewRule({
      name: '',
      description: '',
      type: 'savings',
      trigger: 'income_received',
      action: 'transfer_percentage',
      percentage: 10,
      amount: 100,
      targetAccount: '',
      category: 'Food',
      limit: 100,
      daysBeforeDue: 3
    })
    setShowAddForm(false)
  }

  const getRuleIcon = (type) => {
    switch (type) {
      case 'savings': return <DollarSign className="h-5 w-5 text-green-500" />
      case 'investment': return <TrendingUp className="h-5 w-5 text-blue-500" />
      case 'bills': return <Target className="h-5 w-5 text-purple-500" />
      case 'alert': return <AlertCircle className="h-5 w-5 text-yellow-500" />
      default: return <Zap className="h-5 w-5 text-primary" />
    }
  }

  const ruleTypes = ['savings', 'investment', 'bills', 'alert']
  const triggers = ['income_received', 'monthly_schedule', 'due_date_approaching', 'category_limit']
  const actions = ['transfer_percentage', 'transfer_amount', 'invest_amount', 'auto_pay', 'send_notification']
  const categories = ['Food', 'Transportation', 'Entertainment', 'Shopping', 'Utilities', 'Healthcare']

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">AutoPilot</h1>
        <p className="page-subtitle">
          Automate your financial management with smart rules and triggers
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="metric-card">
          <div className="flex items-center justify-between mb-2">
            <Zap className="h-5 w-5 text-primary" />
          </div>
          <div className="metric-value">{activeRules}</div>
          <div className="metric-label">Active Rules</div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="h-5 w-5 text-green-500" />
          </div>
          <div className="metric-value">${totalSaved.toLocaleString()}</div>
          <div className="metric-label">Auto-Saved</div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="h-5 w-5 text-blue-500" />
          </div>
          <div className="metric-value">${totalInvested.toLocaleString()}</div>
          <div className="metric-label">Auto-Invested</div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between mb-2">
            <Target className="h-5 w-5 text-purple-500" />
          </div>
          <div className="metric-value">{automationRules.length}</div>
          <div className="metric-label">Total Rules</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="dashboard-card">
        <h3 className="section-title mb-4">Quick Setup</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button variant="outline" className="h-auto p-4 flex flex-col items-start space-y-2">
            <DollarSign className="h-6 w-6 text-green-500" />
            <div className="text-left">
              <p className="font-medium">Auto-Save Setup</p>
              <p className="text-sm text-muted-foreground">Save a percentage of every income</p>
            </div>
          </Button>
          
          <Button variant="outline" className="h-auto p-4 flex flex-col items-start space-y-2">
            <Target className="h-6 w-6 text-purple-500" />
            <div className="text-left">
              <p className="font-medium">Bill Automation</p>
              <p className="text-sm text-muted-foreground">Never miss a payment again</p>
            </div>
          </Button>
          
          <Button variant="outline" className="h-auto p-4 flex flex-col items-start space-y-2">
            <TrendingUp className="h-6 w-6 text-blue-500" />
            <div className="text-left">
              <p className="font-medium">Investment Pilot</p>
              <p className="text-sm text-muted-foreground">Automate your investment strategy</p>
            </div>
          </Button>
        </div>
      </div>

      {/* Add Rule Button */}
      <div className="flex justify-between items-center">
        <h2 className="section-title">Automation Rules</h2>
        <Button onClick={() => setShowAddForm(true)} className="btn-primary">
          <Settings className="h-4 w-4 mr-2" />
          Create Rule
        </Button>
      </div>

      {/* Add Rule Form */}
      {showAddForm && (
        <div className="dashboard-card">
          <h3 className="section-title mb-4">Create Automation Rule</h3>
          <form onSubmit={handleAddRule} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-field">
              <label className="form-label">Rule Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g., Emergency Fund Auto-Save"
                value={newRule.name}
                onChange={(e) => setNewRule({...newRule, name: e.target.value})}
                required
              />
            </div>

            <div className="form-field">
              <label className="form-label">Rule Type</label>
              <select
                className="form-input"
                value={newRule.type}
                onChange={(e) => setNewRule({...newRule, type: e.target.value})}
              >
                {ruleTypes.map(type => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-field md:col-span-2">
              <label className="form-label">Description</label>
              <textarea
                className="form-input"
                rows="2"
                placeholder="Describe what this rule does..."
                value={newRule.description}
                onChange={(e) => setNewRule({...newRule, description: e.target.value})}
                required
              />
            </div>

            <div className="form-field">
              <label className="form-label">Trigger</label>
              <select
                className="form-input"
                value={newRule.trigger}
                onChange={(e) => setNewRule({...newRule, trigger: e.target.value})}
              >
                {triggers.map(trigger => (
                  <option key={trigger} value={trigger}>
                    {trigger.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label className="form-label">Action</label>
              <select
                className="form-input"
                value={newRule.action}
                onChange={(e) => setNewRule({...newRule, action: e.target.value})}
              >
                {actions.map(action => (
                  <option key={action} value={action}>
                    {action.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>

            {(newRule.action === 'transfer_percentage') && (
              <div className="form-field">
                <label className="form-label">Percentage (%)</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  className="form-input"
                  value={newRule.percentage}
                  onChange={(e) => setNewRule({...newRule, percentage: parseInt(e.target.value)})}
                />
              </div>
            )}

            {(newRule.action === 'transfer_amount' || newRule.action === 'invest_amount') && (
              <div className="form-field">
                <label className="form-label">Amount ($)</label>
                <input
                  type="number"
                  min="1"
                  className="form-input"
                  value={newRule.amount}
                  onChange={(e) => setNewRule({...newRule, amount: parseInt(e.target.value)})}
                />
              </div>
            )}

            {newRule.type === 'alert' && (
              <>
                <div className="form-field">
                  <label className="form-label">Category</label>
                  <select
                    className="form-input"
                    value={newRule.category}
                    onChange={(e) => setNewRule({...newRule, category: e.target.value})}
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="form-field">
                  <label className="form-label">Limit ($)</label>
                  <input
                    type="number"
                    min="1"
                    className="form-input"
                    value={newRule.limit}
                    onChange={(e) => setNewRule({...newRule, limit: parseInt(e.target.value)})}
                  />
                </div>
              </>
            )}

            <div className="md:col-span-2 flex space-x-4">
              <Button type="submit" className="btn-primary">Create Rule</Button>
              <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Rules List */}
      <div className="space-y-4">
        {automationRules.map((rule) => (
          <div key={rule.id} className={`dashboard-card ${rule.isActive ? 'border-green-500/50' : 'border-gray-500/50'}`}>
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="mt-1">
                  {getRuleIcon(rule.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-semibold">{rule.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded ${
                      rule.isActive ? 'bg-green-500/20 text-green-500' : 'bg-gray-500/20 text-gray-500'
                    }`}>
                      {rule.isActive ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm mb-3">{rule.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    {rule.totalSaved > 0 && (
                      <div>
                        <p className="text-muted-foreground">Total Saved</p>
                        <p className="font-semibold text-green-500">${rule.totalSaved.toLocaleString()}</p>
                      </div>
                    )}
                    {rule.totalInvested > 0 && (
                      <div>
                        <p className="text-muted-foreground">Total Invested</p>
                        <p className="font-semibold text-blue-500">${rule.totalInvested.toLocaleString()}</p>
                      </div>
                    )}
                    {rule.billsPaid > 0 && (
                      <div>
                        <p className="text-muted-foreground">Bills Paid</p>
                        <p className="font-semibold text-purple-500">{rule.billsPaid}</p>
                      </div>
                    )}
                    {rule.alertsTriggered > 0 && (
                      <div>
                        <p className="text-muted-foreground">Alerts Sent</p>
                        <p className="font-semibold text-yellow-500">{rule.alertsTriggered}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleToggleRule(rule.id)}
                  className={rule.isActive ? 'text-red-500 hover:text-red-700' : 'text-green-500 hover:text-green-700'}
                >
                  {rule.isActive ? (
                    <>
                      <Pause className="h-4 w-4 mr-1" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-1" />
                      Activate
                    </>
                  )}
                </Button>
                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {automationRules.length === 0 && (
        <div className="dashboard-card text-center py-12">
          <Zap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Automation Rules</h3>
          <p className="text-muted-foreground mb-4">
            Create your first automation rule to start managing your finances on autopilot
          </p>
          <Button onClick={() => setShowAddForm(true)} className="btn-primary">
            <Settings className="h-4 w-4 mr-2" />
            Create Your First Rule
          </Button>
        </div>
      )}
    </div>
  )
}

export default AutoPilot

