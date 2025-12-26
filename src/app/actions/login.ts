"use server";
import { redirect } from "next/navigation";
import type { UsersData } from "../login/types";
import { db } from "../../db/firebase-admin";
import { cookies } from "next/headers";
import { setAuth } from "../../utilities/auth";

export const login = async (users: UsersData) => {
  const usersSnapShot = db.collection("users").get();
  const document = await (await usersSnapShot).query
    .where("name", "==", users.userName)
    .where("password", "==", users.password)
    .get();

  if (document.empty) return "Invalid Credentials";
  setAuth(await cookies());
  redirect("/shop");
};
