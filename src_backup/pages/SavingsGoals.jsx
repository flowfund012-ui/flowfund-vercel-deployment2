import { useState } from 'react'
import { Button } from '../components/ui/button'
import { Plus, Target, TrendingUp, Calendar, DollarSign, Edit, Trash2 } from 'lucide-react'

const SavingsGoals = () => {
  const [goals, setGoals] = useState([
    {
      id: 1,
      name: 'Emergency Fund',
      targetAmount: 10000,
      currentAmount: 3500,
      deadline: '2024-12-31',
      category: 'Emergency',
      priority: 'high',
      monthlyContribution: 500
    },
    {
      id: 2,
      name: 'Vacation to Europe',
      targetAmount: 5000,
      currentAmount: 1200,
      deadline: '2024-08-15',
      category: 'Travel',
      priority: 'medium',
      monthlyContribution: 300
    },
    {
      id: 3,
      name: 'New Laptop',
      targetAmount: 2500,
      currentAmount: 800,
      deadline: '2024-06-01',
      category: 'Technology',
      priority: 'low',
      monthlyContribution: 200
    }
  ])

  const [showAddForm, setShowAddForm] = useState(false)
  const [editingGoal, setEditingGoal] = useState(null)
  const [newGoal, setNewGoal] = useState({
    name: '',
    targetAmount: '',
    currentAmount: '',
    deadline: '',
    category: 'Emergency',
    priority: 'medium',
    monthlyContribution: ''
  })

  const totalTargetAmount = goals.reduce((sum, goal) => sum + goal.targetAmount, 0)
  const totalCurrentAmount = goals.reduce((sum, goal) => sum + goal.currentAmount, 0)
  const totalProgress = (totalCurrentAmount / totalTargetAmount) * 100

  const handleAddGoal = (e) => {
    e.preventDefault()
    const goal = {
      id: Date.now(),
      name: newGoal.name,
      targetAmount: parseFloat(newGoal.targetAmount),
      currentAmount: parseFloat(newGoal.currentAmount) || 0,
      deadline: newGoal.deadline,
      category: newGoal.category,
      priority: newGoal.priority,
      monthlyContribution: parseFloat(newGoal.monthlyContribution) || 0
    }
    setGoals([...goals, goal])
    setNewGoal({ name: '', targetAmount: '', currentAmount: '', deadline: '', category: 'Emergency', priority: 'medium', monthlyContribution: '' })
    setShowAddForm(false)
  }

  const handleEditGoal = (goal) => {
    setEditingGoal(goal.id)
    setNewGoal({
      name: goal.name,
      targetAmount: goal.targetAmount.toString(),
      currentAmount: goal.currentAmount.toString(),
      deadline: goal.deadline,
      category: goal.category,
      priority: goal.priority,
      monthlyContribution: goal.monthlyContribution.toString()
    })
    setShowAddForm(true)
  }

  const handleUpdateGoal = (e) => {
    e.preventDefault()
    const updatedGoals = goals.map(goal => 
      goal.id === editingGoal 
        ? {
            ...goal,
            name: newGoal.name,
            targetAmount: parseFloat(newGoal.targetAmount),
            currentAmount: parseFloat(newGoal.currentAmount),
            deadline: newGoal.deadline,
            category: newGoal.category,
            priority: newGoal.priority,
            monthlyContribution: parseFloat(newGoal.monthlyContribution)
          }
        : goal
    )
    setGoals(updatedGoals)
    setEditingGoal(null)
    setNewGoal({ name: '', targetAmount: '', currentAmount: '', deadline: '', category: 'Emergency', priority: 'medium', monthlyContribution: '' })
    setShowAddForm(false)
  }

  const handleDeleteGoal = (goalId) => {
    setGoals(goals.filter(goal => goal.id !== goalId))
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-500 bg-red-500/20'
      case 'medium': return 'text-yellow-500 bg-yellow-500/20'
      case 'low': return 'text-green-500 bg-green-500/20'
      default: return 'text-gray-500 bg-gray-500/20'
    }
  }

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-green-500'
    if (progress >= 50) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const categories = ['Emergency', 'Travel', 'Technology', 'Education', 'Investment', 'Home', 'Car', 'Other']
  const priorities = ['high', 'medium', 'low']

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Savings Goals</h1>
        <p className="page-subtitle">
          Set and track your financial goals to achieve your dreams
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="metric-card">
          <div className="flex items-center justify-between mb-2">
            <Target className="h-5 w-5 text-primary" />
          </div>
          <div className="metric-value">${totalTargetAmount.toLocaleString()}</div>
          <div className="metric-label">Total Target Amount</div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="h-5 w-5 text-green-500" />
          </div>
          <div className="metric-value">${totalCurrentAmount.toLocaleString()}</div>
          <div className="metric-label">Total Saved</div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="h-5 w-5 text-blue-500" />
          </div>
          <div className="metric-value">{totalProgress.toFixed(1)}%</div>
          <div className="metric-label">Overall Progress</div>
          <div className="progress-bar mt-2">
            <div 
              className="progress-fill" 
              style={{ width: `${Math.min(totalProgress, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Add Goal Button */}
      <div className="flex justify-between items-center">
        <h2 className="section-title">Your Goals</h2>
        <Button onClick={() => setShowAddForm(true)} className="btn-primary">
          <Plus className="h-4 w-4 mr-2" />
          Add Goal
        </Button>
      </div>

      {/* Add/Edit Goal Form */}
      {showAddForm && (
        <div className="dashboard-card">
          <h3 className="section-title mb-4">
            {editingGoal ? 'Edit Goal' : 'Add New Goal'}
          </h3>
          <form onSubmit={editingGoal ? handleUpdateGoal : handleAddGoal} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-field">
              <label className="form-label">Goal Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g., Emergency Fund"
                value={newGoal.name}
                onChange={(e) => setNewGoal({...newGoal, name: e.target.value})}
                required
              />
            </div>

            <div className="form-field">
              <label className="form-label">Target Amount</label>
              <input
                type="number"
                step="0.01"
                className="form-input"
                placeholder="10000.00"
                value={newGoal.targetAmount}
                onChange={(e) => setNewGoal({...newGoal, targetAmount: e.target.value})}
                required
              />
            </div>

            <div className="form-field">
              <label className="form-label">Current Amount</label>
              <input
                type="number"
                step="0.01"
                className="form-input"
                placeholder="0.00"
                value={newGoal.currentAmount}
                onChange={(e) => setNewGoal({...newGoal, currentAmount: e.target.value})}
              />
            </div>

            <div className="form-field">
              <label className="form-label">Target Date</label>
              <input
                type="date"
                className="form-input"
                value={newGoal.deadline}
                onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
                required
              />
            </div>

            <div className="form-field">
              <label className="form-label">Category</label>
              <select
                className="form-input"
                value={newGoal.category}
                onChange={(e) => setNewGoal({...newGoal, category: e.target.value})}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label className="form-label">Priority</label>
              <select
                className="form-input"
                value={newGoal.priority}
                onChange={(e) => setNewGoal({...newGoal, priority: e.target.value})}
              >
                {priorities.map(priority => (
                  <option key={priority} value={priority}>
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label className="form-label">Monthly Contribution</label>
              <input
                type="number"
                step="0.01"
                className="form-input"
                placeholder="500.00"
                value={newGoal.monthlyContribution}
                onChange={(e) => setNewGoal({...newGoal, monthlyContribution: e.target.value})}
              />
            </div>

            <div className="md:col-span-2 flex space-x-4">
              <Button type="submit" className="btn-primary">
                {editingGoal ? 'Update Goal' : 'Add Goal'}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setShowAddForm(false)
                  setEditingGoal(null)
                  setNewGoal({ name: '', targetAmount: '', currentAmount: '', deadline: '', category: 'Emergency', priority: 'medium', monthlyContribution: '' })
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Goals List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {goals.map((goal) => {
          const progress = (goal.currentAmount / goal.targetAmount) * 100
          const remaining = goal.targetAmount - goal.currentAmount
          const monthsToGoal = goal.monthlyContribution > 0 ? Math.ceil(remaining / goal.monthlyContribution) : 0

          return (
            <div key={goal.id} className="dashboard-card">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{goal.name}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`text-xs px-2 py-1 rounded ${getPriorityColor(goal.priority)}`}>
                      {goal.priority.toUpperCase()}
                    </span>
                    <span className="text-sm text-muted-foreground">{goal.category}</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditGoal(goal)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteGoal(goal.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Progress</span>
                  <span className="font-semibold">{progress.toFixed(1)}%</span>
                </div>

                <div className="progress-bar">
                  <div 
                    className={`h-full transition-all duration-500 rounded-full ${getProgressColor(progress)}`}
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Current</p>
                    <p className="font-semibold">${goal.currentAmount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Target</p>
                    <p className="font-semibold">${goal.targetAmount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Remaining</p>
                    <p className="font-semibold">${remaining.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Deadline</p>
                    <p className="font-semibold">{new Date(goal.deadline).toLocaleDateString()}</p>
                  </div>
                </div>

                {goal.monthlyContribution > 0 && (
                  <div className="bg-muted/30 p-3 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Monthly Contribution</span>
                      <span className="font-semibold">${goal.monthlyContribution.toLocaleString()}</span>
                    </div>
                    {monthsToGoal > 0 && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {monthsToGoal} months to reach goal at current rate
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {goals.length === 0 && (
        <div className="dashboard-card text-center py-12">
          <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Goals Yet</h3>
          <p className="text-muted-foreground mb-4">
            Start by creating your first savings goal to track your progress
          </p>
          <Button onClick={() => setShowAddForm(true)} className="btn-primary">
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Goal
          </Button>
        </div>
      )}
    </div>
  )
}

export default SavingsGoals

