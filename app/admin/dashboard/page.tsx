import { Suspense } from "react";
import DashboardDataWrapper from "./DashboardDataWrapper";

export default function DashboardPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Dashboard Admin</h2>
      
      {/* 1. Deskripsi - This renders instantly (LCP optimized) */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 mb-6">
        <h3 className="text-lg font-bold text-slate-800 mb-2">Selamat Datang di Panel Admin</h3>
        <p className="text-slate-600">
          Gunakan menu di sebelah kiri untuk mengelola data penduduk dan konten informasi dusun. 
          Semua perubahan yang Anda lakukan di sini akan langsung diperbarui di portal publik warga.
        </p>
      </div>

      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardDataWrapper />
      </Suspense>
    </div>
  );
}

// Simple Skeleton Loader
function DashboardSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Stat Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-slate-200 h-24 rounded-xl"></div>
        <div className="bg-slate-200 h-24 rounded-xl"></div>
      </div>
      {/* Time Skeleton */}
      <div className="bg-slate-200 h-10 w-64 rounded-lg mb-8"></div>
      {/* Charts Skeleton Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-200 h-[300px] rounded-xl"></div>
        <div className="bg-slate-200 h-[300px] rounded-xl"></div>
        <div className="bg-slate-200 h-[300px] rounded-xl"></div>
      </div>
    </div>
  );
}
