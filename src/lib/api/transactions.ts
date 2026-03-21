import { getSupabaseClient } from '@/lib/supabase/client';
import type { Transaction } from '@/types/database';

const supabase = () => getSupabaseClient();

export type CreateTransactionInput = {
  type: 'income' | 'expense';
  description: string;
  amount: number;
  category?: Transaction['category'];
  date?: string;
  notes?: string;
};

export const transactionsApi = {
  // Fetch all for current user
  async getAll(): Promise<Transaction[]> {
    const { data, error } = await supabase()
      .from('transactions')
      .select('*')
      .order('date', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data ?? [];
  },

  // Fetch with filters
  async getFiltered(opts: {
    type?: 'income' | 'expense';
    category?: string;
    from?: string;
    to?: string;
    limit?: number;
  }): Promise<Transaction[]> {
    let query = supabase()
      .from('transactions')
      .select('*')
      .order('date', { ascending: false });

    if (opts.type)     query = query.eq('type', opts.type);
    if (opts.category) query = query.eq('category', opts.category);
    if (opts.from)     query = query.gte('date', opts.from);
    if (opts.to)       query = query.lte('date', opts.to);
    if (opts.limit)    query = query.limit(opts.limit);

    const { data, error } = await query;
    if (error) throw error;
    return data ?? [];
  },

  // Create
  async create(input: CreateTransactionInput): Promise<Transaction> {
    const { data: { user } } = await supabase().auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase()
      .from('transactions')
      .insert({
        user_id: user.id,
        type: input.type,
        description: input.description,
        amount: input.amount,
        category: input.category ?? 'Other',
        date: input.date ?? new Date().toISOString().split('T')[0],
        notes: input.notes ?? '',
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete
  async delete(id: string): Promise<void> {
    const { error } = await supabase()
      .from('transactions')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  // Aggregated stats
  async getStats() {
    const transactions = await transactionsApi.getAll();
    const income   = transactions.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0);
    const expenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0);
    const net      = income - expenses;
    const savingsRate = income > 0 ? Math.round(((income - expenses) / income) * 100) : 0;
    return { income, expenses, net, savingsRate, count: transactions.length };
  },
};
