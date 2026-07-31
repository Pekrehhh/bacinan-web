import { Suspense } from "react";
import ResidentsDataWrapper from "./ResidentsDataWrapper";

export default function ResidentsPage() {
  return (
    <div>
      {/* Header is rendered instantly for fast LCP */}
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Manajemen Data Warga</h2>
      
      <Suspense fallback={<TableSkeleton />}>
        <ResidentsDataWrapper />
      </Suspense>
    </div>
  );
}

// Simple Skeleton Loader for the table
function TableSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Header Actions Skeleton */}
      <div className="flex justify-end mb-6 gap-2">
        <div className="bg-slate-200 h-10 w-32 rounded-lg"></div>
        <div className="bg-slate-200 h-10 w-32 rounded-lg"></div>
      </div>

      {/* Filters Skeleton */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <div className="bg-slate-200 h-10 w-full sm:w-64 rounded-lg"></div>
        <div className="bg-slate-200 h-10 w-full sm:w-32 rounded-lg"></div>
      </div>

      {/* Table Skeleton */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="bg-slate-50 border-b border-slate-200 h-12 w-full"></div>
        <div className="divide-y divide-slate-100">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex px-6 py-4 gap-4">
              <div className="bg-slate-200 h-12 w-1/4 rounded"></div>
              <div className="bg-slate-200 h-12 w-1/4 rounded"></div>
              <div className="bg-slate-200 h-12 w-1/4 rounded"></div>
              <div className="bg-slate-200 h-12 w-1/4 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
