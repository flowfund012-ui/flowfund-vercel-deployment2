import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Target, 
  PiggyBank,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Eye,
  MoreHorizontal
} from 'lucide-react'
import { Button } from '../components/ui/button'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const Dashboard = () => {
  const { profile } = useAuth()
  const [timeRange, setTimeRange] = useState('7d')

  // Mock data - in a real app, this would come from your backend
  const [dashboardData, setDashboardData] = useState({
    totalBalance: 12450.75,
    monthlyIncome: 4200.00,
    monthlyExpenses: 2850.30,
    savingsGoal: 15000,
    currentSavings: 8750.50,
    recentTransactions: [
      { id: 1, description: 'Salary Deposit', amount: 4200.00, type: 'income', date: '2024-01-15', category: 'Salary' },
      { id: 2, description: 'Grocery Shopping', amount: -125.50, type: 'expense', date: '2024-01-14', category: 'Food' },
      { id: 3, description: 'Freelance Project', amount: 800.00, type: 'income', date: '2024-01-13', category: 'Freelance' },
      { id: 4, description: 'Rent Payment', amount: -1200.00, type: 'expense', date: '2024-01-12', category: 'Housing' },
      { id: 5, description: 'Coffee Shop', amount: -15.75, type: 'expense', date: '2024-01-12', category: 'Food' }
    ],
    chartData: [
      { name: 'Jan 1', income: 4000, expenses: 2400 },
      { name: 'Jan 8', income: 3000, expenses: 1398 },
      { name: 'Jan 15', income: 2000, expenses: 9800 },
      { name: 'Jan 22', income: 2780, expenses: 3908 },
      { name: 'Jan 29', income: 1890, expenses: 4800 },
      { name: 'Feb 5', income: 2390, expenses: 3800 },
      { name: 'Feb 12', income: 3490, expenses: 4300 }
    ],
    expenseBreakdown: [
      { name: 'Housing', value: 1200, color: '#3b82f6' },
      { name: 'Food', value: 450, color: '#10b981' },
      { name: 'Transportation', value: 300, color: '#f59e0b' },
      { name: 'Entertainment', value: 200, color: '#ef4444' },
      { name: 'Utilities', value: 150, color: '#8b5cf6' },
      { name: 'Other', value: 250, color: '#6b7280' }
    ]
  })

  const savingsProgress = (dashboardData.currentSavings / dashboardData.savingsGoal) * 100

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">
          Welcome back, {profile?.full_name?.split(' ')[0] || 'Commander'}! 👋
        </h1>
        <p className="page-subtitle">
          Here's your financial overview for today. You're doing great!
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="metric-card">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="h-5 w-5 text-primary" />
            <span className="text-xs text-green-500 flex items-center">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              +12.5%
            </span>
          </div>
          <div className="metric-value">${dashboardData.totalBalance.toLocaleString()}</div>
          <div className="metric-label">Total Balance</div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            <span className="text-xs text-green-500 flex items-center">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              +8.2%
            </span>
          </div>
          <div className="metric-value">${dashboardData.monthlyIncome.toLocaleString()}</div>
          <div className="metric-label">Monthly Income</div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between mb-2">
            <TrendingDown className="h-5 w-5 text-red-500" />
            <span className="text-xs text-red-500 flex items-center">
              <ArrowDownRight className="h-3 w-3 mr-1" />
              +3.1%
            </span>
          </div>
          <div className="metric-value">${dashboardData.monthlyExpenses.toLocaleString()}</div>
          <div className="metric-label">Monthly Expenses</div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between mb-2">
            <Target className="h-5 w-5 text-primary" />
            <span className="text-xs text-primary">
              {savingsProgress.toFixed(1)}%
            </span>
          </div>
          <div className="metric-value">${dashboardData.currentSavings.toLocaleString()}</div>
          <div className="metric-label">Savings Goal</div>
          <div className="progress-bar mt-2">
            <div 
              className="progress-fill" 
              style={{ width: `${Math.min(savingsProgress, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income vs Expenses Chart */}
        <div className="dashboard-card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="section-title">Income vs Expenses</h3>
              <p className="section-subtitle">Track your financial flow over time</p>
            </div>
            <div className="flex items-center space-x-2">
              <select 
                value={timeRange} 
                onChange={(e) => setTimeRange(e.target.value)}
                className="text-sm bg-input border border-border rounded px-2 py-1"
              >
                <option value="7d">7 days</option>
                <option value="30d">30 days</option>
                <option value="90d">90 days</option>
              </select>
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dashboardData.chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.2 0.05 240)" />
              <XAxis dataKey="name" stroke="oklch(0.7 0.05 240)" />
              <YAxis stroke="oklch(0.7 0.05 240)" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'oklch(0.08 0.02 240)', 
                  border: '1px solid oklch(0.2 0.05 240)',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="income" 
                stroke="oklch(0.7 0.25 240)" 
                strokeWidth={3}
                dot={{ fill: 'oklch(0.7 0.25 240)', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="expenses" 
                stroke="oklch(0.577 0.245 27.325)" 
                strokeWidth={3}
                dot={{ fill: 'oklch(0.577 0.245 27.325)', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Expense Breakdown */}
        <div className="dashboard-card">
          <div className="mb-6">
            <h3 className="section-title">Expense Breakdown</h3>
            <p className="section-subtitle">Where your money goes this month</p>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={dashboardData.expenseBreakdown}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
              >
                {dashboardData.expenseBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`$${value}`, 'Amount']}
                contentStyle={{ 
                  backgroundColor: 'oklch(0.08 0.02 240)', 
                  border: '1px solid oklch(0.2 0.05 240)',
                  borderRadius: '8px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          
          <div className="grid grid-cols-2 gap-2 mt-4">
            {dashboardData.expenseBreakdown.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-muted-foreground">{item.name}</span>
                <span className="text-sm font-medium ml-auto">${item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="dashboard-card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="section-title">Recent Transactions</h3>
            <p className="section-subtitle">Your latest financial activity</p>
          </div>
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            View All
          </Button>
        </div>

        <div className="space-y-4">
          {dashboardData.recentTransactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-center space-x-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  transaction.type === 'income' ? 'bg-green-500/20' : 'bg-red-500/20'
                }`}>
                  {transaction.type === 'income' ? (
                    <TrendingUp className="h-5 w-5 text-green-500" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-red-500" />
                  )}
                </div>
                <div>
                  <p className="font-medium">{transaction.description}</p>
                  <p className="text-sm text-muted-foreground">{transaction.category} • {transaction.date}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`font-semibold ${
                  transaction.type === 'income' ? 'text-green-500' : 'text-red-500'
                }`}>
                  {transaction.type === 'income' ? '+' : ''}${Math.abs(transaction.amount).toLocaleString()}
                </span>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="dashboard-card text-center">
          <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Plus className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-semibold mb-2">Add Transaction</h3>
          <p className="text-sm text-muted-foreground mb-4">Record a new income or expense</p>
          <Button className="w-full">Add Transaction</Button>
        </div>

        <div className="dashboard-card text-center">
          <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Target className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-semibold mb-2">Set Goal</h3>
          <p className="text-sm text-muted-foreground mb-4">Create a new savings goal</p>
          <Button variant="outline" className="w-full">Create Goal</Button>
        </div>

        <div className="dashboard-card text-center">
          <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-4">
            <PiggyBank className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-semibold mb-2">Budget Review</h3>
          <p className="text-sm text-muted-foreground mb-4">Check your monthly budget</p>
          <Button variant="outline" className="w-full">Review Budget</Button>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

