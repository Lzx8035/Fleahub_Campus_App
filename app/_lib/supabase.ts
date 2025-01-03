// import { createClient } from "@supabase/supabase-js";

// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
// const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

// if (!supabaseUrl || !supabaseKey) {
//   throw new Error("Missing Supabase environment variables");
// }

// const supabase = createClient(supabaseUrl, supabaseKey);

// export default supabase;

// lib/supabase.ts
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

if (
  !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
) {
  throw new Error("Missing Supabase environment variables");
}

const supabase = createClientComponentClient();

export default supabase;
