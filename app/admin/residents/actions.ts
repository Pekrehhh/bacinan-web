"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function addResidentAction(formData: any) {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from("residents").insert([formData]);
    if (error) {
      console.error("Supabase insert error:", error);
      return { success: false, error: error.message };
    }
    revalidatePath("/admin/residents");
    revalidatePath("/admin/dashboard");
    revalidatePath("/");
    return { success: true, error: null };
  } catch (err: any) {
    console.error("Action addResident error:", err);
    return { success: false, error: err.message || "Gagal menambahkan data warga." };
  }
}

export async function updateResidentAction(id: string, formData: any) {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from("residents").update(formData).eq("id", id);
    if (error) {
      console.error("Supabase update error:", error);
      return { success: false, error: error.message };
    }
    revalidatePath("/admin/residents");
    revalidatePath("/admin/dashboard");
    revalidatePath("/");
    return { success: true, error: null };
  } catch (err: any) {
    console.error("Action updateResident error:", err);
    return { success: false, error: err.message || "Gagal memperbarui data warga." };
  }
}

export async function deleteResidentAction(id: string) {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from("residents").delete().eq("id", id);
    if (error) {
      console.error("Supabase delete error:", error);
      return { success: false, error: error.message };
    }
    revalidatePath("/admin/residents");
    revalidatePath("/admin/dashboard");
    revalidatePath("/");
    return { success: true, error: null };
  } catch (err: any) {
    console.error("Action deleteResident error:", err);
    return { success: false, error: err.message || "Gagal menghapus data warga." };
  }
}

export async function bulkImportResidentsAction(rows: any[]) {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from("residents").upsert(rows, { onConflict: "nik" });
    if (error) {
      console.error("Supabase upsert error:", error);
      return { success: false, error: error.message };
    }
    revalidatePath("/admin/residents");
    revalidatePath("/admin/dashboard");
    revalidatePath("/");
    return { success: true, error: null };
  } catch (err: any) {
    console.error("Action bulkImport error:", err);
    return { success: false, error: err.message || "Gagal mengimpor data warga." };
  }
}
