import { createClient } from "@supabase/supabase-js";

export const useSupabase = () => {
  const supabase = createClient(
    process.env.SUPABASE_URL as string,
    process.env.SUPABASE_ANON as string
  );

  return {
    supabase
  };
};
