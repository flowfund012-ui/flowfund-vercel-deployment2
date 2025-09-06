import { useState } from 'react'
import { 
  Shield, 
  Lock, 
  Key, 
  Eye, 
  EyeOff, 
  Smartphone,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Globe,
  Monitor,
  Settings,
  Bell,
  Download,
  Trash2,
  RefreshCw
} from 'lucide-react'

const SecurityHub = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [smsNotifications, setSmsNotifications] = useState(false)

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const securityScore = 85

  const securityChecks = [
    {
      id: 'strong-password',
      title: 'Strong Password',
      description: 'Your password meets security requirements',
      status: 'good',
      action: 'Change Password'
    },
    {
      id: 'two-factor',
      title: 'Two-Factor Authentication',
      description: twoFactorEnabled ? 'Two-factor authentication is enabled' : 'Enable 2FA for extra security',
      status: twoFactorEnabled ? 'good' : 'warning',
      action: twoFactorEnabled ? 'Manage 2FA' : 'Enable 2FA'
    },
    {
      id: 'email-verified',
      title: 'Email Verification',
      description: 'Your email address is verified',
      status: 'good',
      action: 'Update Email'
    },
    {
      id: 'recent-activity',
      title: 'Recent Activity',
      description: 'No suspicious activity detected',
      status: 'good',
      action: 'View Activity'
    },
    {
      id: 'data-backup',
      title: 'Data Backup',
      description: 'Last backup: 2 days ago',
      status: 'warning',
      action: 'Backup Now'
    }
  ]

  const recentActivity = [
    {
      id: 1,
      action: 'Login',
      device: 'Chrome on Windows',
      location: 'New York, US',
      timestamp: '2024-01-21 14:30:00',
      status: 'success'
    },
    {
      id: 2,
      action: 'Password Changed',
      device: 'Chrome on Windows',
      location: 'New York, US',
      timestamp: '2024-01-20 09:15:00',
      status: 'success'
    },
    {
      id: 3,
      action: 'Failed Login Attempt',
      device: 'Unknown Device',
      location: 'Unknown Location',
      timestamp: '2024-01-19 22:45:00',
      status: 'warning'
    },
    {
      id: 4,
      action: 'Data Export',
      device: 'Chrome on Windows',
      location: 'New York, US',
      timestamp: '2024-01-18 16:20:00',
      status: 'success'
    },
    {
      id: 5,
      action: 'Login',
      device: 'Safari on iPhone',
      location: 'New York, US',
      timestamp: '2024-01-18 08:30:00',
      status: 'success'
    }
  ]

  const activeSessions = [
    {
      id: 1,
      device: 'Chrome on Windows',
      location: 'New York, US',
      lastActive: '2024-01-21 14:30:00',
      current: true
    },
    {
      id: 2,
      device: 'Safari on iPhone',
      location: 'New York, US',
      lastActive: '2024-01-21 12:15:00',
      current: false
    },
    {
      id: 3,
      device: 'Chrome on Android',
      location: 'New York, US',
      lastActive: '2024-01-20 18:45:00',
      current: false
    }
  ]

  const handlePasswordChange = (e) => {
    e.preventDefault()
    // In a real app, this would call an API to change the password
    console.log('Password change requested')
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
  }

  const handleTwoFactorToggle = () => {
    setTwoFactorEnabled(!twoFactorEnabled)
  }

  const handleSessionTerminate = (sessionId) => {
    console.log(`Terminating session: ${sessionId}`)
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'good': return <CheckCircle className="w-5 h-5 text-green-400" />
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-400" />
      case 'danger': return <XCircle className="w-5 h-5 text-red-400" />
      default: return <CheckCircle className="w-5 h-5 text-gray-400" />
    }
  }

  const getActivityIcon = (action) => {
    switch (action) {
      case 'Login': return <Globe className="w-4 h-4" />
      case 'Password Changed': return <Key className="w-4 h-4" />
      case 'Failed Login Attempt': return <AlertTriangle className="w-4 h-4" />
      case 'Data Export': return <Download className="w-4 h-4" />
      default: return <Monitor className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-8">
      <div className="page-header">
        <h1 className="page-title flex items-center gap-3">
          <Shield className="w-8 h-8 text-green-400" />
          Security Hub
        </h1>
        <p className="page-subtitle">Manage your account security and privacy settings</p>
      </div>

      {/* Security Score */}
      <div className="dashboard-card bg-gradient-to-r from-green-600/20 to-blue-600/20 border-green-500/30">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">Security Score</h3>
            <p className="text-gray-400">Your account security rating</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-green-400">{securityScore}</div>
            <div className="text-sm text-gray-400">out of 100</div>
          </div>
        </div>
        <div className="mt-4">
          <div className="w-full bg-gray-700 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${securityScore}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-800/50 p-1 rounded-lg">
        {[
          { id: 'overview', label: 'Overview', icon: Shield },
          { id: 'password', label: 'Password', icon: Key },
          { id: 'two-factor', label: '2FA', icon: Smartphone },
          { id: 'activity', label: 'Activity', icon: Clock },
          { id: 'sessions', label: 'Sessions', icon: Monitor },
          { id: 'notifications', label: 'Notifications', icon: Bell }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
              activeTab === tab.id
                ? 'bg-green-600 text-white'
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
          <div className="dashboard-card">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5 text-blue-400" />
              Security Checklist
            </h3>
            <div className="space-y-4">
              {securityChecks.map((check) => (
                <div key={check.id} className="flex items-center justify-between p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(check.status)}
                    <div>
                      <h4 className="text-white font-medium">{check.title}</h4>
                      <p className="text-gray-400 text-sm">{check.description}</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    {check.action}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Password Tab */}
      {activeTab === 'password' && (
        <div className="space-y-6">
          <div className="dashboard-card">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Key className="w-5 h-5 text-yellow-400" />
              Change Password
            </h3>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Current Password</label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-yellow-500 focus:outline-none pr-10"
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-gray-400 text-sm mb-2">New Password</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-yellow-500 focus:outline-none pr-10"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-gray-400 text-sm mb-2">Confirm New Password</label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-yellow-500 focus:outline-none"
                  placeholder="Confirm new password"
                />
              </div>
              
              <button
                type="submit"
                className="w-full py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-medium"
              >
                Update Password
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Two-Factor Tab */}
      {activeTab === 'two-factor' && (
        <div className="space-y-6">
          <div className="dashboard-card">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-purple-400" />
              Two-Factor Authentication
            </h3>
            <div className="flex items-center justify-between p-4 bg-gray-800/50 border border-gray-700 rounded-lg mb-4">
              <div>
                <h4 className="text-white font-medium">Authenticator App</h4>
                <p className="text-gray-400 text-sm">
                  {twoFactorEnabled 
                    ? 'Two-factor authentication is currently enabled'
                    : 'Add an extra layer of security to your account'
                  }
                </p>
              </div>
              <button
                onClick={handleTwoFactorToggle}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  twoFactorEnabled
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-purple-600 hover:bg-purple-700 text-white'
                }`}
              >
                {twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
              </button>
            </div>
            
            {!twoFactorEnabled && (
              <div className="p-4 bg-purple-600/20 border border-purple-500/30 rounded-lg">
                <h4 className="text-white font-medium mb-2">How to set up 2FA:</h4>
                <ol className="text-gray-400 text-sm space-y-1 list-decimal list-inside">
                  <li>Download an authenticator app (Google Authenticator, Authy, etc.)</li>
                  <li>Click "Enable 2FA" to generate a QR code</li>
                  <li>Scan the QR code with your authenticator app</li>
                  <li>Enter the verification code to complete setup</li>
                </ol>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Activity Tab */}
      {activeTab === 'activity' && (
        <div className="space-y-6">
          <div className="dashboard-card">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-400" />
              Recent Activity
            </h3>
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center gap-4 p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
                  <div className={`p-2 rounded-full ${
                    activity.status === 'success' ? 'bg-green-600/20 text-green-400' :
                    activity.status === 'warning' ? 'bg-yellow-600/20 text-yellow-400' :
                    'bg-red-600/20 text-red-400'
                  }`}>
                    {getActivityIcon(activity.action)}
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center gap-2">
                      <h4 className="text-white font-medium">{activity.action}</h4>
                      <span className={`text-xs px-2 py-1 rounded ${
                        activity.status === 'success' ? 'bg-green-400/20 text-green-400' :
                        activity.status === 'warning' ? 'bg-yellow-400/20 text-yellow-400' :
                        'bg-red-400/20 text-red-400'
                      }`}>
                        {activity.status}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm">{activity.device} • {activity.location}</p>
                  </div>
                  <div className="text-right text-sm text-gray-400">
                    {new Date(activity.timestamp).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sessions Tab */}
      {activeTab === 'sessions' && (
        <div className="space-y-6">
          <div className="dashboard-card">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Monitor className="w-5 h-5 text-green-400" />
              Active Sessions
            </h3>
            <div className="space-y-4">
              {activeSessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Monitor className="w-5 h-5 text-blue-400" />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-white font-medium">{session.device}</h4>
                        {session.current && (
                          <span className="text-xs bg-green-400/20 text-green-400 px-2 py-1 rounded">
                            Current
                          </span>
                        )}
                      </div>
                      <p className="text-gray-400 text-sm">{session.location}</p>
                      <p className="text-gray-500 text-xs">
                        Last active: {new Date(session.lastActive).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  {!session.current && (
                    <button
                      onClick={() => handleSessionTerminate(session.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="space-y-6">
          <div className="dashboard-card">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5 text-orange-400" />
              Security Notifications
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
                <div>
                  <h4 className="text-white font-medium">Email Notifications</h4>
                  <p className="text-gray-400 text-sm">Receive security alerts via email</p>
                </div>
                <button
                  onClick={() => setEmailNotifications(!emailNotifications)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    emailNotifications ? 'bg-green-600' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      emailNotifications ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
                <div>
                  <h4 className="text-white font-medium">SMS Notifications</h4>
                  <p className="text-gray-400 text-sm">Receive security alerts via SMS</p>
                </div>
                <button
                  onClick={() => setSmsNotifications(!smsNotifications)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    smsNotifications ? 'bg-green-600' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      smsNotifications ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SecurityHub

