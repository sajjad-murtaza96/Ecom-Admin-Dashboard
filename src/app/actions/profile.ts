"use server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/db/supabase/server";

export type ProfileState = {
  error?: string;
  success?: string;
};

const profileSchema = z.object({
  fullName: z.string().trim().min(1, "Enter your name.").max(100, "Name must be 100 characters or fewer."),
  phone: z.string().trim().max(40, "Phone number must be 40 characters or fewer."),
});

export async function updateProfileAction(_previousState: ProfileState, formData: FormData): Promise<ProfileState> {
  const result = profileSchema.safeParse({
    fullName: formData.get("fullName"),
    phone: formData.get("phone"),
  });
  if (!result.success) return { error: result.error.issues[0].message };

  try {
    const supabase = createClient(await cookies());

    const { error } = await supabase.auth.updateUser({
      data: { full_name: result.data.fullName, phone: result.data.phone },
    });
    if (error) return { error: "Unable to save your profile. Please try again." };
    revalidatePath("/profile", "layout");
    return { success: "Your profile has been updated." };
  } catch {
    return { error: "Unable to save your profile. Please try again." };
  }
}