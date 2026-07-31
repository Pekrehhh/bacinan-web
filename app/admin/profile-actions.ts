"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

export async function updateUsername(formData: FormData) {
  const supabase = await createClient();
  const username = formData.get("username") as string;

  if (!username) {
    return { error: "Username tidak boleh kosong" };
  }

  const { error } = await supabase.auth.updateUser({
    data: { full_name: username }
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin", "layout");
  return { success: true };
}

export async function updatePassword(formData: FormData) {
  const supabase = await createClient();
  const oldPassword = formData.get("oldPassword") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!oldPassword) {
    return { error: "Kata sandi lama harus diisi" };
  }

  if (!password || password.length < 6) {
    return { error: "Kata sandi baru minimal 6 karakter" };
  }

  if (password !== confirmPassword) {
    return { error: "Konfirmasi kata sandi tidak cocok" };
  }

  // Verify old password
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) {
    return { error: "Sesi tidak valid" };
  }

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: oldPassword,
  });

  if (signInError) {
    return { error: "Kata sandi lama tidak sesuai" };
  }

  const { error } = await supabase.auth.updateUser({
    password: password
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}
