import { createContext, useContext, useEffect, useState } from 'react'
import { supabase, getUserProfile, createUserProfile, updateUserProfile } from '../lib/supabase'
import { PLANS, hasFeatureAccess, getUserPlan } from '../lib/lemonsqueezy'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        loadUserProfile(session.user.id)
      } else {
        setLoading(false)
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        if (session?.user) {
          await loadUserProfile(session.user.id)
        } else {
          setProfile(null)
          setLoading(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const loadUserProfile = async (userId) => {
    try {
      const { data, error } = await getUserProfile(userId)
      
      if (error && error.code === 'PGRST116') {
        // Profile doesn't exist, create one
        const newProfile = {
          full_name: user?.user_metadata?.full_name || '',
          avatar_url: user?.user_metadata?.avatar_url || '',
          subscription_plan: 'free',
          is_subscribed: false
        }
        
        const { data: createdProfile, error: createError } = await createUserProfile(userId, newProfile)
        if (createError) {
          console.error('Error creating profile:', createError)
        } else {
          setProfile(createdProfile)
        }
      } else if (error) {
        console.error('Error loading profile:', error)
      } else {
        setProfile(data)
      }
    } catch (error) {
      console.error('Error in loadUserProfile:', error)
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email, password, metadata = {}) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    })
    return { data, error }
  }

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  const resetPassword = async (email) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email)
    return { data, error }
  }

  const updatePassword = async (password) => {
    const { data, error } = await supabase.auth.updateUser({ password })
    return { data, error }
  }

  const updateProfile = async (updates) => {
    if (!user) return { error: 'No user logged in' }
    
    const { data, error } = await updateUserProfile(user.id, updates)
    if (!error && data) {
      setProfile(data)
    }
    return { data, error }
  }

  const checkAccess = (requiredPlan) => {
    if (!profile) return false
    return hasFeatureAccess(profile.subscription_plan, requiredPlan)
  }

  const getCurrentPlan = () => {
    return getUserPlan(profile?.subscription_plan || 'free')
  }

  const hasAccess = (requiredPlan) => {
    return checkAccess(requiredPlan)
  }

  const value = {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    updateProfile,
    checkAccess,
    hasAccess,
    getCurrentPlan,
    isAuthenticated: !!user,
    subscriptionPlan: profile?.subscription_plan || 'free',
    isSubscribed: profile?.is_subscribed || false,
    planDetails: getCurrentPlan()
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

