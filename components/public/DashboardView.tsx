"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ChevronLeft, ChevronRight, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const COLORS = ['#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6', '#d946ef', '#f43f5e', '#f97316', '#eab308', '#22c55e', '#14b8a6'];

export default function DashboardView({ stats, villageInfo }: { stats: any[], villageInfo: any }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Parse stats for charts
  const genderData = stats.filter((s: any) => s.kategori === 'Jenis Kelamin').map((s: any) => ({ name: s.sub_kategori, value: Number(s.jumlah) }));
  const ageData = stats.filter((s: any) => s.kategori === 'Usia').map((s: any) => ({ name: s.sub_kategori, value: Number(s.jumlah) }));
  const jobData = stats.filter((s: any) => s.kategori === 'Pekerjaan').map((s: any) => ({ name: s.sub_kategori, value: Number(s.jumlah) }));
  const educationData = stats.filter((s: any) => s.kategori === 'Pendidikan').map((s: any) => ({ name: s.sub_kategori, value: Number(s.jumlah) }));
  const rtData = stats.filter((s: any) => s.kategori === 'Sebaran RT').map((s: any) => ({ name: s.sub_kategori, value: Number(s.jumlah) })).sort((a, b) => a.name.localeCompare(b.name));
  
  // Filter out 'Belum Diisi' or 0 values to make public charts cleaner
  const filterEmpty = (data: any[]) => data.filter(d => d.value > 0 && d.name !== 'Belum Diisi');

  const validGenderData = filterEmpty(genderData);
  const validAgeData = filterEmpty(ageData);
  const validJobData = filterEmpty(jobData);
  const validEducationData = filterEmpty(educationData);
  
  // We don't filter rtData because we want all RTs to show on the bar chart, or maybe we do filter empty
  // Actually, wait, BarChart looks better if all RTs are shown, but for pie charts empty values are bad.
  // For totalWarga, sum up the raw genderData to include everyone
  const totalWarga = genderData.reduce((acc, curr) => acc + curr.value, 0);

  // Interactive Carousel State
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);

  const slides = [
    { 
      title: (
        <>
          Selamat Datang di <br />
          <span className="text-blue-400">Dusun Bacinan</span>
        </>
      ),
      hoverTitle: "Profil Dusun",
      content: villageInfo.deskripsi_singkat 
    },
    { 
      title: (
        <>
          Visi & Misi <br />
          <span className="text-blue-400">Dusun Bacinan</span>
        </>
      ),
      hoverTitle: "Visi & Misi",
      content: villageInfo.visi_misi 
    }
  ];

  const nextSlide = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };
  const prevSlide = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Auto Slide Effect
  useEffect(() => {
    // Only auto-slide if not revealed
    if (isRevealed) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 10000);
    
    return () => clearInterval(interval);
  }, [slides.length, isRevealed]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 space-y-6">
      
      {/* SECTION 1: Top Hero Interactive Carousel */}
      <div 
        className="relative w-full h-[400px] rounded-[2rem] overflow-hidden bg-slate-900 shadow-xl cursor-pointer group"
        onClick={() => setIsRevealed(!isRevealed)}
      >
        <div className="absolute inset-0 z-0 transition-transform duration-700 hover:scale-105">
          <Image
            src="/images/hero.jpg"
            alt="Desa Bacinan"
            fill
            className="object-cover opacity-50"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-slate-900/40" />
        </div>
        
        <div className="relative z-10 h-full flex flex-col justify-center px-8 md:px-16 max-w-4xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full flex flex-col justify-center relative"
            >
              {/* Default State: Title */}
              <div 
                className={cn(
                  "absolute inset-0 flex flex-col justify-center transition-opacity duration-500",
                  isRevealed ? "opacity-0 pointer-events-none" : "opacity-100"
                )}
              >
                <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight drop-shadow-md">
                  {slides[currentSlide].title}
                </h1>
                <p className="text-slate-300 mt-4 text-sm md:text-base animate-pulse">
                  Sentuh atau klik untuk membaca selengkapnya
                </p>
              </div>

              {/* Revealed State: Description / Visi Misi */}
              <div 
                className={cn(
                  "absolute inset-0 flex flex-col justify-center transition-opacity duration-500",
                  isRevealed ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
              >
                <div>
                  <h2 className="text-3xl font-extrabold text-white mb-4 drop-shadow-md">{slides[currentSlide].hoverTitle}</h2>
                  <div className="space-y-4 max-h-[250px] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                    <p className="text-slate-200 leading-relaxed text-base md:text-lg whitespace-pre-line drop-shadow-md">
                      {slides[currentSlide].content}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Carousel Controls */}
        <div className="absolute bottom-8 right-8 flex gap-3 z-20">
          <button aria-label="Slide sebelumnya" onClick={prevSlide} className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20 transition-all shadow-md">
            <ChevronLeft size={24} />
          </button>
          <button aria-label="Slide selanjutnya" onClick={nextSlide} className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20 transition-all shadow-md">
            <ChevronRight size={24} />
          </button>
        </div>
        
        {/* Indicators */}
        <div className="absolute bottom-8 left-10 md:left-16 flex gap-2 z-20">
          {slides.map((_, i) => (
            <div key={i} className={cn("h-1.5 rounded-full transition-all duration-300 shadow-sm", i === currentSlide ? "w-8 bg-blue-500" : "w-4 bg-white/30")} />
          ))}
        </div>
      </div>

      {/* SECTION 2, 3, 4: Pie Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ChartCard title="Jenis Kelamin">
          <div className="w-full h-[250px]">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                {validGenderData.length > 0 ? (
                  <PieChart>
                    <Pie data={validGenderData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value">
                      {validGenderData.map((entry: any, index: number) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={(value, name) => [`${value} Jiwa`, name]} />
                  </PieChart>
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-500 text-sm">Belum ada data</div>
                )}
              </ResponsiveContainer>
            )}
          </div>
          <CustomLegend data={validGenderData} colors={COLORS} />
        </ChartCard>

        <ChartCard title="Kategori Usia">
          <div className="w-full h-[250px]">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                {validAgeData.length > 0 ? (
                  <PieChart>
                    <Pie data={validAgeData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value">
                      {validAgeData.map((entry: any, index: number) => <Cell key={`cell-${index}`} fill={COLORS[(index+2) % COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={(value, name) => [`${value} Jiwa`, name]} />
                  </PieChart>
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-500 text-sm">Belum ada data</div>
                )}
              </ResponsiveContainer>
            )}
          </div>
          <CustomLegend data={validAgeData} colors={COLORS} offset={2} />
        </ChartCard>

        <ChartCard title="Pendidikan">
          <div className="w-full h-[250px]">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                {validEducationData.length > 0 ? (
                  <PieChart>
                    <Pie data={validEducationData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value">
                      {validEducationData.map((entry: any, index: number) => <Cell key={`cell-${index}`} fill={COLORS[(index+4) % COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={(value, name) => [`${value} Jiwa`, name]} />
                  </PieChart>
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-500 text-sm">Belum ada data</div>
                )}
              </ResponsiveContainer>
            )}
          </div>
          <CustomLegend data={validEducationData} colors={COLORS} offset={4} />
        </ChartCard>
      </div>

      {/* SECTION: Status Pekerjaan (Full Width) */}
      <div className="bg-white rounded-[2rem] p-6 md:p-10 shadow-lg shadow-slate-200/50 border border-slate-100 w-full">
        <h3 className="text-xl font-bold text-slate-800 mb-6">Status Pekerjaan</h3>
        <div className="flex flex-col lg:flex-row items-center gap-8">
          <div className="w-full lg:w-1/3 h-[250px]">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                {validJobData.length > 0 ? (
                  <PieChart>
                    <Pie data={validJobData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value">
                      {validJobData.map((entry: any, index: number) => <Cell key={`cell-${index}`} fill={COLORS[(index+6) % COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={(value, name) => [`${value} Jiwa`, name]} />
                  </PieChart>
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-500 text-sm">Belum ada data</div>
                )}
              </ResponsiveContainer>
            )}
          </div>
          <div className="w-full lg:w-2/3">
            <CustomLegend data={validJobData} colors={COLORS} offset={6} showAll={true} />
          </div>
        </div>
      </div>

      {/* SECTION 5: Bar Chart & Total Warga */}
      <div className="relative w-full rounded-[2rem] overflow-hidden bg-white shadow-xl border border-slate-100 p-8 md:p-12 flex flex-col lg:flex-row gap-12 items-center">
        <div className="w-full lg:w-1/3 flex flex-col justify-center">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
            <Users size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Total Penduduk</h3>
          <p className="text-slate-500 mb-6">Distribusi warga berdasarkan pencatatan administratif per Rukun Tetangga (RT).</p>
          <div className="text-5xl font-extrabold text-slate-900 tracking-tight">
            {totalWarga} <span className="text-2xl text-slate-500 font-semibold">Jiwa</span>
          </div>
        </div>
        
        <div className="w-full lg:w-2/3 h-[300px]">
          {mounted && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rtData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <Tooltip cursor={{fill: '#f1f5f9'}} formatter={(value, name) => [`${value} Jiwa`, name]} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]}>
                  {rtData.map((entry: any, index: number) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

    </div>
  );
}

function ChartCard({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-[2rem] p-6 shadow-lg shadow-slate-200/50 border border-slate-100 flex flex-col h-full">
      <h3 className="text-lg font-bold text-slate-800 mb-2">{title}</h3>
      <div className="flex-1 flex flex-col justify-between">
        {children}
      </div>
    </div>
  );
}

function CustomLegend({ data, colors, offset = 0, showAll = false }: { data: any[], colors: string[], offset?: number, showAll?: boolean }) {
  const limit = showAll ? data.length : 4;
  const displayData = data.slice(0, limit);
  return (
    <div className={cn("mt-4 grid gap-2 px-2", showAll ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4" : "grid-cols-2")}>
      {displayData.map((entry, index) => (
        <div key={index} className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: colors[(index + offset) % colors.length] }} />
          <span className="text-xs font-medium text-slate-600 truncate" title={entry.name}>{entry.name} {showAll && <span className="text-slate-500 ml-1">({entry.value})</span>}</span>
        </div>
      ))}
      {!showAll && data.length > 4 && (
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-slate-300 shrink-0" />
          <span className="text-xs font-medium text-slate-600 truncate">Lainnya...</span>
        </div>
      )}
    </div>
  );
}
