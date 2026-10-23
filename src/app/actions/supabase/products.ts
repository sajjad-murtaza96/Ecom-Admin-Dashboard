"use server";
import { getAllProducts, getProductById } from "@/db/supabase/query";
import { notFound } from "next/navigation";

export const getAllProductsAction = async () => {
  const { data: products, error } = await getAllProducts();
  if (error) {
    console.error(error);
    return [];
  }
  if (!products) return [];
  return products;
};

export const getProductByIdAction = async (productId: string) => {
  const { data: product, error } = await getProductById(productId);
  if (error) {
    console.error(error);
    return;
  }
  if (!product) notFound();
  return product;
};
