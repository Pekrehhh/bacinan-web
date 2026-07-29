import { createClient } from "@/utils/supabase/server";
import AdminDashboardCharts from "./AdminDashboardCharts";
import { Clock } from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: residents, error } = await supabase.from("residents").select("*").order("created_at", { ascending: false });
  
  if (error) {
    console.error("Error fetching residents for dashboard:", error);
  }

  const allResidents = residents || [];
  
  // Basic Stats
  const totalWarga = allResidents.length;
  const uniqueRT = new Set(allResidents.map(r => r.rt).filter(Boolean)).size;

  // Last Updated Time
  let lastUpdated = "Belum ada data";
  if (allResidents.length > 0) {
    const latestDate = new Date(allResidents[0].updated_at || allResidents[0].created_at);
    lastUpdated = latestDate.toLocaleDateString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
    }) + " WIB";
  }

  // Calculate Chart Data
  const getCount = (field: string) => {
    const counts: Record<string, number> = {};
    allResidents.forEach(r => {
      let val = r[field];
      if (!val || val.trim() === '' || val === '-') {
        val = 'Belum Diisi';
      }
      counts[val] = (counts[val] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  };

  const genderData = getCount('jenis_kelamin');
  const religionData = getCount('agama');
  const jobData = getCount('pekerjaan');
  const educationData = getCount('pendidikan_terakhir');
  const maritalData = getCount('status_perkawinan');
  
  const rtData = getCount('rt')
    .map(d => ({ name: `RT ${d.name}`, value: d.value }))
    .sort((a, b) => a.name.localeCompare(b.name));

  // Age Data Categorization
  // Anak: 0-12, Remaja: 13-18, Dewasa: 19-60, Lansia: 61-100
  let ageCounts = { Anak: 0, Remaja: 0, Dewasa: 0, Lansia: 0, BelumDiisi: 0 };
  allResidents.forEach(r => {
    if (r.usia !== null && r.usia !== undefined && String(r.usia).trim() !== '') {
      const usia = Number(r.usia);
      if (usia >= 0 && usia <= 12) ageCounts.Anak++;
      else if (usia >= 13 && usia <= 18) ageCounts.Remaja++;
      else if (usia >= 19 && usia <= 60) ageCounts.Dewasa++;
      else if (usia >= 61) ageCounts.Lansia++;
      else ageCounts.BelumDiisi++;
    } else {
      ageCounts.BelumDiisi++;
    }
  });

  const ageData = [
    { name: 'Anak (0-12)', value: ageCounts.Anak },
    { name: 'Remaja (13-18)', value: ageCounts.Remaja },
    { name: 'Dewasa (19-60)', value: ageCounts.Dewasa },
    { name: 'Lansia (61+)', value: ageCounts.Lansia },
    { name: 'Belum Diisi', value: ageCounts.BelumDiisi }
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Dashboard Admin</h2>
      
      {/* 1. Deskripsi */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 mb-6">
        <h3 className="text-lg font-bold text-slate-800 mb-2">Selamat Datang di Panel Admin</h3>
        <p className="text-slate-600">
          Gunakan menu di sebelah kiri untuk mengelola data penduduk dan konten informasi dusun. 
          Semua perubahan yang Anda lakukan di sini akan langsung diperbarui di portal publik warga.
        </p>
      </div>

      {/* 2. Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <p className="text-sm font-medium text-slate-500 mb-1">Total Penduduk</p>
          <p className="text-3xl font-bold text-slate-900">{totalWarga} Jiwa</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <p className="text-sm font-medium text-slate-500 mb-1">Total RT</p>
          <p className="text-3xl font-bold text-slate-900">{uniqueRT} Wilayah</p>
        </div>
      </div>

      {/* 3. Terakhir Update */}
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-8 bg-white p-3 rounded-lg border border-slate-100 shadow-sm w-max">
        <Clock size={16} className="text-blue-500" />
        <span>Terakhir data di update: <span className="font-semibold text-slate-700">{lastUpdated}</span></span>
      </div>

      {/* 4. Charts */}
      <AdminDashboardCharts 
        genderData={genderData}
        religionData={religionData}
        jobData={jobData}
        rtData={rtData}
        ageData={ageData}
        educationData={educationData}
        maritalData={maritalData}
      />
    </div>
  );
}
