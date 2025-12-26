"use server";
import { cookies } from "next/headers";
import { removeAuth } from "../../utilities/auth";

export const logout = async () => {
  await removeAuth(await cookies());
};
