import { createClient } from "@supabase/supabase-js";
import { hasSupabaseCmsConfig } from "@/lib/supabase-config";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase =
  hasSupabaseCmsConfig() && supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;
