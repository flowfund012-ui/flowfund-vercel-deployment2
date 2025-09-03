import { useState } from 'react'
import { Button } from '../components/ui/button'
import { PiggyBank, TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react'

const BudgetPlanner = () => {
  const [budgets, setBudgets] = useState([
    { id: 1, category: 'Housing', budgeted: 1200, spent: 1200, color: '#3b82f6' },
    { id: 2, category: 'Food', budgeted: 400, spent: 325, color: '#10b981' },
    { id: 3, category: 'Transportation', budgeted: 300, spent: 275, color: '#f59e0b' },
    { id: 4, category: 'Entertainment', budgeted: 200, spent: 180, color: '#ef4444' },
    { id: 5, category: 'Utilities', budgeted: 150, spent: 145, color: '#8b5cf6' },
    { id: 6, category: 'Shopping', budgeted: 250, spent: 320, color: '#ec4899' }
  ])

  const totalBudgeted = budgets.reduce((sum, budget) => sum + budget.budgeted, 0)
  const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0)
  const remaining = totalBudgeted - totalSpent

  const getBudgetStatus = (budgeted, spent) => {
    const percentage = (spent / budgeted) * 100
    if (percentage > 100) return { status: 'over', color: 'text-red-500', icon: AlertTriangle }
    if (percentage > 80) return { status: 'warning', color: 'text-yellow-500', icon: AlertTriangle }
    return { status: 'good', color: 'text-green-500', icon: CheckCircle }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Budget Planner</h1>
        <p className="page-subtitle">
          Plan and track your monthly budget to stay on top of your finances
        </p>
      </div>

      {/* Budget Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="metric-card">
          <div className="flex items-center justify-between mb-2">
            <PiggyBank className="h-5 w-5 text-primary" />
          </div>
          <div className="metric-value">${totalBudgeted.toLocaleString()}</div>
          <div className="metric-label">Total Budgeted</div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between mb-2">
            <TrendingDown className="h-5 w-5 text-red-500" />
          </div>
          <div className="metric-value">${totalSpent.toLocaleString()}</div>
          <div className="metric-label">Total Spent</div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className={`h-5 w-5 ${remaining >= 0 ? 'text-green-500' : 'text-red-500'}`} />
          </div>
          <div className={`metric-value ${remaining >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            ${Math.abs(remaining).toLocaleString()}
          </div>
          <div className="metric-label">{remaining >= 0 ? 'Remaining' : 'Over Budget'}</div>
        </div>
      </div>

      {/* Budget Categories */}
      <div className="dashboard-card">
        <div className="section-header">
          <h3 className="section-title">Budget Categories</h3>
          <p className="section-subtitle">Track your spending against your budget for each category</p>
        </div>

        <div className="space-y-6">
          {budgets.map((budget) => {
            const percentage = Math.min((budget.spent / budget.budgeted) * 100, 100)
            const overBudget = budget.spent > budget.budgeted
            const { status, color, icon: StatusIcon } = getBudgetStatus(budget.budgeted, budget.spent)

            return (
              <div key={budget.id} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: budget.color }}
                    />
                    <span className="font-medium">{budget.category}</span>
                    <StatusIcon className={`h-4 w-4 ${color}`} />
                  </div>
                  <div className="text-right">
                    <span className="font-semibold">
                      ${budget.spent.toLocaleString()} / ${budget.budgeted.toLocaleString()}
                    </span>
                    <p className="text-sm text-muted-foreground">
                      {overBudget ? '+' : ''}${(budget.spent - budget.budgeted).toLocaleString()} remaining
                    </p>
                  </div>
                </div>
                
                <div className="progress-bar">
                  <div 
                    className={`h-full transition-all duration-500 rounded-full ${
                      overBudget ? 'bg-red-500' : 'bg-gradient-to-r from-primary to-accent'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>0%</span>
                  <span>{percentage.toFixed(1)}% used</span>
                  <span>100%</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Budget Tips */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="dashboard-card">
          <h3 className="section-title mb-4">Budget Tips</h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Follow the 50/30/20 Rule</p>
                <p className="text-sm text-muted-foreground">50% needs, 30% wants, 20% savings</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Track Daily Expenses</p>
                <p className="text-sm text-muted-foreground">Small purchases add up quickly</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Review Monthly</p>
                <p className="text-sm text-muted-foreground">Adjust budgets based on spending patterns</p>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <h3 className="section-title mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Button className="w-full justify-start" variant="outline">
              <PiggyBank className="h-4 w-4 mr-2" />
              Adjust Budget Categories
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <TrendingUp className="h-4 w-4 mr-2" />
              Set Savings Goal
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Set Budget Alerts
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BudgetPlanner

