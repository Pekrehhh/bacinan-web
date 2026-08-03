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
      gmaps_coordinates: "7°38'42.63\"S 110°17'29.83\"E",
    };
  }

  return data;
}

export async function getDemographicStats() {
  const { data: allResidents, error } = await supabase.from("residents").select("*");

  if (error || !allResidents || allResidents.length === 0) {
    return [
      { kategori: "Jenis Kelamin", sub_kategori: "Belum Diisi", jumlah: 0 }
    ];
  }

  const result: any[] = [];

  const getCount = (field: string, categoryName: string) => {
    const counts: Record<string, number> = {};
    allResidents.forEach(r => {
      let val = r[field];
      if (!val || val.trim() === '' || val === '-') {
        val = 'Belum Diisi';
      }
      counts[val] = (counts[val] || 0) + 1;
    });
    
    Object.entries(counts).forEach(([sub, jumlah]) => {
      result.push({ kategori: categoryName, sub_kategori: sub, jumlah });
    });
  };

  getCount('jenis_kelamin', 'Jenis Kelamin');
  getCount('agama', 'Agama');
  getCount('pekerjaan', 'Pekerjaan');
  getCount('rt', 'Sebaran RT');
  getCount('pendidikan_terakhir', 'Pendidikan');
  getCount('status_perkawinan', 'Status Perkawinan');

  // Age Data Categorization
  let ageCounts = { 'Anak (0-12)': 0, 'Remaja (13-18)': 0, 'Dewasa (19-60)': 0, 'Lansia (61+)': 0, 'Belum Diisi': 0 };
  allResidents.forEach(r => {
    if (r.usia !== null && r.usia !== undefined && String(r.usia).trim() !== '') {
      const usia = Number(r.usia);
      if (usia >= 0 && usia <= 12) ageCounts['Anak (0-12)']++;
      else if (usia >= 13 && usia <= 18) ageCounts['Remaja (13-18)']++;
      else if (usia >= 19 && usia <= 60) ageCounts['Dewasa (19-60)']++;
      else if (usia >= 61) ageCounts['Lansia (61+)']++;
      else ageCounts['Belum Diisi']++;
    } else {
      ageCounts['Belum Diisi']++;
    }
  });

  Object.entries(ageCounts).forEach(([sub, jumlah]) => {
    result.push({ kategori: 'Usia', sub_kategori: sub, jumlah });
  });

  return result;
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
      { id: '1', kategori: 'Darurat', label: 'Ambulans Desa', value: '08123456789', urutan: 1 },
      { id: '2', kategori: 'Pelayanan', label: 'Layanan Pengaduan', value: '08987654321', urutan: 2 },
      { id: '3', kategori: 'Instagram', label: 'Instagram', value: '@dusun_bacinan', urutan: 3 },
    ];
  }
  
  return data.sort((a, b) => (a.urutan || 0) - (b.urutan || 0));
}

export interface LocationItem {
  id: string;
  nama_lokasi: string;
  kategori: string;
  latitude?: number;
  longitude?: number;
  maps_url?: string;
  coordinate_string?: string;
}

export const DUMMY_LOCATIONS: LocationItem[] = [
  // Perangkat Desa
  {
    id: "1",
    nama_lokasi: "Rumah Kepala Wilayah",
    kategori: "Perangkat Desa",
    coordinate_string: "7°38'49.3\"S 110°17'28.4\"E"
  },
  {
    id: "2",
    nama_lokasi: "Rumah Ketua RT 01",
    kategori: "Perangkat Desa",
    coordinate_string: "7°38'44.6\"S 110°17'30.2\"E"
  },
  {
    id: "3",
    nama_lokasi: "Rumah Ketua RT 02",
    kategori: "Perangkat Desa",
    coordinate_string: "7°38'40.2\"S 110°17'32.7\"E"
  },
  // Fasilitas Umum
  {
    id: "4",
    nama_lokasi: "Masjid Al Falah",
    kategori: "Fasilitas Umum",
    maps_url: "https://maps.app.goo.gl/RhA64iUoyxwe2QKk6"
  },
  {
    id: "5",
    nama_lokasi: "Gedung Serbaguna",
    kategori: "Fasilitas Umum",
    coordinate_string: "7°38'43.2\"S 110°17'30.5\"E"
  },
  {
    id: "6",
    nama_lokasi: "MI Al Islam Jamuskauman",
    kategori: "Fasilitas Umum",
    maps_url: "https://maps.app.goo.gl/M15bQm8iS2uRZJX36"
  },
  {
    id: "7",
    nama_lokasi: "Makam Dusun",
    kategori: "Fasilitas Umum",
    coordinate_string: "7°38'41.2\"S 110°17'27.4\"E"
  },
  {
    id: "8",
    nama_lokasi: "Makam Pangeran Kelithik",
    kategori: "Fasilitas Umum",
    coordinate_string: "7°38'46.2\"S 110°17'28.8\"E"
  }
];

export async function getLocations() {
  const { data, error } = await supabase
    .from("map_locations")
    .select("*")
    .order("urutan", { ascending: true });

  if (error || !data || data.length === 0) {
    return DUMMY_LOCATIONS;
  }
  
  return data;
}
