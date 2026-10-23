import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/db/supabase/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const origin = process.env.NEXT_PUBLIC_SITE_URL || request.nextUrl.origin;

  if (code && !request.nextUrl.searchParams.has("error")) {
    const supabase = createClient(await cookies());
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(new URL("/shop", origin));
    }
  }

  return NextResponse.redirect(new URL("/login?error=google-callback", origin));
}