import Image from "next/image";

export default function Hero({ villageInfo }: { villageInfo: any }) {
  return (
    <div className="relative w-full h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero.jpg"
          alt="Desa Bacinan"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
      </div>
      
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center">
        <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-sm font-medium tracking-wide">
          Portal Informasi & Data
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight drop-shadow-lg">
          {villageInfo.nama_dusun}
        </h1>
        <p className="text-lg md:text-xl text-slate-200 max-w-2xl font-light leading-relaxed">
          {villageInfo.deskripsi_singkat}
        </p>
      </div>
    </div>
  );
}
