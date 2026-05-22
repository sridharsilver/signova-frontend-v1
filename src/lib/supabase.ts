import { createClient } from "@supabase/supabase-js";

const isBrowser = typeof window !== "undefined";
const SUPABASE_URL = (isBrowser && import.meta.env.DEV)
  ? `${window.location.origin}/supabase-api`
  : (import.meta.env.VITE_SUPABASE_URL || "");
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "";

if (!import.meta.env.VITE_SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
  console.warn("Supabase credentials are missing. Please verify your .env file.");
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
