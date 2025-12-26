import type { Product } from "@/reducers/product/product.type";
import { db } from "./firebase-admin";

export const getAllProducts = async () => {
  const productsSnapShot = db.collection("products").get();
  const productDocument = await (await productsSnapShot).query.get();
  if (productDocument.empty) return [];
  return productDocument.docs.map((doc) => doc.data());
};

export const createProduct = async (product: Product) => {
  const newProductRef = db.collection("products").doc();
  await newProductRef.set(
    {
      id: newProductRef.id,
      ...product,
    },
    { merge: true }
  );
  return { id: newProductRef.id };
};

export const removeProduct = async (productId: string) => {
  try {
    const productRef = db.collection("products").doc(productId);
    const snapShot = await productRef.get();
    if (!snapShot.exists) {
      return false;
    }

    await productRef.delete();
    return true;
  } catch (error) {
    console.error("Delete failed:", error);
    return false;
  }
};

export const getProductById = async (productId: string) => {
  const productRef = db.collection("products").doc(productId);
  const snapShot = await productRef.get();
  if (!snapShot.exists) return;
  return snapShot.data() as Product;
};

export const updateProduct = async (productId: string, product: Product) => {
  const productRef = db.collection("products").doc(productId);
  const snapShot = await productRef.get();
  if (!snapShot.exists) return;
  await productRef.update(product);
  return {
    id: productRef.id,
  };
};
