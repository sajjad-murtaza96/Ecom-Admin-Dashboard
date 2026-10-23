import { getProductByIdAction } from "@/app/actions/Product";
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
  if (!isAuth) return null;
  const productId = (await params).productId;
  const product = await getProductByIdAction(productId);
  return <EditProductForm product={product} productId={productId} />;
}
