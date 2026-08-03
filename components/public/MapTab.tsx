"use client";

import { useState } from "react";
import Image from "next/image";
import { MapPin, ExternalLink, Building2, Navigation } from "lucide-react";
import { generateMapsUrl } from "@/lib/utils";

export default function MapTab({ coordinates, locations = [] }: { coordinates: string, locations?: any[] }) {
  const [showMap, setShowMap] = useState(false);
  
  // If coordinates is already a URL, use it directly
  const googleMapsUrl = coordinates?.startsWith('http') 
    ? coordinates 
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(coordinates)}`;

  const fasilitas = locations.filter(loc => loc.kategori === 'Fasilitas Umum' || loc.kategori === 'Posyandu');
  const perangkat = locations.filter(loc => loc.kategori === 'Perangkat Desa');

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-[1440px] mx-auto px-4 w-full space-y-8">
      <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-xl border border-slate-100 flex flex-col items-center">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 w-full mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0">
              <MapPin size={32} />
            </div>
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-slate-800">Peta Wilayah Dusun</h3>
              <p className="text-slate-500 mt-1">Citra satelit dan batas wilayah dusun secara geografis.</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button 
              onClick={() => setShowMap(!showMap)}
              className="inline-flex items-center justify-center gap-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-6 py-4 rounded-2xl font-semibold transition-colors shadow-sm"
            >
              <MapPin size={20} />
              {showMap ? "Sembunyikan Peta" : "Tampilkan Peta"}
            </button>
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-semibold transition-colors shadow-lg shadow-blue-200/50"
            >
              Buka di Google Maps
              <ExternalLink size={20} />
            </a>
          </div>
        </div>
        
        {showMap && (
          <div className="relative w-full rounded-[1.5rem] overflow-hidden border-2 border-slate-100 bg-slate-50 shadow-inner animate-in slide-in-from-top-8 fade-in duration-500">
            <Image
              src="/images/peta_admin.webp"
              alt="Peta Wilayah Dusun"
              width={0}
              height={0}
              sizes="100vw"
              className="w-full h-auto rounded-[1.5rem]"
            />
            {/* Overlay to give it a premium map look if desired */}
            <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-[1.5rem] pointer-events-none" />
          </div>
        )}
      </div>

      {locations.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Fasilitas Umum */}
          {fasilitas.length > 0 && (
            <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-slate-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center">
                  <Building2 size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Fasilitas Umum</h3>
              </div>
              <div className="space-y-4">
                {fasilitas.map((loc) => (
                  <div key={loc.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                    <span className="font-semibold text-slate-700">{loc.nama_lokasi}</span>
                    <a
                      href={generateMapsUrl(loc)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition-colors"
                    >
                      Maps <ExternalLink size={16} />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Perangkat Desa */}
          {perangkat.length > 0 && (
            <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-slate-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                  <Navigation size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Perangkat Desa</h3>
              </div>
              <div className="space-y-4">
                {perangkat.map((loc) => (
                  <div key={loc.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                    <span className="font-semibold text-slate-700">{loc.nama_lokasi}</span>
                    <a
                      href={generateMapsUrl(loc)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition-colors"
                    >
                      Titik Peta <ExternalLink size={16} />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
