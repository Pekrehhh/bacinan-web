"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import AdminTopbar from "./AdminTopbar";
import { User } from "@supabase/supabase-js";
import { usePathname } from "next/navigation";

export default function AdminLayoutClient({ 
  children, 
  user 
}: { 
  children: React.ReactNode; 
  user: User | null;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const pathname = usePathname();

  const isLoginPage = pathname === "/admin/login";

  const toggleSidebar = () => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(!isSidebarOpen);
    } else {
      setIsSidebarCollapsed(!isSidebarCollapsed);
    }
  };

  if (isLoginPage) {
    return (
      <div className="min-h-screen bg-slate-50">
        {children}
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50">
      <Sidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
        isCollapsed={isSidebarCollapsed} 
      />

      <main className="flex-1 flex flex-col overflow-hidden">
        <AdminTopbar user={user} onMenuClick={toggleSidebar} />
        <div className="flex-1 overflow-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
