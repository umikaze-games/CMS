import { createClient } from "@supabase/supabase-js";
import { hasSupabaseCmsConfig } from "@/lib/supabase-config";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabaseAdmin =
  hasSupabaseCmsConfig() && supabaseUrl && serviceRoleKey
    ? createClient(supabaseUrl, serviceRoleKey, {
        auth: {
          persistSession: false
        }
      })
    : null;
