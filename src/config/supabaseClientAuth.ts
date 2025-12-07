import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabase: SupabaseClient = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);

export const verifyUser = async (token: string) => {
  const { data, error } = await supabase.auth.getUser(token)
  if (error || !data.user) throw new Error('Invalid token')
  return data.user
}

export const createSupabase = (token?: string) => {
  return createClient(
    process.env.SUPABASE_URL!,
     process.env.SUPABASE_KEY!,
    {
      global: {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      },
    }
  );
};

export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);