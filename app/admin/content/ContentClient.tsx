"use client";

import { useState } from "react";
import { Building2, Users, Phone, Loader2, Save, Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { updateVillageInfo, updateOfficials, updateContacts } from "./actions";

const FIXED_ROLES = [
  { urutan: 1, jabatan: 'Kepala Wilayah' },
  { urutan: 2, jabatan: 'RW' },
  { urutan: 3, jabatan: 'RT 01' },
  { urutan: 4, jabatan: 'RT 02' },
  { urutan: 5, jabatan: 'Ketua Pemuda' },
  { urutan: 6, jabatan: 'Ketua PKK' }
];

export default function ContentClient({ initialVillageInfo, initialOfficials = [], initialContacts = [] }: { initialVillageInfo: any, initialOfficials?: any[], initialContacts?: any[] }) {
  const [activeTab, setActiveTab] = useState('profil');
  const [villageInfo, setVillageInfo] = useState(initialVillageInfo);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  
  const [officials, setOfficials] = useState(() => {
    return FIXED_ROLES.map(role => {
      const existing = initialOfficials?.find((o: any) => o.urutan === role.urutan || o.jabatan === role.jabatan);
      return {
        id: existing?.id || '',
        jabatan: role.jabatan,
        nama: existing?.nama || '',
        urutan: role.urutan
      };
    });
  });

  const [contacts, setContacts] = useState<any[]>(() => {
    const sorted = [...initialContacts].sort((a, b) => (a.urutan || 0) - (b.urutan || 0));
    return sorted.map((c, i) => ({ ...c, urutan: c.urutan ?? i + 1 }));
  });

  const tabs = [
    { id: 'profil', label: 'Profil Dusun', icon: Building2 },
    { id: 'perangkat', label: 'Perangkat Desa', icon: Users },
    { id: 'kontak', label: 'Kontak Penting', icon: Phone },
  ];

  const handleSaveProfil = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ text: "", type: "" });

    try {
      const result = await updateVillageInfo({
        nama_dusun: villageInfo.nama_dusun,
        deskripsi_singkat: villageInfo.deskripsi_singkat,
        visi_misi: villageInfo.visi_misi,
      });

      if (result.success) {
        setMessage({ text: result.message, type: "success" });
      } else {
        setMessage({ text: result.message, type: "error" });
      }
    } catch (error: any) {
      setMessage({ text: error.message || "Gagal menyimpan perubahan.", type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveOfficials = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ text: "", type: "" });

    try {
      const result = await updateOfficials(officials);

      if (result.success) {
        setMessage({ text: result.message, type: "success" });
      } else {
        setMessage({ text: result.message, type: "error" });
      }
    } catch (error: any) {
      setMessage({ text: error.message || "Gagal menyimpan perubahan.", type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  const updateOfficialName = (urutan: number, newName: string) => {
    setOfficials(prev => prev.map(o => o.urutan === urutan ? { ...o, nama: newName } : o));
  };

  const handleSaveContacts = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ text: "", type: "" });

    // Update urutan sequentially before saving
    const orderedContacts = contacts.map((c, i) => ({ ...c, urutan: i + 1 }));

    try {
      const result = await updateContacts(orderedContacts);
      if (result.success) {
        setMessage({ text: result.message, type: "success" });
        setContacts(orderedContacts);
      } else {
        setMessage({ text: result.message, type: "error" });
      }
    } catch (error: any) {
      setMessage({ text: error.message || "Gagal menyimpan perubahan.", type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  const addContact = () => {
    setContacts([...contacts, { id: `new-${Date.now()}`, kategori: 'Nomor', label: '', value: '', urutan: contacts.length + 1 }]);
  };

  const removeContact = (id: string) => {
    setContacts(contacts.filter(c => c.id !== id));
  };

  const updateContact = (id: string, field: string, value: string) => {
    setContacts(contacts.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const moveContact = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index > 0) {
      const newContacts = [...contacts];
      [newContacts[index - 1], newContacts[index]] = [newContacts[index], newContacts[index - 1]];
      setContacts(newContacts);
    } else if (direction === 'down' && index < contacts.length - 1) {
      const newContacts = [...contacts];
      [newContacts[index + 1], newContacts[index]] = [newContacts[index], newContacts[index + 1]];
      setContacts(newContacts);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Tabs Header */}
      <div className="flex border-b border-slate-200 bg-slate-50 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setMessage({ text: "", type: "" }); // clear message on tab switch
              }}
              className={`flex items-center gap-2 px-6 py-4 font-medium text-sm transition-colors whitespace-nowrap ${
                isActive 
                  ? "text-blue-600 border-b-2 border-blue-600 bg-white" 
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
              }`}
            >
              <Icon size={18} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tabs Content */}
      <div className="p-6 md:p-8">
        {activeTab === 'profil' && (
          <form onSubmit={handleSaveProfil} className="space-y-6 max-w-3xl">
            <div>
              <h2 className="text-xl font-semibold text-slate-800 mb-6">Informasi Dasar Dusun</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Nama Dusun
                </label>
                <input
                  type="text"
                  required
                  value={villageInfo?.nama_dusun || ""}
                  onChange={(e) => setVillageInfo({...villageInfo, nama_dusun: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Deskripsi Singkat
                </label>
                <textarea
                  required
                  rows={3}
                  value={villageInfo?.deskripsi_singkat || ""}
                  onChange={(e) => setVillageInfo({...villageInfo, deskripsi_singkat: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Visi & Misi
                </label>
                <textarea
                  required
                  rows={4}
                  value={villageInfo?.visi_misi || ""}
                  onChange={(e) => setVillageInfo({...villageInfo, visi_misi: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            {message.text && (
              <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {message.text}
              </div>
            )}

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                Simpan Perubahan
              </button>
            </div>
          </form>
        )}

        {activeTab === 'perangkat' && (
          <form onSubmit={handleSaveOfficials} className="space-y-6 max-w-3xl">
            <div>
              <h2 className="text-xl font-semibold text-slate-800 mb-2">Manajemen Perangkat Desa</h2>
              <p className="text-slate-500 text-sm mb-6">
                Masukkan nama perangkat desa untuk setiap jabatan yang tersedia. Biarkan kosong jika belum ada yang menjabat.
              </p>
            </div>
            
            <div className="space-y-4">
              {officials.map((official) => (
                <div key={official.urutan} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-4 border border-slate-200 rounded-xl bg-slate-50">
                  <div className="w-full sm:w-1/3">
                    <span className="font-semibold text-slate-700">{official.jabatan}</span>
                  </div>
                  <div className="w-full sm:w-2/3">
                    <input
                      type="text"
                      placeholder={`Nama ${official.jabatan}...`}
                      value={official.nama}
                      onChange={(e) => updateOfficialName(official.urutan, e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                    />
                  </div>
                </div>
              ))}
            </div>

            {message.text && (
              <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {message.text}
              </div>
            )}

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                Simpan Perangkat
              </button>
            </div>
          </form>
        )}

        {activeTab === 'kontak' && (
          <form onSubmit={handleSaveContacts} className="space-y-6 max-w-3xl">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-semibold text-slate-800 mb-2">Manajemen Kontak Penting</h2>
                <p className="text-slate-500 text-sm">
                  Kelola daftar kontak darurat atau sosial media dusun. Pastikan tabel `contacts` di Supabase memiliki kolom `urutan` (int4) agar fitur urutan berfungsi.
                </p>
              </div>
              <button
                type="button"
                onClick={addContact}
                className="flex items-center gap-2 text-blue-600 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg font-medium transition-colors shrink-0"
              >
                <Plus size={18} /> Tambah Kontak
              </button>
            </div>
            
            <div className="space-y-4">
              {contacts.length === 0 ? (
                <div className="text-center py-8 text-slate-500 bg-slate-50 rounded-xl border border-slate-200">
                  Belum ada kontak. Klik Tambah Kontak untuk memulai.
                </div>
              ) : (
                contacts.map((contact, index) => (
                  <div key={contact.id} className="flex flex-col sm:flex-row gap-4 p-4 border border-slate-200 rounded-xl bg-slate-50 relative group">
                    <div className="flex sm:flex-col justify-center gap-1 shrink-0 mr-2 opacity-100 sm:opacity-50 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => moveContact(index, 'up')}
                        disabled={index === 0}
                        className="p-1 hover:bg-slate-200 rounded text-slate-600 disabled:opacity-30 disabled:hover:bg-transparent"
                      >
                        <ChevronUp size={20} />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveContact(index, 'down')}
                        disabled={index === contacts.length - 1}
                        className="p-1 hover:bg-slate-200 rounded text-slate-600 disabled:opacity-30 disabled:hover:bg-transparent"
                      >
                        <ChevronDown size={20} />
                      </button>
                    </div>
                    
                    <div className="w-full sm:w-1/3">
                      <label className="block text-xs font-medium text-slate-500 mb-1">Jenis Kontak</label>
                      <select
                        value={contact.kategori}
                        onChange={(e) => updateContact(contact.id, 'kategori', e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                      >
                        <option value="Nomor">Nomor HP/Telepon</option>
                        <option value="Instagram">Instagram</option>
                        <option value="TikTok">TikTok</option>
                        <option value="YouTube">YouTube</option>
                      </select>
                    </div>
                    <div className="w-full sm:w-1/3">
                      <label className="block text-xs font-medium text-slate-500 mb-1">Label (Misal: Ambulans Desa)</label>
                      <input
                        type="text"
                        required
                        value={contact.label}
                        onChange={(e) => updateContact(contact.id, 'label', e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                      />
                    </div>
                    <div className="w-full sm:w-1/3">
                      <label className="block text-xs font-medium text-slate-500 mb-1">Nilai (Nomor / Username)</label>
                      <input
                        type="text"
                        required
                        value={contact.value}
                        onChange={(e) => updateContact(contact.id, 'value', e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                      />
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => removeContact(contact.id)}
                      className="absolute -right-2 -top-2 bg-red-100 text-red-600 p-1.5 rounded-full shadow-sm hover:bg-red-500 hover:text-white transition-colors opacity-100 sm:opacity-0 group-hover:opacity-100 focus:opacity-100"
                      title="Hapus kontak"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {message.text && (
              <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {message.text}
              </div>
            )}

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                Simpan Kontak
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
