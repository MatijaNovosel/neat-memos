/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
