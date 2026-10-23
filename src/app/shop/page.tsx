import Link from "next/link";
import { Suspense } from "react";
import { ProductGridSkeleton } from "./skeletons/product-grid-skeleton";
import { getAllProductsAction } from "../actions/supabase/products";
import { ProductImage } from "../../components/product-image";

export default async function ShopPage() {
  const [products] = await Promise.all([
    getAllProductsAction(),
  ]);
  return (
    <>
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <Suspense
            fallback={<ProductGridSkeleton productLength={products.length} />}
          >
            <ProductCard products={products} />
          </Suspense>
        </div>
      </div>
    </>
  );
}

async function ProductCard({
  products,
}: {
  products: Awaited<ReturnType<typeof getAllProductsAction>>;
}) {
  if (!products || products.length === 0)
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <p className="text-2xl font-semibold text-gray-700 dark:text-gray-200">
            No products available
          </p>
          <p className="mt-2 text-sm text-gray-500">
            {
              "Please check back later or ask data team to add products."
            }
          </p>
        </div>
      </div>
    );
  return (
    <>
      <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
        {products.map((product) => (
          <div key={product.id} className="relative">
            {/* {isAuth && <CrossIcon productId={product.id} />} */}
            {/* {isAuth && <EditIcon productId={product.id} />} */}
            <Link href={`/product/${product.id}`} className="group">
              <div className="relative aspect-square w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                <ProductImage
                  src={product.image_url}
                  placeholder="blur"
                  blurDataURL="/images/product-placeholder.svg"
                  alt={product.name}
                  fill
                  sizes="(min-width: 1280px) 280px, (min-width: 1024px) calc((100vw - 112px) / 3), (min-width: 640px) 300px, calc(100vw - 32px)"
                />
              </div>
              <h3 className="mt-4 text-sm text-gray-700">{product.name}</h3>
              <p className="mt-1 text-lg font-medium text-gray-900">{`$${product.price}`}</p>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}
