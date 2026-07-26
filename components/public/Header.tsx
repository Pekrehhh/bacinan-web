"use client";

import Link from "next/link";
import { LogIn } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Header({ 
  activeTab, 
  setActiveTab 
}: { 
  activeTab: string, 
  setActiveTab: (tab: string) => void 
}) {
  return (
    <header className="sticky top-0 z-50 w-full bg-slate-50/80 backdrop-blur-xl border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-sm">
            B
          </div>
          <span className="font-extrabold text-xl tracking-tight text-slate-900">
            BACINAN
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-1 bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200/60">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={cn(
              "px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-300",
              activeTab === "dashboard"
                ? "bg-slate-900 text-white shadow-md"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            )}
          >
            DASHBOARD
          </button>
          <button
            onClick={() => setActiveTab("map")}
            className={cn(
              "px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-300",
              activeTab === "map"
                ? "bg-slate-900 text-white shadow-md"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            )}
          >
            PETA WILAYAH
          </button>
          <button
            onClick={() => setActiveTab("officials")}
            className={cn(
              "px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-300",
              activeTab === "officials"
                ? "bg-slate-900 text-white shadow-md"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            )}
          >
            STRUKTUR
          </button>
        </nav>

        <Link
          href="/admin/login"
          className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-colors shadow-md"
        >
          <LogIn size={16} />
          <span className="hidden sm:inline">Log In</span>
        </Link>
      </div>

      {/* Mobile nav indicator */}
      <div className="md:hidden flex overflow-x-auto p-4 gap-2 bg-white border-t border-slate-100 shadow-sm">
         <button
            onClick={() => setActiveTab("dashboard")}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap",
              activeTab === "dashboard" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"
            )}
          >
            DASHBOARD
          </button>
          <button
            onClick={() => setActiveTab("map")}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap",
              activeTab === "map" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"
            )}
          >
            PETA WILAYAH
          </button>
          <button
            onClick={() => setActiveTab("officials")}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap",
              activeTab === "officials" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"
            )}
          >
            STRUKTUR
          </button>
      </div>
    </header>
  );
}
