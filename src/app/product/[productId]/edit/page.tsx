import { getProductByIdAction } from "@/app/actions/Product";
import MainHeader from "@/app/components/header";
import { isAuthenticated } from "@/utilities/auth";
import { cookies } from "next/headers";
import { EditProductForm } from "./components/editProduct";

interface EditProductProps {
  params: Promise<{
    productId: string;
  }>;
}

export default async function EditProductPage({ params }: EditProductProps) {
  const isAuth = await isAuthenticated(await cookies());
  const productId = (await params).productId;
  const product = await getProductByIdAction(productId);
  return (
    <>
      <MainHeader isAuth={isAuth} />
      <EditProductForm product={product} productId={productId} />
    </>
  );
}
