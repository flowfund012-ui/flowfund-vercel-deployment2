// Auto-generated types matching Supabase schema
// Regenerate with: npx supabase gen types typescript --project-id your-id > src/types/database.ts

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          plan: 'free' | 'pro' | 'premium';
          plan_expires_at: string | null;
          onboarded: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          plan?: 'free' | 'pro' | 'premium';
          plan_expires_at?: string | null;
          onboarded?: boolean;
        };
        Update: {
          full_name?: string | null;
          avatar_url?: string | null;
          plan?: 'free' | 'pro' | 'premium';
          plan_expires_at?: string | null;
          onboarded?: boolean;
          updated_at?: string;
        };
      };
      transactions: {
        Row: {
          id: string;
          user_id: string;
          type: 'income' | 'expense';
          description: string;
          amount: number;
          category: 'Food' | 'Transport' | 'Housing' | 'Entertainment' | 'Health' | 'Business' | 'Savings' | 'Other';
          date: string;
          notes: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          type: 'income' | 'expense';
          description: string;
          amount: number;
          category?: 'Food' | 'Transport' | 'Housing' | 'Entertainment' | 'Health' | 'Business' | 'Savings' | 'Other';
          date?: string;
          notes?: string;
        };
        Update: {
          description?: string;
          amount?: number;
          category?: string;
          date?: string;
          notes?: string;
        };
      };
      savings_goals: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          category: string;
          target_amount: number;
          current_amount: number;
          deadline: string | null;
          completed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          name: string;
          category?: string;
          target_amount: number;
          current_amount?: number;
          deadline?: string | null;
        };
        Update: {
          name?: string;
          category?: string;
          target_amount?: number;
          current_amount?: number;
          deadline?: string | null;
          completed?: boolean;
        };
      };
      autopilot_settings: {
        Row: {
          id: string;
          user_id: string;
          smart_save: boolean;
          smart_save_pct: number;
          auto_invest: boolean;
          auto_invest_pct: number;
          created_at: string;
          updated_at: string;
        };
        Insert: { user_id: string; };
        Update: {
          smart_save?: boolean;
          smart_save_pct?: number;
          auto_invest?: boolean;
          auto_invest_pct?: number;
        };
      };
      revenue_entries: {
        Row: {
          id: string;
          user_id: string;
          source: string;
          amount: number;
          type: 'Recurring' | 'One-time' | 'Product Sale' | 'Affiliate' | 'Service';
          date: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          source: string;
          amount: number;
          type?: string;
          date?: string;
        };
        Update: never;
      };
      academy_progress: {
        Row: {
          id: string;
          user_id: string;
          xp: number;
          completed_courses: string[];
          streak: number;
          last_challenge: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: { user_id: string; };
        Update: {
          xp?: number;
          completed_courses?: string[];
          streak?: number;
          last_challenge?: string | null;
        };
      };
      vault_downloads: {
        Row: {
          id: string;
          user_id: string;
          asset_id: string;
          downloaded_at: string;
        };
        Insert: { user_id: string; asset_id: string; };
        Update: never;
      };
      security_logs: {
        Row: {
          id: string;
          user_id: string;
          event: string;
          type: 'info' | 'success' | 'error';
          metadata: Json;
          created_at: string;
        };
        Insert: {
          user_id: string;
          event: string;
          type?: 'info' | 'success' | 'error';
          metadata?: Json;
        };
        Update: never;
      };
      payment_orders: {
        Row: {
          id: string;
          user_id: string;
          provider_order_id: string | null;
          provider: string;
          plan: 'pro' | 'premium';
          amount_usd: number;
          currency: string;
          status: string;
          pay_address: string | null;
          pay_amount: number | null;
          actually_paid: number;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          plan: 'pro' | 'premium';
          amount_usd: number;
          currency?: string;
          provider_order_id?: string | null;
          pay_address?: string | null;
          pay_amount?: number | null;
          metadata?: Json;
        };
        Update: {
          status?: string;
          provider_order_id?: string | null;
          pay_address?: string | null;
          pay_amount?: number | null;
          actually_paid?: number;
          metadata?: Json;
          updated_at?: string;
        };
      };
    };
  };
}

// Convenience row types
export type Profile          = Database['public']['Tables']['profiles']['Row'];
export type Transaction      = Database['public']['Tables']['transactions']['Row'];
export type SavingsGoal      = Database['public']['Tables']['savings_goals']['Row'];
export type AutopilotSettings= Database['public']['Tables']['autopilot_settings']['Row'];
export type RevenueEntry     = Database['public']['Tables']['revenue_entries']['Row'];
export type AcademyProgress  = Database['public']['Tables']['academy_progress']['Row'];
export type VaultDownload    = Database['public']['Tables']['vault_downloads']['Row'];
export type SecurityLog      = Database['public']['Tables']['security_logs']['Row'];
export type PaymentOrder     = Database['public']['Tables']['payment_orders']['Row'];
