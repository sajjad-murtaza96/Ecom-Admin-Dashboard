import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { getProductByIdAction } from "@/app/actions/supabase/products";
import { ProductImage } from "@/components/product-image";
import { ProductPurchase } from "./components/product-purchase";

interface ProductDetailProps {
  params: Promise<{
    productId: string;
  }>;
}

export default async function ProductDetailPage({
  params,
}: ProductDetailProps) {
  const { productId } = await params;
  const product = await getProductByIdAction(productId);

  return (
    <>
      <main className="min-h-screen bg-white text-gray-900">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-600"
          >
            <ArrowLeftIcon aria-hidden="true" className="h-4 w-4 shrink-0" />
            Back to shop
          </Link>

          <div className="mt-8 grid min-w-0 gap-8 lg:grid-cols-2 lg:gap-16">
            <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
              <ProductImage
                src={product.image_url}
                placeholder="blur"
                blurDataURL="/images/product-placeholder.svg"
                alt={product.name}
                fill
                sizes="(max-width: 639px) 96px, 128px"
              />
            </div>

            <section
              aria-labelledby="product-title"
              className="min-w-0 lg:py-6"
            >
              <h1
                id="product-title"
                className="text-3xl font-semibold break-words sm:text-4xl"
              >
                {product.name}
              </h1>
              <p className="mt-4 text-2xl font-medium break-words">
                {`$${product.price}`}
              </p>

              <ProductPurchase productId={productId} />

              <div className="mt-8 border-t border-gray-200 pt-6">
                <h2 className="text-base font-semibold">Description</h2>
                <p className="mt-3 leading-7 whitespace-pre-wrap break-words text-gray-600">
                  {product.description || "No description available."}
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
