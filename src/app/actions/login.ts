"use server";
import { redirect } from "next/navigation";
import { cookies, headers } from "next/headers";
import { createClient } from "@/db/supabase/server";
import { Users } from "@/utilities/input-validator";
import type { User } from "@/reducers/user/user.type";

export const login = async (user: User) => {
  const result = Users.safeParse(user);
  if (!result.success) return result.error.issues[0].message;

  const supabase = createClient(await cookies());
  const { error } = await supabase.auth.signInWithPassword({
    email: result.data.name,
    password: result.data.password,
  });
  if (error) return "Unable to sign in. Check your email and password.";
  redirect("/shop");
};

export const loginWithGoogle = async () => {
  const origin = process.env.NEXT_PUBLIC_SITE_URL || (await headers()).get("origin");
  if (!origin) redirect("/login?error=configuration");

  const supabase = createClient(await cookies());
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: new URL("/auth/callback", origin).toString(),
      queryParams: { prompt: "select_account" },
    },
  });

  if (error || !data.url) redirect("/login?error=google-sign-in");
  redirect(data.url);
};
