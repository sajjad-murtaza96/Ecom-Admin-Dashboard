import { LoginForm } from "./components/loginForm";
import MainHeader from "../components/header";
import { isAuthenticated } from "@/utilities/auth";
import { cookies } from "next/headers";

export default async function LoginPage() {
  const isAuth = await isAuthenticated(await cookies());
  return (
    <>
      <MainHeader isAuth={isAuth} />
      <LoginForm />
    </>
  );
}
