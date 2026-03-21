import { getSupabaseClient } from '@/lib/supabase/client';
import type { SavingsGoal } from '@/types/database';

const supabase = () => getSupabaseClient();

export const goalsApi = {
  async getAll(): Promise<SavingsGoal[]> {
    const { data, error } = await supabase()
      .from('savings_goals')
      .select('*')
      .eq('completed', false)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data ?? [];
  },

  async create(input: {
    name: string;
    category: string;
    target_amount: number;
    current_amount?: number;
    deadline?: string;
  }): Promise<SavingsGoal> {
    const { data: { user } } = await supabase().auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase()
      .from('savings_goals')
      .insert({ ...input, user_id: user.id })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id: string, input: Partial<Pick<SavingsGoal, 'name' | 'target_amount' | 'current_amount' | 'deadline' | 'completed'>>): Promise<SavingsGoal> {
    const { data, error } = await supabase()
      .from('savings_goals')
      .update(input)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase().from('savings_goals').delete().eq('id', id);
    if (error) throw error;
  },
};
