import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { SUBSCRIPTION_PLANS } from '../lib/supabase'

const ProtectedRoute = ({ children, requiredPlan = null }) => {
  const { isAuthenticated, checkAccess, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (requiredPlan && !checkAccess(requiredPlan)) {
    return <Navigate to="/upgrade" state={{ requiredPlan }} replace />
  }

  return children
}

export default ProtectedRoute

