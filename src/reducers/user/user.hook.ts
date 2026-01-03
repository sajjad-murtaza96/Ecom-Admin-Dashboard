"use client";
import { useReducer } from "react";
import { UserReducer } from "./user.reducer";
import type { User } from "./user.type";

export const initialState = {
  user: {
    name: "",
    password: "",
  },
  loading: false,
  error: "",
};

export const useUserReducer = () => {
  const [state, dispatch] = useReducer(UserReducer, initialState);
  return {
    state,
    startLoading: () => dispatch({ type: "START_LOADING" }),
    addUser: (user: User) => dispatch({ type: "ADD_USER", payload: user }),
    showError: (error: string) =>
      dispatch({ type: "SHOW_ERROR", payload: error }),
  };
};
