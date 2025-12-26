"use client";
import { createProductAction } from "@/app/actions/Product";
import { ProductForm } from "@/app/components/productForm";
import {
  useProductReducer,
  initialState,
} from "@/reducers/product/product.hook";
import { ProductOperation } from "@/utilities/product";

export const AddProductForm: React.FC = () => {
  const {
    state: { productToAddUpdate, loading, message, error },
    addProduct,
    fetchStart,
    fetchSuccess,
    resetProductForm,
  } = useProductReducer();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      fetchStart();
      createProductAction(productToAddUpdate)
        .then((result) => {
          if (result.id) {
            fetchSuccess("Product added successfully!");
          }
        })
        .finally(() => {
          resetProductForm(initialState.productToAddUpdate);
        });
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    addProduct({ ...productToAddUpdate, [name]: value });
  };

  const addProductProps = {
    handleSubmit: handleSubmit,
    handleChange: handleChange,
    productState: {
      productToAddUpdate,
      loading,
      message,
      error,
    },
    title: ProductOperation.ADD_PRODUCT,
    ctaText: "Add Product",
    ctaLoadingText: "Adding Product...",
  };

  return <ProductForm {...addProductProps} />;
};
