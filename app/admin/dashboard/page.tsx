import { getDemographicStats } from "@/lib/data";

export default async function DashboardPage() {
  const stats = await getDemographicStats();
  
  const totalWarga = stats.filter((s: any) => s.kategori === 'Jenis Kelamin').reduce((acc: number, curr: any) => acc + Number(curr.jumlah), 0);
  const totalRT = stats.filter((s: any) => s.kategori === 'Sebaran RT').length;

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Dashboard Admin</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <p className="text-sm font-medium text-slate-500 mb-1">Total Penduduk</p>
          <p className="text-3xl font-bold text-slate-900">{totalWarga} Jiwa</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <p className="text-sm font-medium text-slate-500 mb-1">Total RT</p>
          <p className="text-3xl font-bold text-slate-900">{totalRT} Wilayah</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Selamat Datang di Panel Admin</h3>
        <p className="text-slate-600">
          Gunakan menu di sebelah kiri untuk mengelola data penduduk dan konten informasi dusun. 
          Semua perubahan yang Anda lakukan di sini akan langsung diperbarui di portal publik warga.
        </p>
      </div>
    </div>
  );
}
