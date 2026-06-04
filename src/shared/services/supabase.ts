import { createClient } from "@supabase/supabase-js";
import { environment } from "@/shared/environments/environment";

export const supabase = createClient(
  environment.supabaseUrl,
  environment.supabaseAnonKey
);