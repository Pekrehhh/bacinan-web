"use client";

import { useState } from "react";
import { LayoutDashboard, Map as MapIcon, UsersRound } from "lucide-react";
import { cn } from "@/lib/utils";

export default function TabsContainer({
  demographicTab,
  mapTab,
  officialsTab,
}: {
  demographicTab: React.ReactNode;
  mapTab: React.ReactNode;
  officialsTab: React.ReactNode;
}) {
  const [activeTab, setActiveTab] = useState<"dashboard" | "map" | "officials">("dashboard");

  return (
    <div className="w-full max-w-7xl mx-auto px-4 -mt-16 relative z-20 pb-20">
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 p-2 mb-8 flex flex-col sm:flex-row justify-center gap-2 w-fit mx-auto">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={cn(
            "flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300",
            activeTab === "dashboard"
              ? "bg-blue-600 text-white shadow-md shadow-blue-200"
              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          )}
        >
          <LayoutDashboard size={18} />
          Demografi & Dashboard
        </button>
        <button
          onClick={() => setActiveTab("map")}
          className={cn(
            "flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300",
            activeTab === "map"
              ? "bg-blue-600 text-white shadow-md shadow-blue-200"
              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          )}
        >
          <MapIcon size={18} />
          Peta Wilayah
        </button>
        <button
          onClick={() => setActiveTab("officials")}
          className={cn(
            "flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300",
            activeTab === "officials"
              ? "bg-blue-600 text-white shadow-md shadow-blue-200"
              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          )}
        >
          <UsersRound size={18} />
          Struktur & Kontak
        </button>
      </div>

      <div className="min-h-[50vh]">
        {activeTab === "dashboard" && demographicTab}
        {activeTab === "map" && mapTab}
        {activeTab === "officials" && officialsTab}
      </div>
    </div>
  );
}
