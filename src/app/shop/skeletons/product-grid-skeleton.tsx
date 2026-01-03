import React from "react";
import Image from "next/image";

export const ProductGridSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
      {Array.from({ length: 8 }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
};

const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="group animate-pulse">
      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
        <Image
          src="/placeholder-image.png"
          alt="placeholder-image"
          width={400}
          height={400}
          className="h-full w-full object-cover object-center group-hover:opacity-75"
        />
      </div>
      <div className="mt-4 h-4 w-3/4 rounded bg-gray-300" />
      <div className="mt-2 h-5 w-1/4 rounded bg-gray-400" />
    </div>
  );
};

export default ProductCardSkeleton;
