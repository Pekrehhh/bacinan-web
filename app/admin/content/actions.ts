"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function updateVillageInfo(formData: any) {
  // First, check if there's an existing row in village_info
  const { data: existingData, error: checkError } = await supabase
    .from("village_info")
    .select("id")
    .limit(1);

  let error;

  if (checkError && checkError.code === "42P01") {
    return { success: false, message: "Tabel village_info belum dibuat di database." };
  }

  if (existingData && existingData.length > 0) {
    // Update existing
    const { error: updateError } = await supabase
      .from("village_info")
      .update({
        nama_dusun: formData.nama_dusun,
        deskripsi_singkat: formData.deskripsi_singkat,
        visi_misi: formData.visi_misi,
      })
      .eq("id", existingData[0].id);
    
    error = updateError;
  } else {
    // Insert new if empty
    const { error: insertError } = await supabase
      .from("village_info")
      .insert([
        {
          nama_dusun: formData.nama_dusun,
          deskripsi_singkat: formData.deskripsi_singkat,
          visi_misi: formData.visi_misi,
        }
      ]);
    
    error = insertError;
  }

  if (error) {
    console.error("Error updating village info:", error);
    return { success: false, message: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin/content");

  return { success: true, message: "Profil dusun berhasil diperbarui!" };
}

export async function updateOfficials(officialsData: any[]) {
  let hasError = false;
  let errorMessage = "";

  for (const official of officialsData) {
    if (official.id) {
      // Update existing
      const { error } = await supabase
        .from("officials")
        .update({
          nama: official.nama,
          jabatan: official.jabatan,
          urutan: official.urutan
        })
        .eq("id", official.id);
      
      if (error) {
        hasError = true;
        errorMessage = error.message;
        break;
      }
    } else {
      // Insert new if nama is not empty
      if (official.nama.trim() !== "") {
        const { error } = await supabase
          .from("officials")
          .insert([
            {
              nama: official.nama,
              jabatan: official.jabatan,
              urutan: official.urutan,
              is_active: true
            }
          ]);
        
        if (error) {
          hasError = true;
          errorMessage = error.message;
          break;
        }
      }
    }
  }

  if (hasError) {
    console.error("Error updating officials:", errorMessage);
    return { success: false, message: errorMessage };
  }

  revalidatePath("/");
  revalidatePath("/admin/content");

  return { success: true, message: "Perangkat desa berhasil diperbarui!" };
}

export async function updateContacts(contactsData: any[]) {
  // First, get existing contacts to see which ones to delete
  const { data: existingContacts } = await supabase.from("contacts").select("id");
  
  const incomingIds = contactsData.map(c => c.id).filter(id => id && id.length > 20 && !id.startsWith("new-"));
  const idsToDelete = existingContacts?.map(c => c.id).filter(id => !incomingIds.includes(id)) || [];

  let hasError = false;
  let errorMessage = "";

  // Delete removed contacts
  if (idsToDelete.length > 0) {
    const { error } = await supabase.from("contacts").delete().in("id", idsToDelete);
    if (error) {
      hasError = true;
      errorMessage = error.message;
    }
  }

  // Upsert incoming contacts
  for (const contact of contactsData) {
    if (contact.id && contact.id.length > 20 && !contact.id.startsWith("new-")) {
      // Update
      const { error } = await supabase
        .from("contacts")
        .update({
          kategori: contact.kategori,
          label: contact.label,
          value: contact.value
        })
        .eq("id", contact.id);
      
      if (error) {
        hasError = true;
        errorMessage = error.message;
      }
    } else {
      // Insert (biarkan Supabase yang mengenerate UUID baru jika tidak dikirim)
      const { error } = await supabase
        .from("contacts")
        .insert([{
          kategori: contact.kategori,
          label: contact.label,
          value: contact.value
        }]);
      
      if (error) {
        hasError = true;
        errorMessage = error.message;
      }
    }
  }

  if (hasError) {
    console.error("Error updating contacts:", errorMessage);
    return { success: false, message: errorMessage };
  }

  revalidatePath("/");
  revalidatePath("/admin/content");

  return { success: true, message: "Kontak penting berhasil diperbarui!" };
}
