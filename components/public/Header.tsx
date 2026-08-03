"use client";

import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";

export default function Header() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "dashboard";

  const handleTabClick = (tab: string) => {
    router.push(`/?tab=${tab}`);
  };

  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200/60 shadow-sm transition-all duration-300">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-20 flex items-center justify-between gap-4">
        
        {/* Logo Section */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg md:text-xl shadow-sm">
            B
          </div>
          {/* Hide text on very small screens if needed, but sm:block keeps it visible on small and up */}
          <span className="font-extrabold text-lg md:text-xl tracking-tight text-slate-900 hidden sm:block">
            BACINAN
          </span>
        </div>

        {/* Navigation Tabs (Unified for both Mobile & Desktop) */}
        <nav className="flex items-center gap-1 bg-white p-1 md:p-1.5 rounded-xl md:rounded-2xl shadow-sm border border-slate-200/60 overflow-x-auto w-full md:w-auto justify-start md:justify-center [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <button
            onClick={() => handleTabClick("dashboard")}
            className={cn(
              "px-3 md:px-5 py-1.5 md:py-2 rounded-lg md:rounded-xl text-xs md:text-sm font-semibold transition-all duration-300 whitespace-nowrap",
              activeTab === "dashboard"
                ? "bg-slate-900 text-white shadow-md"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            )}
          >
            DASHBOARD
          </button>
          <button
            onClick={() => handleTabClick("map")}
            className={cn(
              "px-3 md:px-5 py-1.5 md:py-2 rounded-lg md:rounded-xl text-xs md:text-sm font-semibold transition-all duration-300 whitespace-nowrap",
              activeTab === "map"
                ? "bg-slate-900 text-white shadow-md"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            )}
          >
            PETA WILAYAH
          </button>
          <button
            onClick={() => handleTabClick("officials")}
            className={cn(
              "px-3 md:px-5 py-1.5 md:py-2 rounded-lg md:rounded-xl text-xs md:text-sm font-semibold transition-all duration-300 whitespace-nowrap",
              activeTab === "officials"
                ? "bg-slate-900 text-white shadow-md"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            )}
          >
            STRUKTUR
          </button>
        </nav>
        
        {/* Spacer for desktop symmetry, hidden on mobile */}
        <div className="w-[104px] hidden md:block shrink-0"></div> 
      </div>
    </header>
  );
}
