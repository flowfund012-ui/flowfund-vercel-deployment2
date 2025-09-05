import { useState } from 'react'
import { Button } from '../components/ui/button'
import { Plus, TrendingUp, Calendar, DollarSign, Tag } from 'lucide-react'

const IncomeTracker = () => {
  const [incomeEntries, setIncomeEntries] = useState([
    { id: 1, source: 'Salary', amount: 4200, date: '2024-01-15', category: 'Employment', recurring: true },
    { id: 2, source: 'Freelance Project', amount: 800, date: '2024-01-13', category: 'Freelance', recurring: false },
    { id: 3, source: 'Investment Dividends', amount: 150, date: '2024-01-10', category: 'Investments', recurring: true },
    { id: 4, source: 'Side Business', amount: 300, date: '2024-01-08', category: 'Business', recurring: false }
  ])

  const [showAddForm, setShowAddForm] = useState(false)
  const [newIncome, setNewIncome] = useState({
    source: '',
    amount: '',
    date: '',
    category: 'Employment',
    recurring: false
  })

  const totalIncome = incomeEntries.reduce((sum, entry) => sum + entry.amount, 0)
  const monthlyRecurring = incomeEntries.filter(entry => entry.recurring).reduce((sum, entry) => sum + entry.amount, 0)

  const handleAddIncome = (e) => {
    e.preventDefault()
    const income = {
      id: Date.now(),
      source: newIncome.source,
      amount: parseFloat(newIncome.amount),
      date: newIncome.date,
      category: newIncome.category,
      recurring: newIncome.recurring
    }
    setIncomeEntries([income, ...incomeEntries])
    setNewIncome({ source: '', amount: '', date: '', category: 'Employment', recurring: false })
    setShowAddForm(false)
  }

  const categories = ['Employment', 'Freelance', 'Business', 'Investments', 'Other']

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Income Tracker</h1>
        <p className="page-subtitle">
          Monitor and manage all your income sources in one place
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="metric-card">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="h-5 w-5 text-primary" />
          </div>
          <div className="metric-value">${totalIncome.toLocaleString()}</div>
          <div className="metric-label">Total Income This Month</div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <div className="metric-value">${monthlyRecurring.toLocaleString()}</div>
          <div className="metric-label">Monthly Recurring Income</div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between mb-2">
            <Tag className="h-5 w-5 text-blue-500" />
          </div>
          <div className="metric-value">{incomeEntries.length}</div>
          <div className="metric-label">Income Sources</div>
        </div>
      </div>

      {/* Add Income Button */}
      <div className="flex justify-between items-center">
        <h2 className="section-title">Income Entries</h2>
        <Button onClick={() => setShowAddForm(true)} className="btn-primary">
          <Plus className="h-4 w-4 mr-2" />
          Add Income
        </Button>
      </div>

      {/* Add Income Form */}
      {showAddForm && (
        <div className="dashboard-card">
          <h3 className="section-title mb-4">Add New Income</h3>
          <form onSubmit={handleAddIncome} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-field">
              <label className="form-label">Income Source</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g., Salary, Freelance"
                value={newIncome.source}
                onChange={(e) => setNewIncome({...newIncome, source: e.target.value})}
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
                value={newIncome.amount}
                onChange={(e) => setNewIncome({...newIncome, amount: e.target.value})}
                required
              />
            </div>

            <div className="form-field">
              <label className="form-label">Date</label>
              <input
                type="date"
                className="form-input"
                value={newIncome.date}
                onChange={(e) => setNewIncome({...newIncome, date: e.target.value})}
                required
              />
            </div>

            <div className="form-field">
              <label className="form-label">Category</label>
              <select
                className="form-input"
                value={newIncome.category}
                onChange={(e) => setNewIncome({...newIncome, category: e.target.value})}
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
                  checked={newIncome.recurring}
                  onChange={(e) => setNewIncome({...newIncome, recurring: e.target.checked})}
                  className="h-4 w-4 text-primary focus:ring-primary border-border rounded"
                />
                <span className="text-sm">This is a recurring income</span>
              </label>
            </div>

            <div className="md:col-span-2 flex space-x-4">
              <Button type="submit" className="btn-primary">Add Income</Button>
              <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Income List */}
      <div className="dashboard-card">
        <div className="space-y-4">
          {incomeEntries.map((income) => (
            <div key={income.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="font-medium">{income.source}</p>
                  <p className="text-sm text-muted-foreground">
                    {income.category} • {income.date}
                    {income.recurring && <span className="ml-2 text-xs bg-primary/20 text-primary px-2 py-1 rounded">Recurring</span>}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="font-semibold text-green-500">+${income.amount.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default IncomeTracker

