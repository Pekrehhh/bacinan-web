"use client";

import { useState, useEffect } from "react";
import { Building2, Users, Phone, Loader2, Save, Plus, Trash2, ChevronUp, ChevronDown, Map, UploadCloud, X, AlertCircle } from "lucide-react";
import { updateVillageInfo, updateOfficials, updateContacts, updateMapImage, updateLocations } from "./actions";

const FIXED_ROLES = [
  { urutan: 1, jabatan: 'Kepala Wilayah' },
  { urutan: 2, jabatan: 'RW' },
  { urutan: 3, jabatan: 'RT 01' },
  { urutan: 4, jabatan: 'RT 02' },
  { urutan: 5, jabatan: 'Ketua Pemuda' },
  { urutan: 6, jabatan: 'Ketua PKK' }
];

export default function ContentClient({ initialVillageInfo, initialOfficials = [], initialContacts = [], initialLocations = [] }: { initialVillageInfo: any, initialOfficials?: any[], initialContacts?: any[], initialLocations?: any[] }) {
  const [activeTab, setActiveTab] = useState('profil');
  const [villageInfo, setVillageInfo] = useState(initialVillageInfo);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [mapTimestamp, setMapTimestamp] = useState(Date.now());
  
  // Modal states
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isDraggingMap, setIsDraggingMap] = useState(false);
  const [isUploadingMap, setIsUploadingMap] = useState(false);
  
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

  const [locations, setLocations] = useState<any[]>(() => {
    const sorted = [...initialLocations].sort((a, b) => (a.urutan || 0) - (b.urutan || 0));
    return sorted.map((loc, i) => ({ ...loc, urutan: loc.urutan ?? i + 1 }));
  });

  const tabs = [
    { id: 'profil', label: 'Profil Dusun', icon: Building2 },
    { id: 'perangkat', label: 'Perangkat Desa', icon: Users },
    { id: 'kontak', label: 'Kontak Penting', icon: Phone },
    { id: 'peta', label: 'Peta Wilayah', icon: Map },
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
        gmaps_coordinates: villageInfo.gmaps_coordinates,
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

  const handleSaveLocations = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ text: "", type: "" });

    // Update urutan sequentially before saving
    const orderedLocations = locations.map((loc, i) => ({ ...loc, urutan: i + 1 }));

    try {
      const result = await updateLocations(orderedLocations);
      if (result.success) {
        setMessage({ text: result.message, type: "success" });
        setLocations(orderedLocations);
      } else {
        setMessage({ text: result.message, type: "error" });
      }
    } catch (error: any) {
      setMessage({ text: error.message || "Gagal menyimpan perubahan.", type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  const addLocation = () => {
    setLocations([...locations, { id: `new-${Date.now()}`, kategori: 'Fasilitas Umum', nama_lokasi: '', coordinate_string: '', maps_url: '', urutan: locations.length + 1 }]);
  };

  const removeLocation = (id: string) => {
    setLocations(locations.filter(loc => loc.id !== id));
  };

  const updateLocation = (id: string, field: string, value: string) => {
    setLocations(locations.map(loc => loc.id === id ? { ...loc, [field]: value } : loc));
  };

  const moveLocation = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index > 0) {
      const newLocations = [...locations];
      [newLocations[index - 1], newLocations[index]] = [newLocations[index], newLocations[index - 1]];
      setLocations(newLocations);
    } else if (direction === 'down' && index < locations.length - 1) {
      const newLocations = [...locations];
      [newLocations[index + 1], newLocations[index]] = [newLocations[index], newLocations[index + 1]];
      setLocations(newLocations);
    }
  };

  const handleMapUpload = async (file: File) => {
    setIsUploadingMap(true);
    setMessage({ text: "", type: "" });

    try {
      const formData = new FormData();
      formData.append("map_file", file);

      const result = await updateMapImage(formData);
      
      if (result.success) {
        setMessage({ text: result.message, type: "success" });
        setIsMapOpen(false);
        setMapTimestamp(Date.now());
      } else {
        setMessage({ text: result.message, type: "error" });
      }
    } catch (error: any) {
      setMessage({ text: error.message || "Gagal mengunggah peta.", type: "error" });
    } finally {
      setIsUploadingMap(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative">
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

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Link Google Maps Dusun
                </label>
                <input
                  type="text"
                  required
                  value={villageInfo?.gmaps_coordinates || ""}
                  onChange={(e) => setVillageInfo({...villageInfo, gmaps_coordinates: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="https://maps.app.goo.gl/..."
                />
                <p className="text-xs text-slate-500 mt-1">Link ini digunakan untuk tombol 'Buka di Google Maps' di halaman Peta Wilayah.</p>
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
                      <label className="block text-xs font-medium text-slate-500 mb-1">Link / Tautan (URL)</label>
                      <input
                        type="text"
                        required
                        placeholder="Misal: https://wa.me/628..."
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

        {activeTab === 'peta' && (
          <div>
            <div className="space-y-6 max-w-3xl">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
              <div>
                <h2 className="text-xl font-semibold text-slate-800 mb-2">Manajemen Peta Wilayah</h2>
                <p className="text-slate-500 text-sm">
                  Perbarui gambar peta wilayah dusun yang ditampilkan di halaman utama warga.
                </p>
              </div>
              <button
                type="button"
                onClick={() => { setIsMapOpen(true); setMessage({ text: "", type: "" }); }}
                className="flex items-center justify-center gap-2 text-blue-600 bg-blue-50 hover:bg-blue-100 px-4 py-2.5 rounded-lg font-medium transition-colors shrink-0 w-full sm:w-auto"
              >
                <Map size={18} /> Update Peta
              </button>
            </div>
            <div className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50 shadow-inner flex items-center justify-center relative min-h-[300px] p-2">
               <img 
                 src={`/images/peta_admin.webp?t=${mapTimestamp}`} 
                 alt="Peta Saat Ini" 
                 className="w-full h-auto max-h-[600px] object-contain rounded-xl"
                 onError={(e) => {
                   (e.target as HTMLImageElement).src = "https://placehold.co/800x600/e2e8f0/64748b?text=Peta+Belum+Tersedia";
                 }}
               />
            </div>
          </div>
          
          <div className="mt-12 pt-12 border-t border-slate-200 max-w-4xl">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
              <div>
                <h2 className="text-xl font-semibold text-slate-800">Daftar Titik Peta (Lokasi)</h2>
                <p className="text-slate-500 text-sm mt-1">
                  Atur daftar titik lokasi Fasilitas Umum dan Perangkat Desa yang muncul di bawah gambar peta.
                </p>
              </div>
              <button
                type="button"
                onClick={addLocation}
                className="flex items-center justify-center gap-2 text-blue-600 bg-blue-50 hover:bg-blue-100 px-4 py-2.5 rounded-lg font-medium transition-colors shrink-0"
              >
                <Plus size={18} /> Tambah Lokasi
              </button>
            </div>

            <form onSubmit={handleSaveLocations}>
              <div className="space-y-4 mb-6">
                {locations.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                    <Map className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                    <h3 className="text-sm font-medium text-slate-900">Belum ada lokasi</h3>
                    <p className="text-sm text-slate-500 mt-1">Klik tombol Tambah Lokasi untuk mulai menambahkan titik peta.</p>
                  </div>
                ) : (
                  locations.map((loc, index) => (
                    <div key={loc.id} className="relative group bg-slate-50 rounded-xl p-4 sm:p-5 border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all">
                      <div className="absolute left-2 top-1/2 -translate-y-1/2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          type="button" 
                          onClick={() => moveLocation(index, 'up')}
                          disabled={index === 0}
                          className="text-slate-400 hover:text-blue-600 disabled:opacity-30 disabled:hover:text-slate-400"
                        >
                          <ChevronUp size={20} />
                        </button>
                        <button 
                          type="button" 
                          onClick={() => moveLocation(index, 'down')}
                          disabled={index === locations.length - 1}
                          className="text-slate-400 hover:text-blue-600 disabled:opacity-30 disabled:hover:text-slate-400"
                        >
                          <ChevronDown size={20} />
                        </button>
                      </div>

                      <div className="pl-6 flex flex-col md:flex-row gap-4">
                        <div className="w-full md:w-1/4">
                          <label className="block text-xs font-medium text-slate-500 mb-1">Kategori</label>
                          <select
                            value={loc.kategori}
                            onChange={(e) => updateLocation(loc.id, 'kategori', e.target.value)}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                          >
                            <option value="Fasilitas Umum">Fasilitas Umum</option>
                            <option value="Perangkat Desa">Perangkat Desa</option>
                          </select>
                        </div>
                        <div className="w-full md:w-1/4">
                          <label className="block text-xs font-medium text-slate-500 mb-1">Nama Lokasi</label>
                          <input
                            type="text"
                            required
                            placeholder="Misal: Masjid Jami"
                            value={loc.nama_lokasi}
                            onChange={(e) => updateLocation(loc.id, 'nama_lokasi', e.target.value)}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                          />
                        </div>
                        <div className="w-full md:w-2/4">
                          <label className="block text-xs font-medium text-slate-500 mb-1">Koordinat (Opsional)</label>
                          <input
                            type="text"
                            placeholder="Misal: -7.567, 110.456 atau url maps"
                            value={loc.coordinate_string || ""}
                            onChange={(e) => updateLocation(loc.id, 'coordinate_string', e.target.value)}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                          />
                        </div>
                        
                        <button
                          type="button"
                          onClick={() => removeLocation(loc.id)}
                          className="absolute -right-2 -top-2 bg-red-100 text-red-600 p-1.5 rounded-full shadow-sm hover:bg-red-500 hover:text-white transition-colors opacity-100 sm:opacity-0 group-hover:opacity-100 focus:opacity-100"
                          title="Hapus lokasi"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {message.text && (
                <div className={`p-4 rounded-lg mb-4 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                  {message.text}
                </div>
              )}

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                  Simpan Titik Peta
                </button>
              </div>
            </form>
          </div>
        </div>
        )}
      </div>

      {/* MODAL: Update Peta */}
      {isMapOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800">Update Peta Wilayah</h3>
              <button onClick={() => setIsMapOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            {message.type === 'error' && (
              <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2 text-sm font-medium">
                <AlertCircle size={18} /> {message.text}
              </div>
            )}
            
            <div className="p-6">
              <div className="bg-blue-50 text-blue-800 p-4 rounded-xl text-sm mb-6 border border-blue-100">
                <p className="font-semibold mb-2 flex items-center gap-1.5">⚡ Informasi Pembaruan Peta:</p>
                <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
                  <li>Format file yang didukung: <b>.jpg, .png, .webp</b></li>
                  <li>Sistem akan secara otomatis menimpa peta lama yang ada di halaman utama (publik).</li>
                  <li>Pastikan resolusi gambar cukup besar agar tulisan/titik di peta dapat terbaca dengan jelas.</li>
                </ul>
              </div>

              <label 
                className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all group ${
                  isDraggingMap ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:bg-slate-50 hover:border-blue-400'
                }`}
                onDragOver={(e) => { e.preventDefault(); setIsDraggingMap(true); }}
                onDragLeave={() => setIsDraggingMap(false)}
                onDrop={(e) => { 
                  e.preventDefault(); 
                  setIsDraggingMap(false); 
                  if(e.dataTransfer.files?.[0]) handleMapUpload(e.dataTransfer.files[0]); 
                }}
              >
                <UploadCloud size={40} className={`${isDraggingMap ? 'text-blue-500 scale-110' : 'text-slate-400 group-hover:text-blue-500 group-hover:scale-110'} mb-3 transition-all duration-300`} />
                <p className="text-sm font-semibold text-slate-700 text-center">Pilih gambar peta (.jpg, .png, .webp)</p>
                <p className="text-xs text-slate-500 mt-1">atau tarik dan lepas (drag & drop) file ke sini</p>
                <input 
                  type="file" 
                  accept=".jpg, .jpeg, .png, .webp" 
                  className="hidden" 
                  onChange={(e) => { if(e.target.files?.[0]) handleMapUpload(e.target.files[0]); }}
                  disabled={isUploadingMap}
                />
              </label>

              {isUploadingMap && (
                <div className="mt-6 text-center text-sm font-medium text-blue-600 flex items-center justify-center gap-2 bg-blue-50 py-3 rounded-lg animate-pulse">
                  <Loader2 size={16} className="animate-spin" /> Sedang mengunggah dan memproses peta...
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

