import type { Product } from "./product.type";

export type ProductState = {
  productToAddUpdate: Product;
  loading: boolean;
  error: string;
  message: string;
};

type ProductAction =
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; payload: string }
  | { type: "FETCH_ERROR"; payload: string }
  | { type: "ADD_PRODUCT"; payload: Product }
  | { type: "UPDATE_PRODUCT"; payload: Product }
  | { type: "DELETE_PRODUCT"; payload: string }
  | { type: "RESET_PRODUCT_FORM"; payload: Product };

export const ProductReducer = (
  state: ProductState,
  action: ProductAction
): ProductState => {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, message: action.payload };
    case "FETCH_ERROR":
      return { ...state, loading: false, error: action.payload };
    case "ADD_PRODUCT":
      return {
        ...state,
        productToAddUpdate: action.payload,
      };
    case "RESET_PRODUCT_FORM":
      return {
        ...state,
        productToAddUpdate: action.payload,
      };
    default:
      return state;
  }
};
