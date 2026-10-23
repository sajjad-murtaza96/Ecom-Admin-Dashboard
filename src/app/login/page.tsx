import { LoginForm } from "./components/loginForm";
import { isAuthenticated } from "@/utilities/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

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
  console.log("isAuth:", isAuth);
  if (isAuth) redirect("/shop");
  const { error } = await searchParams;
  const errorMessage = typeof error === "string" ? authErrors.get(error) : undefined;
  return <LoginForm errorMessage={errorMessage} />;
}
