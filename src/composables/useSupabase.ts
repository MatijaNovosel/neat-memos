import { createClient } from "@supabase/supabase-js";

export const useSupabase = () => {
  const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL as string,
    import.meta.env.VITE_SUPABASE_ANON as string
  );

  return {
    supabase
  };
};
