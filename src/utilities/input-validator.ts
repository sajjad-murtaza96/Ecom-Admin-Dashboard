import * as z from "zod";

export const Users = z.object({
  name: z.email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});