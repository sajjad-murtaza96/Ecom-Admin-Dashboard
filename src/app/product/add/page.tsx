import { isAuthenticated } from "@/utilities/auth";
import { cookies } from "next/headers";
import MainHeader from "../../components/header";
import { AddProductForm } from "./components/addProduct";
import { redirect } from "next/navigation";

export default async function AddProductPage() {
  const isAuth = await isAuthenticated(await cookies());
  if (!isAuth) redirect("/");
  return (
    <>
      <MainHeader isAuth={isAuth} />
      <AddProductForm />
    </>
  );
}
