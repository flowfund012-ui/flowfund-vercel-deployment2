import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Button } from './ui/button'
import { 
  LayoutDashboard, 
  TrendingUp, 
  TrendingDown, 
  PiggyBank, 
  Target, 
  Compass, 
  Zap, 
  Rocket, 
  GraduationCap, 
  Vault, 
  Shield, 
  User, 
  Menu, 
  X,
  LogOut,
  Settings
} from 'lucide-react'

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, profile, signOut, checkAccess } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      requiredPlan: null
    },
    {
      name: 'Income Tracker',
      href: '/income-tracker',
      icon: TrendingUp,
      requiredPlan: null
    },
    {
      name: 'Expense Manager',
      href: '/expense-manager',
      icon: TrendingDown,
      requiredPlan: null
    },
    {
      name: 'Budget Planner',
      href: '/budget-planner',
      icon: PiggyBank,
      requiredPlan: 'starter'
    },
    {
      name: 'Savings Goals',
      href: '/savings-goals',
      icon: Target,
      requiredPlan: 'starter'
    },
    {
      name: 'Mission Tracker',
      href: '/mission-tracker',
      icon: Compass,
      requiredPlan: 'starter'
    },
    {
      name: 'AutoPilot',
      href: '/autopilot',
      icon: Zap,
      requiredPlan: 'business'
    },
    {
      name: 'Growth Engine',
      href: '/growth-engine',
      icon: Rocket,
      requiredPlan: 'business'
    },
    {
      name: 'Personal Academy',
      href: '/personal-academy',
      icon: GraduationCap,
      requiredPlan: 'business'
    },
    {
      name: 'Vault Access',
      href: '/vault-access',
      icon: Vault,
      requiredPlan: 'premium'
    },
    {
      name: 'Security Hub',
      href: '/security-hub',
      icon: Shield,
      requiredPlan: null
    }
  ]

  const isActive = (href) => location.pathname === href

  const canAccess = (requiredPlan) => {
    if (!requiredPlan) return true
    return checkAccess(requiredPlan)
  }

  return (
    <div className="min-h-screen bg-gradient-bg">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border transform transition-transform duration-300 ease-in-out lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-sidebar-border">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">F</span>
              </div>
              <span className="text-xl font-bold" style={{
                background: 'linear-gradient(135deg, oklch(0.7 0.25 240), oklch(0.8 0.2 260))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>FlowFund</span>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* User info */}
          <div className="p-4 border-b border-sidebar-border">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">
                  {profile?.full_name || user?.email || 'User'}
                </p>
                <p className="text-xs text-sidebar-foreground/60 capitalize">
                  {profile?.subscription_plan || 'free'} Plan
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const hasAccess = canAccess(item.requiredPlan)
              
              return (
                <div key={item.name} className="relative">
                  <Link
                    to={hasAccess ? item.href : '/upgrade'}
                    className={`
                      sidebar-nav-item
                      ${isActive(item.href) ? 'active' : ''}
                      ${!hasAccess ? 'opacity-50' : ''}
                    `}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="flex-1">{item.name}</span>
                    {!hasAccess && (
                      <span className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded">
                        Pro
                      </span>
                    )}
                  </Link>
                </div>
              )
            })}
          </nav>

          {/* Bottom actions */}
          <div className="p-4 border-t border-sidebar-border space-y-2">
            <Link
              to="/profile"
              className="sidebar-nav-item"
              onClick={() => setSidebarOpen(false)}
            >
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </Link>
            <button
              onClick={handleSignOut}
              className="sidebar-nav-item w-full text-left text-destructive hover:bg-destructive/10"
            >
              <LogOut className="h-5 w-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="bg-card/50 backdrop-blur-xl border-b border-border/50 px-4 py-3">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-muted-foreground">
                Welcome back, <span className="text-foreground font-medium">{profile?.full_name || 'Commander'}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout

