"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, FileText, X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Sidebar({
  isOpen,
  setIsOpen,
  isCollapsed
}: {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  isCollapsed?: boolean;
}) {
  const pathname = usePathname();

  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar Content */}
      <aside className={cn(
        "fixed md:static inset-y-0 left-0 z-50 bg-slate-900 text-slate-300 flex flex-col transition-all duration-300 ease-in-out md:transform-none shadow-2xl md:shadow-none overflow-hidden shrink-0",
        isOpen ? "translate-x-0 w-64" : "-translate-x-full w-64",
        isCollapsed ? "md:w-0 md:opacity-0 md:-translate-x-full" : "md:w-64 md:opacity-100 md:translate-x-0"
      )}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800 shrink-0 min-w-[16rem]">
          <h1 className="text-xl font-bold text-white tracking-wide whitespace-nowrap">SID Admin</h1>
          <button onClick={closeSidebar} className="md:hidden p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1 min-w-[16rem]">
          <Link
            href="/admin/dashboard"
            onClick={closeSidebar}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors whitespace-nowrap",
              pathname === "/admin/dashboard" ? "bg-blue-600 text-white shadow-md" : "hover:bg-slate-800 hover:text-white"
            )}
          >
            <LayoutDashboard size={20} className="shrink-0" />
            <span>Dashboard</span>
          </Link>
          <Link
            href="/admin/residents"
            onClick={closeSidebar}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors whitespace-nowrap",
              pathname === "/admin/residents" ? "bg-blue-600 text-white shadow-md" : "hover:bg-slate-800 hover:text-white"
            )}
          >
            <Users size={20} className="shrink-0" />
            <span>Data Warga</span>
          </Link>
          <Link
            href="/admin/content"
            onClick={closeSidebar}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors whitespace-nowrap",
              pathname === "/admin/content" ? "bg-blue-600 text-white shadow-md" : "hover:bg-slate-800 hover:text-white"
            )}
          >
            <FileText size={20} className="shrink-0" />
            <span>Kelola Konten</span>
          </Link>
        </nav>
      </aside>
    </>
  );
}
