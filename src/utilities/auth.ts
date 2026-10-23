import type { cookies } from "next/headers";
import { createClient } from "@/db/supabase/server";

type CookieStore = Awaited<ReturnType<typeof cookies>>;

export const isAuthenticated = async (cookieStore: CookieStore) => {
  const supabase = createClient(cookieStore);
  const { data: { user }, error } = await supabase.auth.getUser();
  return !error && !!user;
};

export const removeAuth = async (cookieStore: CookieStore) => {
  const supabase = createClient(cookieStore);
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error("Unable to sign out. Please try again.");
};
