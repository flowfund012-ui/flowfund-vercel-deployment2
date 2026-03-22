import { createServerClient as _createSSRClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { createClient as _createClient } from '@supabase/supabase-js';

export function createServerClient() {
  const cookieStore = cookies();
  return _createSSRClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value; },
        set(name: string, value: string, options: Record<string,unknown>) {
          try { cookieStore.set({name, value, ...options} as Parameters<typeof cookieStore.set>[0]); } catch {}
        },
        remove(name: string, options: Record<string,unknown>) {
          try { cookieStore.set({name, value: '', ...options} as Parameters<typeof cookieStore.set>[0]); } catch {}
        },
      },
    }
  );
}

export function createServiceClient() {
  return _createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export const createClient = createServiceClient;
export const createServerSupabaseClient = createServerClient;
