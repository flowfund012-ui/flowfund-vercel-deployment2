import { createClient } from '@supabase/supabase-js'

// 1. Correctly access environment variables using import.meta.env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// 2. Check for missing variables and throw a clear error (optional, but good practice)
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase environment variables are missing. Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your .env file and Vercel environment.')
}

// 3. Initialize the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// --- Functions used by AuthContext.jsx ---

// Function to get a user profile
export const getUserProfile = async (userId) => {
  return supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
}

// Function to create a user profile
export const createUserProfile = async (userId, profileData) => {
  return supabase
    .from('profiles')
    .insert([{ id: userId, ...profileData }])
    .select()
    .single()
}

// Function to update a user profile
export const updateUserProfile = async (userId, updates) => {
  return supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()
}
