import { useState } from 'react'
import { Button } from '../components/ui/button'
import { Plus, TrendingDown, Calendar, DollarSign, Tag } from 'lucide-react'

const ExpenseManager = () => {
  const [expenses, setExpenses] = useState([
    { id: 1, description: 'Rent Payment', amount: 1200, date: '2024-01-01', category: 'Housing', recurring: true },
    { id: 2, description: 'Grocery Shopping', amount: 125.50, date: '2024-01-14', category: 'Food', recurring: false },
    { id: 3, description: 'Gas Bill', amount: 85, date: '2024-01-12', category: 'Utilities', recurring: true },
    { id: 4, description: 'Coffee Shop', amount: 15.75, date: '2024-01-12', category: 'Food', recurring: false },
    { id: 5, description: 'Netflix Subscription', amount: 15.99, date: '2024-01-10', category: 'Entertainment', recurring: true }
  ])

  const [showAddForm, setShowAddForm] = useState(false)
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    date: '',
    category: 'Food',
    recurring: false
  })

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const monthlyRecurring = expenses.filter(expense => expense.recurring).reduce((sum, expense) => sum + expense.amount, 0)

  const handleAddExpense = (e) => {
    e.preventDefault()
    const expense = {
      id: Date.now(),
      description: newExpense.description,
      amount: parseFloat(newExpense.amount),
      date: newExpense.date,
      category: newExpense.category,
      recurring: newExpense.recurring
    }
    setExpenses([expense, ...expenses])
    setNewExpense({ description: '', amount: '', date: '', category: 'Food', recurring: false })
    setShowAddForm(false)
  }

  const categories = ['Food', 'Housing', 'Transportation', 'Utilities', 'Entertainment', 'Healthcare', 'Shopping', 'Other']

  const categoryTotals = categories.map(category => ({
    category,
    total: expenses.filter(expense => expense.category === category).reduce((sum, expense) => sum + expense.amount, 0)
  })).filter(item => item.total > 0)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Expense Manager</h1>
        <p className="page-subtitle">
          Track and categorize your expenses to understand your spending patterns
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="metric-card">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="h-5 w-5 text-red-500" />
          </div>
          <div className="metric-value">${totalExpenses.toLocaleString()}</div>
          <div className="metric-label">Total Expenses This Month</div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between mb-2">
            <TrendingDown className="h-5 w-5 text-orange-500" />
          </div>
          <div className="metric-value">${monthlyRecurring.toLocaleString()}</div>
          <div className="metric-label">Monthly Recurring Expenses</div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between mb-2">
            <Tag className="h-5 w-5 text-blue-500" />
          </div>
          <div className="metric-value">{expenses.length}</div>
          <div className="metric-label">Total Transactions</div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="dashboard-card">
        <h3 className="section-title mb-4">Spending by Category</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {categoryTotals.map((item, index) => (
            <div key={index} className="metric-card">
              <div className="metric-value text-lg">${item.total.toLocaleString()}</div>
              <div className="metric-label">{item.category}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Expense Button */}
      <div className="flex justify-between items-center">
        <h2 className="section-title">Recent Expenses</h2>
        <Button onClick={() => setShowAddForm(true)} className="btn-primary">
          <Plus className="h-4 w-4 mr-2" />
          Add Expense
        </Button>
      </div>

      {/* Add Expense Form */}
      {showAddForm && (
        <div className="dashboard-card">
          <h3 className="section-title mb-4">Add New Expense</h3>
          <form onSubmit={handleAddExpense} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-field">
              <label className="form-label">Description</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g., Grocery shopping"
                value={newExpense.description}
                onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                required
              />
            </div>

            <div className="form-field">
              <label className="form-label">Amount</label>
              <input
                type="number"
                step="0.01"
                className="form-input"
                placeholder="0.00"
                value={newExpense.amount}
                onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                required
              />
            </div>

            <div className="form-field">
              <label className="form-label">Date</label>
              <input
                type="date"
                className="form-input"
                value={newExpense.date}
                onChange={(e) => setNewExpense({...newExpense, date: e.target.value})}
                required
              />
            </div>

            <div className="form-field">
              <label className="form-label">Category</label>
              <select
                className="form-input"
                value={newExpense.category}
                onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="form-field md:col-span-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={newExpense.recurring}
                  onChange={(e) => setNewExpense({...newExpense, recurring: e.target.checked})}
                  className="h-4 w-4 text-primary focus:ring-primary border-border rounded"
                />
                <span className="text-sm">This is a recurring expense</span>
              </label>
            </div>

            <div className="md:col-span-2 flex space-x-4">
              <Button type="submit" className="btn-primary">Add Expense</Button>
              <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Expense List */}
      <div className="dashboard-card">
        <div className="space-y-4">
          {expenses.map((expense) => (
            <div key={expense.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
                  <TrendingDown className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <p className="font-medium">{expense.description}</p>
                  <p className="text-sm text-muted-foreground">
                    {expense.category} • {expense.date}
                    {expense.recurring && <span className="ml-2 text-xs bg-orange-500/20 text-orange-500 px-2 py-1 rounded">Recurring</span>}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="font-semibold text-red-500">-${expense.amount.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ExpenseManager

