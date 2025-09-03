import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database schema types
export const SUBSCRIPTION_PLANS = {
  FREE: 'free',
  STARTER: 'starter',
  BUSINESS: 'business',
  PREMIUM: 'premium'
}

export const PLAN_FEATURES = {
  [SUBSCRIPTION_PLANS.FREE]: {
    name: 'Free',
    price: 0,
    features: ['Basic Dashboard', 'Income Tracker', 'Expense Manager', 'Security Hub'],
    modules: ['dashboard', 'income-tracker', 'expense-manager', 'security-hub']
  },
  [SUBSCRIPTION_PLANS.STARTER]: {
    name: 'Starter',
    price: 29,
    features: ['Everything in Free', 'Budget Planner', 'Savings Goals', 'Mission Tracker'],
    modules: ['dashboard', 'income-tracker', 'expense-manager', 'budget-planner', 'savings-goals', 'mission-tracker', 'security-hub']
  },
  [SUBSCRIPTION_PLANS.BUSINESS]: {
    name: 'Business+',
    price: 49,
    features: ['Everything in Starter', 'AutoPilot', 'Growth Engine', 'Personal Academy'],
    modules: ['dashboard', 'income-tracker', 'expense-manager', 'budget-planner', 'savings-goals', 'mission-tracker', 'autopilot', 'growth-engine', 'personal-academy', 'security-hub']
  },
  [SUBSCRIPTION_PLANS.PREMIUM]: {
    name: 'Premium',
    price: 297,
    features: ['Everything in Business+', 'Vault Access', 'Priority Support', 'Advanced Analytics'],
    modules: ['dashboard', 'income-tracker', 'expense-manager', 'budget-planner', 'savings-goals', 'mission-tracker', 'autopilot', 'growth-engine', 'personal-academy', 'vault-access', 'security-hub']
  }
}

// Helper functions
export const hasAccess = (userPlan, requiredPlan) => {
  const planHierarchy = {
    [SUBSCRIPTION_PLANS.FREE]: 0,
    [SUBSCRIPTION_PLANS.STARTER]: 1,
    [SUBSCRIPTION_PLANS.BUSINESS]: 2,
    [SUBSCRIPTION_PLANS.PREMIUM]: 3
  }
  
  return planHierarchy[userPlan] >= planHierarchy[requiredPlan]
}

export const getUserProfile = async (userId) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  
  return { data, error }
}

export const updateUserProfile = async (userId, updates) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()
  
  return { data, error }
}

export const createUserProfile = async (userId, profileData) => {
  const { data, error } = await supabase
    .from('profiles')
    .insert([{ id: userId, ...profileData }])
    .select()
    .single()
  
  return { data, error }
}

