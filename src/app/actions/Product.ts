"use server";
import {
  createProduct,
  getProductById,
  removeProduct,
  updateProduct,
} from "@/db/query";
import type { Product } from "../../reducers/product/product.type";
import { revalidatePath } from "next/cache";

export const createProductAction = async (product: Product) => {
  return createProduct(product);
};

export const removeProductAction = async (productId: string) => {
  const result = await removeProduct(productId);
  if (!result) return;
  revalidatePath("/");
};

export const getProductByIdAction = async (productId: string) => {
  const product = await getProductById(productId);
  if (!product) return;
  return product;
};

export const updateProductAction = async (
  productId: string,
  product: Product
) => {
  return updateProduct(productId, product);
};
