import { supabase } from "./supabase";

export async function getVillageInfo() {
  const { data, error } = await supabase
    .from("village_info")
    .select("*")
    .single();

  if (error || !data) {
    return {
      nama_dusun: "Dusun Bacinan",
      deskripsi_singkat: "Selamat datang di portal informasi resmi dusun kami.",
      visi_misi: "Mewujudkan dusun yang mandiri, sejahtera, dan berbudaya.",
      gmaps_coordinates: "-7.7956,110.3695",
    };
  }

  return data;
}

export async function getDemographicStats() {
  const { data, error } = await supabase.rpc("get_demographic_stats");

  if (error || !data || data.length === 0) {
    // Return mock data if empty or error for preview
    return [
      { kategori: "Jenis Kelamin", sub_kategori: "Laki-laki", jumlah: 120 },
      { kategori: "Jenis Kelamin", sub_kategori: "Perempuan", jumlah: 135 },
      { kategori: "Agama", sub_kategori: "Islam", jumlah: 250 },
      { kategori: "Agama", sub_kategori: "Kristen", jumlah: 5 },
      { kategori: "Pekerjaan", sub_kategori: "Petani", jumlah: 80 },
      { kategori: "Pekerjaan", sub_kategori: "Wiraswasta", jumlah: 45 },
      { kategori: "Pekerjaan", sub_kategori: "PNS", jumlah: 15 },
      { kategori: "Sebaran RT", sub_kategori: "RT 01", jumlah: 90 },
      { kategori: "Sebaran RT", sub_kategori: "RT 02", jumlah: 85 },
      { kategori: "Sebaran RT", sub_kategori: "RT 03", jumlah: 80 },
    ];
  }

  return data;
}

export async function getOfficials() {
  const { data, error } = await supabase
    .from("officials")
    .select("*")
    .order("urutan", { ascending: true });

  if (error || !data || data.length === 0) {
    return [
      { id: '1', nama: 'Budi Santoso', jabatan: 'Kepala Dusun', foto_url: '' },
      { id: '2', nama: 'Siti Aminah', jabatan: 'Sekretaris Dusun', foto_url: '' },
      { id: '3', nama: 'Ahmad Dahlan', jabatan: 'Ketua RT 01', foto_url: '' },
    ];
  }
  return data;
}

export async function getContacts() {
  const { data, error } = await supabase
    .from("contacts")
    .select("*");

  if (error || !data || data.length === 0) {
    return [
      { id: '1', kategori: 'Darurat', label: 'Ambulans Desa', value: '08123456789' },
      { id: '2', kategori: 'Pelayanan', label: 'Layanan Pengaduan', value: '08987654321' },
      { id: '3', kategori: 'Sosmed', label: 'Instagram', value: '@dusun_bacinan' },
    ];
  }
  return data;
}
