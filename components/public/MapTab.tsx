import Image from "next/image";
import { MapPin, ExternalLink } from "lucide-react";

export default function MapTab({ coordinates }: { coordinates: string }) {
  // If coordinates are in "-7.7956,110.3695" format
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${coordinates}`;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-7xl mx-auto px-4 w-full">
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
        
        <div className="relative w-full aspect-video md:aspect-[21/9] rounded-[1.5rem] overflow-hidden border-2 border-slate-100 bg-slate-50 shadow-inner">
          <Image
            src="/images/map.jpg"
            alt="Peta Wilayah Dusun"
            fill
            className="object-cover"
          />
          {/* Overlay to give it a premium map look if desired */}
          <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-[1.5rem]" />
        </div>
      </div>
    </div>
  );
}
