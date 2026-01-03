import Link from "next/link";
import Image from "next/image";
import MainHeader from "../components/header";
import { isAuthenticated } from "../../utilities/auth";
import { cookies } from "next/headers";
import { getAllProducts } from "../../db/query";
import { CrossIcon } from "./components/cross-icon";
import { EditIcon } from "./components/edit-icon";
import { Suspense } from "react";
import { ProductGridSkeleton } from "./skeletons/product-grid-skeleton";

export default async function ShopPage() {
  const isAuth = await isAuthenticated(await cookies());
  return (
    <>
      <MainHeader isAuth={isAuth} />
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <Suspense fallback={<ProductGridSkeleton />}>
            <ProductCard isAuth={isAuth} />
          </Suspense>
        </div>
      </div>
    </>
  );
}

async function ProductCard({ isAuth }: { isAuth: boolean }) {
  const products = await getAllProducts();
  if (!products || products.length === 0)
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <p className="text-2xl font-semibold text-gray-700 dark:text-gray-200">
            No products available
          </p>
          <p className="mt-2 text-sm text-gray-500">
            {isAuth
              ? "Add new products from the dashboard."
              : "Please check back later or ask an admin to add products."}
          </p>
        </div>
      </div>
    );
  return (
    <>
      <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
        {products.map((product) => (
          <div key={product.id} className="relative">
            {isAuth && <CrossIcon productId={product.id} />}
            {isAuth && <EditIcon productId={product.id} />}
            <Link href={`/${product.title}/${product.id}`} className="group">
              <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
                <Image
                  priority={true}
                  src={product.imageUrl}
                  alt="product-image"
                  width={400}
                  height={400}
                  className="h-full w-full object-cover object-center group-hover:opacity-75"
                />
              </div>
              <h3 className="mt-4 text-sm text-gray-700">{product.title}</h3>
              <p className="mt-1 text-lg font-medium text-gray-900">{`$${product.price}`}</p>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}
