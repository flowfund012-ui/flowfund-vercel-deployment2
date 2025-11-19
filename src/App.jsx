import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
// import Layout from './components/Layout' // <-- REMOVED THIS IMPORT

// Pages
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import Dashboard from './pages/Dashboard'
import IncomeTracker from './pages/IncomeTracker'
import ExpenseManager from './pages/ExpenseManager'
import BudgetPlanner from './pages/BudgetPlanner'
import SavingsGoals from './pages/SavingsGoals'
import MissionTracker from './pages/MissionTracker'
import AutoPilot from './pages/AutoPilot'
import GrowthEngine from './pages/GrowthEngine'
import PersonalAcademy from './pages/PersonalAcademy'
import Vault from './pages/Vault'
import SecurityHub from './pages/SecurityHub'
import Profile from './pages/Profile'
import UpgradePage from './pages/UpgradePage'
import ThankYou from './pages/ThankYou'

import './App.css'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          {/* Root route with simple test div */}
          <Route path="/" element={<div style={{ color: 'lime', fontSize: '32px', padding: '50px', backgroundColor: 'purple' }}>LANDING PAGE BYPASSED!</div>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/upgrade" element={<UpgradePage />} />
          <Route path="/thank-you" element={<ThankYou />} />

          {/* Protected routes - Layout component REMOVED from all */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/income-tracker" element={
            <ProtectedRoute>
              <IncomeTracker />
            </ProtectedRoute>
          } />
          
          <Route path="/expense-manager" element={
            <ProtectedRoute>
              <ExpenseManager />
            </ProtectedRoute>
          } />
          
          <Route path="/budget-planner" element={
            <ProtectedRoute requiredPlan="starter">
              <BudgetPlanner />
            </ProtectedRoute>
          } />
          
          <Route path="/savings-goals" element={
            <ProtectedRoute requiredPlan="starter">
              <SavingsGoals />
            </ProtectedRoute>
          } />
          
          <Route path="/mission-tracker" element={
            <ProtectedRoute requiredPlan="starter">
              <MissionTracker />
            </ProtectedRoute>
          } />
          
          <Route path="/autopilot" element={
            <ProtectedRoute requiredPlan="business">
              <AutoPilot />
            </ProtectedRoute>
          } />
          
          <Route path="/growth-engine" element={
            <ProtectedRoute requiredPlan="business">
              <GrowthEngine />
            </ProtectedRoute>
          } />
          
          <Route path="/personal-academy" element={
            <ProtectedRoute requiredPlan="business">
              <PersonalAcademy />
            </ProtectedRoute>
          } />
          
          <Route path="/vault" element={
            <ProtectedRoute requiredPlan="premium">
              <Vault />
            </ProtectedRoute>
          } />
          
          <Route path="/security-hub" element={
            <ProtectedRoute>
              <SecurityHub />
            </ProtectedRoute>
          } />
          
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
