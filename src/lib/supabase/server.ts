import { createServerClient as _createSSRClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { createClient as _sbCreateClient } from '@supabase/supabase-js';

export function createServerClient() {
  const cookieStore = cookies();
  return _createSSRClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) { return cookieStore.get(name)?.value; },
        set(name, value, options) { try { cookieStore.set({ name, value, ...options }); } catch {} },
        remove(name, options) { try { cookieStore.set({ name, value: '', ...options }); } catch {} },
      },
    }
  );
}

// createClient alias - used by API routes
export function createClient() {
  return createServerClient();
}

export function createServiceClient() {
  return _sbCreateClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

export const createServerSupabaseClient = createServerClient;
