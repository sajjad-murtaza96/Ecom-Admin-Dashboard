import { LoginForm } from "./components/loginForm";
import { isAuthenticated } from "@/utilities/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const authErrors = new Map([
  ["configuration", "Sign-in is not configured. Please contact support."],
  ["google-sign-in", "Google sign-in is unavailable. Please try again."],
  ["google-callback", "Google sign-in was cancelled or expired. Please try again."],
]);

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string | string[] }>;
}) {
  const isAuth = await isAuthenticated(await cookies());
  if (isAuth) redirect("/shop");
  const { error } = await searchParams;
  const errorMessage = typeof error === "string" ? authErrors.get(error) : undefined;
  return (
    <main className="min-h-[calc(100svh-5rem)] bg-white font-sans text-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <Link
          href="/shop"
          className="inline-flex min-h-11 items-center gap-2 rounded-md text-sm font-medium text-gray-600 transition-colors hover:text-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-600"
        >
          <ArrowLeft aria-hidden="true" className="h-4 w-4" />
          Back to shop
        </Link>
        <div className="mx-auto w-full max-w-md py-8 sm:py-12 lg:py-16">
          <LoginForm errorMessage={errorMessage} />
        </div>
      </div>
    </main>
  );
}
