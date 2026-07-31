"use client";

import { useState, useRef, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { Menu, LogOut, User as UserIcon, Lock, X, CheckCircle2, AlertCircle } from "lucide-react";
import { logout } from "./login/actions";
import { updateUsername, updatePassword } from "./profile-actions";

export default function AdminTopbar({ 
  user,
  onMenuClick
}: { 
  user: User | null;
  onMenuClick: () => void;
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<"username" | "password" | null>(null);
  
  const [status, setStatus] = useState<{ type: "success" | "error", message: string } | null>(null);
  const [isPending, setIsPending] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!user) return null;

  const rawName = user.user_metadata?.full_name || user.email?.split('@')[0] || "Admin";
  const username = rawName.replace(/[0-9]/g, '').replace(/[._-]/g, ' ').trim().toUpperCase();

  async function handleUsernameSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsPending(true);
    setStatus(null);
    const formData = new FormData(e.currentTarget);
    const res = await updateUsername(formData);
    
    if (res.error) {
      setStatus({ type: "error", message: res.error });
    } else {
      setStatus({ type: "success", message: "Username berhasil diperbarui" });
      setTimeout(() => setActiveModal(null), 1500);
    }
    setIsPending(false);
  }

  async function handlePasswordSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsPending(true);
    setStatus(null);
    const formData = new FormData(e.currentTarget);
    const res = await updatePassword(formData);
    
    if (res.error) {
      setStatus({ type: "error", message: res.error });
    } else {
      setStatus({ type: "success", message: "Kata sandi berhasil diperbarui" });
      setTimeout(() => setActiveModal(null), 1500);
    }
    setIsPending(false);
  }

  return (
    <div className="flex h-16 bg-white border-b border-slate-200 items-center justify-between shrink-0 sticky top-0 z-30">
      <div className="flex md:hidden items-center px-4">
        <button 
          onClick={onMenuClick}
          className="p-2 -ml-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200 shadow-sm"
        >
          <Menu size={20} />
        </button>
      </div>
      
      <div className="flex-1 hidden md:block"></div>
      
      <div className="relative h-full" ref={dropdownRef}>
        <button 
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="h-full px-4 md:px-8 flex flex-col justify-center bg-slate-50 hover:bg-slate-100 transition-colors border-l border-slate-200 min-w-fit md:min-w-[280px] text-left"
        >
          <p className="text-[13px] md:text-[15px] font-medium text-slate-900 tracking-wide leading-tight">
            {username || "ADMINISTRATOR"}
          </p>
          <p className="text-[11px] md:text-[13px] text-slate-500 mt-0.5">
            Administrator
          </p>
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 top-full w-full md:min-w-[280px] bg-white border border-slate-200 shadow-lg z-40">
            <div className="px-4 md:px-8 py-4 border-b border-slate-100 bg-slate-50/30">
              <p className="text-[13px] text-slate-500 truncate">
                {user.email || "admin@example.com"}
              </p>
            </div>
            
            <div className="py-2 flex flex-col">
              <button
                onClick={() => {
                  setActiveModal("username");
                  setIsDropdownOpen(false);
                  setStatus(null);
                }}
                className="w-full flex items-center gap-3 px-4 md:px-8 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <UserIcon size={18} className="text-slate-500" />
                Ubah Username
              </button>
              
              <button
                onClick={() => {
                  setActiveModal("password");
                  setIsDropdownOpen(false);
                  setStatus(null);
                }}
                className="w-full flex items-center gap-3 px-4 md:px-8 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <Lock size={18} className="text-slate-500" />
                Ubah Kata Sandi
              </button>

              <div className="my-1 border-t border-slate-100"></div>

              <form action={logout}>
                <button
                  type="submit"
                  className="w-full flex items-center gap-3 px-4 md:px-8 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={18} className="text-red-500" />
                  Log out
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {activeModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50">
              <h2 className="font-semibold text-slate-800">
                {activeModal === "username" ? "Ubah Username" : "Ubah Kata Sandi"}
              </h2>
              <button 
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-200 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
              {status && (
                <div className={`flex items-center gap-2 p-3 mb-4 rounded-lg text-sm ${status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                  {status.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                  <p>{status.message}</p>
                </div>
              )}

              {activeModal === "username" ? (
                <form onSubmit={handleUsernameSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Username Baru</label>
                    <input 
                      type="text" 
                      name="username" 
                      required 
                      defaultValue={rawName}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      placeholder="Masukkan nama tampilan baru"
                    />
                  </div>
                  <div className="flex justify-end gap-3 pt-2">
                    <button 
                      type="button" 
                      onClick={() => setActiveModal(null)}
                      className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      Batal
                    </button>
                    <button 
                      type="submit" 
                      disabled={isPending}
                      className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      {isPending ? "Menyimpan..." : "Simpan Perubahan"}
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Kata Sandi Lama</label>
                    <input 
                      type="password" 
                      name="oldPassword" 
                      required 
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      placeholder="Masukkan kata sandi saat ini"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Kata Sandi Baru</label>
                    <input 
                      type="password" 
                      name="password" 
                      required 
                      minLength={6}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      placeholder="Minimal 6 karakter"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Konfirmasi Kata Sandi</label>
                    <input 
                      type="password" 
                      name="confirmPassword" 
                      required 
                      minLength={6}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      placeholder="Ketik ulang kata sandi"
                    />
                  </div>
                  <div className="flex justify-end gap-3 pt-2">
                    <button 
                      type="button" 
                      onClick={() => setActiveModal(null)}
                      className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      Batal
                    </button>
                    <button 
                      type="submit" 
                      disabled={isPending}
                      className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      {isPending ? "Menyimpan..." : "Perbarui Sandi"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
