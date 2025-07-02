import { createClient } from "@supabase/supabase-js"
// Update the path below if your types file is located elsewhere
import { Database } from "../supabase/types"

export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)