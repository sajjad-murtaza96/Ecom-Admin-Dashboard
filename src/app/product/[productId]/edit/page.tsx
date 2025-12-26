import { getProductByIdAction } from "@/app/actions/Product";
import MainHeader from "@/app/components/header";
import { isAuthenticated } from "@/utilities/auth";
import { cookies } from "next/headers";
import { EditProductForm } from "./components/editProduct";

interface EditProductProps {
  params: {
    productId: string;
  };
}

export default async function EditProductPage({ params }: EditProductProps) {
  const isAuth = await isAuthenticated(await cookies());
  const product = await getProductByIdAction(await params.productId);
  return (
    <>
      <MainHeader isAuth={isAuth} />
      <EditProductForm product={product} productId={params.productId} />
    </>
  );
}
