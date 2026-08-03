import { Phone, UsersRound, AtSign, PlaySquare, Globe, MonitorPlay } from "lucide-react";
import Image from "next/image";

export default function OfficialsTab({ officials, contacts }: { officials: any[], contacts: any[] }) {
  const getContactIcon = (kategori: string) => {
    switch (kategori?.toLowerCase()) {
      case 'instagram':
        return <AtSign size={24} />;
      case 'tiktok':
        return <PlaySquare size={24} />;
      case 'youtube':
        return <MonitorPlay size={24} />;
      case 'nomor':
      default:
        return <Phone size={24} />;
    }
  };

  const getContactHref = (value: string) => {
    if (!value) return "#";
    const clean = value.trim();
    if (clean.startsWith('http://') || clean.startsWith('https://')) return clean;
    // Jika hanya berisi angka dan karakter nomor telepon, jadikan tel:
    if (/^[\d\s\+\-\(\)]+$/.test(clean)) return `tel:${clean.replace(/[\s\-\(\)]/g, '')}`;
    // Jika mengandung titik (seperti wa.me atau tiktok.com), tambahkan https
    if (clean.includes('.') && !clean.includes(' ')) return `https://${clean}`;
    // Fallback
    return `https://www.google.com/search?q=${encodeURIComponent(clean)}`;
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-12">
      
      {/* Officials Section */}
      <section>
        <div className="text-center mb-10">
          <h3 className="text-3xl font-bold text-slate-900 mb-3 flex items-center justify-center gap-3">
            <UsersRound className="text-blue-500" size={32} /> Struktur Organisasi
          </h3>
          <p className="text-slate-500 max-w-2xl mx-auto">Susunan kepengurusan dan perangkat dusun yang melayani masyarakat.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {officials.length > 0 ? (
            officials.map((official) => (
              <div key={official.id} className="bg-white rounded-[2rem] p-6 shadow-lg shadow-slate-200/50 border border-slate-100 flex flex-col items-center text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mb-4 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                  <UsersRound size={32} />
                </div>
                <h4 className="text-xl font-bold text-slate-800">{official.nama || "Belum ada"}</h4>
                <p className="text-blue-600 font-medium mt-2 bg-blue-50 px-4 py-1.5 rounded-full text-sm">{official.jabatan}</p>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-slate-500">
              <p>Belum ada data perangkat desa.</p>
            </div>
          )}
        </div>
      </section>

      {/* Contacts Section */}
      <section className="bg-white rounded-[2rem] p-8 md:p-12 shadow-xl border border-slate-100">
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-slate-900 mb-2 flex items-center gap-3">
            <Phone className="text-emerald-500" size={28} /> Kontak Penting
          </h3>
          <p className="text-slate-500">Nomor telepon darurat, media sosial, dan layanan masyarakat yang dapat dihubungi.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contacts.length > 0 ? (
            contacts.map((contact) => (
              <a 
                key={contact.id} 
                href={getContactHref(contact.value)} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-5 p-6 rounded-[1.5rem] bg-slate-50 border border-slate-100 hover:border-emerald-200 hover:shadow-md transition-all group"
              >
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                  {getContactIcon(contact.kategori)}
                </div>
                <div className="overflow-hidden flex-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-1">{contact.kategori}</p>
                  <p className="text-lg font-bold text-slate-900 truncate group-hover:text-emerald-700 transition-colors">{contact.label}</p>
                </div>
              </a>
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-slate-500">
              Belum ada data kontak penting.
            </div>
          )}
        </div>
      </section>
      
    </div>
  );
}
