"use client";

import { removeProductAction } from "@/app/actions/Product";

export const CrossIcon: React.FC<{
  productId: string;
}> = ({ productId }) => {
  const handleRemoveProduct = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const productId = e.currentTarget.id;
    removeProductAction(productId);
  };
  return (
    <button
      id={productId}
      onClick={(e) => handleRemoveProduct(e)}
      className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow hover:bg-red-500 hover:text-white transition cursor-pointer"
    >
      ✕
    </button>
  );
};
