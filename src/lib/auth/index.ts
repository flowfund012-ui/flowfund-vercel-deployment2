import { getSupabaseClient } from '@/lib/supabase/client';

const sb = () => getSupabaseClient();

export const auth = {
  async signUp(email: string, password: string, fullName: string) {
    const { data, error } = await sb().auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
      },
    });
    if (error) throw error;
    return data;
  },

  async signIn(email: string, password: string) {
    const { data, error } = await sb().auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await sb().auth.signOut();
    if (error) throw error;
  },

  async getUser() {
    const { data: { user }, error } = await sb().auth.getUser();
    if (error) return null;
    return user;
  },

  async getSession() {
    const { data: { session } } = await sb().auth.getSession();
    return session;
  },

  onAuthStateChange(callback: (event: string, session: unknown) => void) {
    return sb().auth.onAuthStateChange(callback);
  },

  async resetPassword(email: string) {
    const { error } = await sb().auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?type=recovery`,
    });
    if (error) throw error;
  },
};
