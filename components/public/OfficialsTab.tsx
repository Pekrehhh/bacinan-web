import { Phone, UsersRound, Mail, Map } from "lucide-react";
import Image from "next/image";

export default function OfficialsTab({ officials, contacts }: { officials: any[], contacts: any[] }) {
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

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {officials.map((official) => (
            <div key={official.id} className="bg-white rounded-[2rem] p-8 shadow-lg shadow-slate-200/50 border border-slate-100 flex flex-col items-center text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="relative w-28 h-28 rounded-full overflow-hidden mb-6 border-4 border-slate-50 bg-slate-100 ring-1 ring-slate-200 shadow-inner">
                {official.foto_url ? (
                  <Image src={official.foto_url} alt={official.nama} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 group-hover:text-blue-500 transition-colors">
                    <UsersRound size={48} />
                  </div>
                )}
              </div>
              <h4 className="text-xl font-bold text-slate-800">{official.nama}</h4>
              <p className="text-blue-600 font-medium mt-2 bg-blue-50 px-4 py-1.5 rounded-full text-sm">{official.jabatan}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contacts Section */}
      <section className="bg-white rounded-[2rem] p-8 md:p-12 shadow-xl border border-slate-100">
        <h3 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3 border-b pb-6">
          <Phone className="text-emerald-500" size={28} /> Kontak Darurat & Pelayanan
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contacts.map((contact) => (
            <div key={contact.id} className="flex items-start gap-5 p-6 rounded-[1.5rem] bg-slate-50 border border-slate-100 hover:border-emerald-200 hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                <Phone size={24} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-1">{contact.kategori}</p>
                <p className="text-sm text-slate-500 mb-2">{contact.label}</p>
                <p className="text-lg font-bold text-slate-900">{contact.value}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      
    </div>
  );
}
