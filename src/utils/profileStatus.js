import { supabase } from '@/database/database';

export async function hasProfileForEmail(email) {
  const { data, error } = await supabase
    .from('profile')
    .select('email')
    .eq('email', email)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return Boolean(data);
}
