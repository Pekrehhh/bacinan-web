"use client";

import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Users, Home, Activity } from "lucide-react";

const COLORS = ['#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6', '#d946ef', '#f43f5e', '#f97316', '#eab308', '#22c55e', '#14b8a6'];

export default function DemographicTab({ stats, villageInfo }: { stats: any[], villageInfo: any }) {
  // Parse stats for charts
  const genderData = stats.filter((s: any) => s.kategori === 'Jenis Kelamin').map((s: any) => ({ name: s.sub_kategori, value: Number(s.jumlah) }));
  const religionData = stats.filter((s: any) => s.kategori === 'Agama').map((s: any) => ({ name: s.sub_kategori, value: Number(s.jumlah) }));
  const jobData = stats.filter((s: any) => s.kategori === 'Pekerjaan').map((s: any) => ({ name: s.sub_kategori, value: Number(s.jumlah) }));
  const rtData = stats.filter((s: any) => s.kategori === 'Sebaran RT').map((s: any) => ({ name: s.sub_kategori, value: Number(s.jumlah) }));
  
  const totalWarga = genderData.reduce((acc, curr) => acc + curr.value, 0);
  const totalRT = rtData.length;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Warga</p>
            <p className="text-3xl font-bold text-slate-900">{totalWarga} <span className="text-sm font-normal text-slate-500">Jiwa</span></p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
            <Home size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total RT</p>
            <p className="text-3xl font-bold text-slate-900">{totalRT} <span className="text-sm font-normal text-slate-500">RT</span></p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Status Pendataan</p>
            <p className="text-3xl font-bold text-slate-900">Aktif</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
        <h3 className="text-xl font-bold text-slate-800 mb-4">Visi & Misi</h3>
        <p className="text-slate-600 leading-relaxed whitespace-pre-line">{villageInfo.visi_misi}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ChartCard title="Komposisi Jenis Kelamin">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={genderData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                {genderData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(value) => [`${value} Jiwa`, 'Jumlah']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Distribusi Agama">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={religionData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                {religionData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[(index+2) % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(value) => [`${value} Jiwa`, 'Jumlah']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Sebaran Warga per RT" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={rtData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip cursor={{fill: '#f1f5f9'}} formatter={(value) => [`${value} Jiwa`, 'Jumlah']} />
              <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]}>
                {rtData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}

function ChartCard({ title, children, className = "" }: { title: string, children: React.ReactNode, className?: string }) {
  return (
    <div className={`bg-white rounded-2xl p-6 shadow-sm border border-slate-100 ${className}`}>
      <h4 className="text-lg font-semibold text-slate-800 mb-6">{title}</h4>
      <div className="w-full flex justify-center">
        {children}
      </div>
    </div>
  );
}
