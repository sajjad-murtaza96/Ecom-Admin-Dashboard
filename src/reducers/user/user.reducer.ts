import type { User } from "./user.type";

export type UserState = {
  user: User;
  loading: boolean;
  error: string;
};

type UserAction =
  | { type: "START_LOADING" }
  | { type: "SHOW_ERROR"; payload: string }
  | { type: "ADD_USER"; payload: User }
  | { type: "RESET_USER_FORM"; payload: User };

export const UserReducer = (
  state: UserState,
  action: UserAction
): UserState => {
  switch (action.type) {
    case "START_LOADING":
      return { ...state, loading: true };
    case "SHOW_ERROR":
      return { ...state, loading: false, error: action.payload };
    case "ADD_USER":
      return {
        ...state,
        user: action.payload,
      };
    case "RESET_USER_FORM":
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
};
