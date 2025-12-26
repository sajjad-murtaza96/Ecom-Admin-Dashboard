"use client";
import { useReducer } from "react";
import { ProductReducer } from "./product.reducer";
import type { Product } from "./product.type";

export const initialState = {
  productToAddUpdate: {
    title: "",
    price: "",
    description: "",
    imageUrl: "",
  },
  loading: false,
  error: "",
  message: "",
};

export const useProductReducer = () => {
  const [state, dispatch] = useReducer(ProductReducer, initialState);
  return {
    state,
    fetchStart: () => dispatch({ type: "FETCH_START" }),
    addProduct: (product: Product) =>
      dispatch({ type: "ADD_PRODUCT", payload: product }),
    fetchSuccess: (message: string) =>
      dispatch({ type: "FETCH_SUCCESS", payload: message }),
    fetchFailed: (error: string) =>
      dispatch({ type: "FETCH_ERROR", payload: error }),
    resetProductForm: (product: Product) =>
      dispatch({ type: "RESET_PRODUCT_FORM", payload: product }),
  };
};
