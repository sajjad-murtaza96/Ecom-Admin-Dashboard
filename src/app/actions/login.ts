"use server";
import { redirect } from "next/navigation";
import { db } from "../../db/firebase-admin";
import { cookies } from "next/headers";
import { setAuth } from "../../utilities/auth";
import type { User } from "@/reducers/user/user.type";

export const login = async (user: User) => {
  const usersSnapShot = db.collection("users").get();
  const document = await (await usersSnapShot).query
    .where("name", "==", user.name)
    .where("password", "==", user.password)
    .get();

  if (document.empty) return "Username/Password is incorrect";
  setAuth(await cookies());
  redirect("/shop");
};
