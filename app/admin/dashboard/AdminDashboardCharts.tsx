"use client";

import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Users, BookOpen, Briefcase, Heart, Activity, Home } from "lucide-react";

const COLORS = ['#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6', '#d946ef', '#f43f5e', '#f97316', '#eab308', '#22c55e', '#14b8a6'];

interface ChartData {
  name: string;
  value: number;
}

interface AdminDashboardChartsProps {
  genderData: ChartData[];
  religionData: ChartData[];
  jobData: ChartData[];
  rtData: ChartData[];
  ageData: ChartData[];
  educationData: ChartData[];
  maritalData: ChartData[];
}

export default function AdminDashboardCharts({
  genderData,
  religionData,
  jobData,
  rtData,
  ageData,
  educationData,
  maritalData
}: AdminDashboardChartsProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-slate-800">Statistik Demografi</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        <ChartCard title="Sebaran RT" icon={<Home size={18} />} data={rtData} offset={0} mounted={mounted} />
        <ChartCard title="Jenis Kelamin" icon={<Users size={18} />} data={genderData} offset={2} mounted={mounted} />
        <ChartCard title="Agama" icon={<Heart size={18} />} data={religionData} offset={4} mounted={mounted} />
        <ChartCard title="Kategori Usia" icon={<Activity size={18} />} data={ageData} offset={6} mounted={mounted} />
        <ChartCard title="Pendidikan" icon={<BookOpen size={18} />} data={educationData} offset={8} mounted={mounted} />
        <ChartCard title="Status Perkawinan" icon={<Users size={18} />} data={maritalData} offset={1} mounted={mounted} />
        <ChartCard title="Jenis Pekerjaan" icon={<Briefcase size={18} />} data={jobData} offset={3} fullWidth mounted={mounted} />

      </div>
    </div>
  );
}

function ChartCard({ title, icon, data, offset = 0, fullWidth = false, mounted = false }: { title: string, icon: React.ReactNode, data: ChartData[], offset?: number, fullWidth?: boolean, mounted?: boolean }) {
  // Filter out zero values if needed, or keep them to show empty stats
  const validData = data.filter(d => d.value > 0);

  return (
    <div className={`bg-white rounded-xl p-5 shadow-sm border border-slate-100 flex flex-col ${fullWidth ? 'col-span-1 md:col-span-2 lg:col-span-3' : 'h-[380px]'}`}>
      <div className="flex items-center gap-2 mb-4 text-slate-700">
        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
          {icon}
        </div>
        <h4 className="font-bold text-sm">{title}</h4>
      </div>
      
      <div className={fullWidth ? 'flex flex-col lg:flex-row items-center gap-8' : 'flex-1 min-h-0 relative flex flex-col justify-center'}>
        <div className={fullWidth ? 'w-full lg:w-1/3 h-[250px]' : 'w-full h-[200px]'}>
          {validData.length > 0 ? (
            mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={validData} 
                    cx="50%" 
                    cy="50%" 
                    innerRadius={fullWidth ? 60 : 50} 
                    outerRadius={fullWidth ? 90 : 80} 
                    paddingAngle={2} 
                    dataKey="value"
                  >
                    {validData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[(index + offset) % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [`${value} Jiwa`, name]} />
                </PieChart>
              </ResponsiveContainer>
            )
          ) : (
            <div className="h-full flex items-center justify-center text-sm text-slate-400">
              Belum ada data
            </div>
          )}
        </div>

        <div className={fullWidth ? 'w-full lg:w-2/3' : 'mt-4'}>
          <CustomLegend data={validData} colors={COLORS} offset={offset} showAll={fullWidth} />
        </div>
      </div>
    </div>
  );
}

function CustomLegend({ data, colors, offset = 0, showAll = false }: { data: ChartData[], colors: string[], offset?: number, showAll?: boolean }) {
  // Show top 4, others grouped if there are many, but for admin let's show up to 6
  const limit = showAll ? data.length : 6;
  const displayData = data.slice(0, limit);
  
  return (
    <div className={`grid gap-x-2 gap-y-3 px-2 ${showAll ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-2'}`}>
      {displayData.map((entry, index) => (
        <div key={index} className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: colors[(index + offset) % colors.length] }} />
          <span className="text-xs font-medium text-slate-600 truncate" title={entry.name}>
            {entry.name} <span className="text-slate-400 ml-1">({entry.value})</span>
          </span>
        </div>
      ))}
      {!showAll && data.length > 6 && (
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-300 shrink-0" />
          <span className="text-xs font-medium text-slate-600 truncate">Lainnya...</span>
        </div>
      )}
    </div>
  );
}
