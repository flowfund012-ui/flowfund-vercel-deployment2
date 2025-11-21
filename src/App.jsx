import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout' // <-- RESTORED IMPORT

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
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/upgrade" element={<UpgradePage />} />
          <Route path="/thank-you" element={<ThankYou />} />

          {/* Protected routes - Layout component RESTORED */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/income-tracker" element={
            <ProtectedRoute>
              <Layout>
                <IncomeTracker />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/expense-manager" element={
            <ProtectedRoute>
              <Layout>
                <ExpenseManager />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/budget-planner" element={
            <ProtectedRoute requiredPlan="starter">
              <Layout>
                <BudgetPlanner />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/savings-goals" element={
            <ProtectedRoute requiredPlan="starter">
              <Layout>
                <SavingsGoals />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/mission-tracker" element={
            <ProtectedRoute requiredPlan="starter">
              <Layout>
                <MissionTracker />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/autopilot" element={
            <ProtectedRoute requiredPlan="business">
              <Layout>
                <AutoPilot />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/growth-engine" element={
            <ProtectedRoute requiredPlan="business">
              <Layout>
                <GrowthEngine />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/personal-academy" element={
            <ProtectedRoute requiredPlan="business">
              <Layout>
                <PersonalAcademy />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/vault" element={
            <ProtectedRoute requiredPlan="premium">
              <Layout>
                <Vault />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/security-hub" element={
            <ProtectedRoute>
              <Layout>
                <SecurityHub />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/profile" element={
            <ProtectedRoute>
              <Layout>
                <Profile />
              </Layout>
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
