"use client";
import { updateProductAction } from "@/app/actions/Product";
import { ProductForm } from "@/app/components/productForm";
import { useProductReducer } from "@/reducers/product/product.hook";
import type { Product } from "@/reducers/product/product.type";
import { ProductOperation } from "@/utilities/product";
import { useEffect } from "react";

export const EditProductForm: React.FC<{
  product: Product | undefined;
  productId: string;
}> = ({ product, productId }) => {
  const {
    state: { productToAddUpdate, loading, message, error },
    addProduct,
    fetchStart,
    fetchSuccess,
  } = useProductReducer();

  useEffect(() => {
    if (!product) return;
    addProduct(product);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      fetchStart();
      updateProductAction(productId, productToAddUpdate).then(() => {
        fetchSuccess("Product updated successfully!");
      });
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    addProduct({ ...productToAddUpdate, [name]: value });
  };

  const editProductProps = {
    handleSubmit: handleSubmit,
    handleChange: handleChange,
    productState: {
      productToAddUpdate: productToAddUpdate,
      loading,
      message,
      error,
    },
    title: ProductOperation.UPDATE_PRODUCT,
    ctaText: "Update",
    ctaLoadingText: "Updating...",
  };
  return <ProductForm {...editProductProps} />;
};
