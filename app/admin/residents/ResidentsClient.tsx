"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Edit2, Trash2, Upload, Plus, X, UploadCloud, AlertCircle, Users } from "lucide-react";
import * as XLSX from "xlsx";
import { useRouter } from "next/navigation";

export default function ResidentsClient({ initialResidents }: { initialResidents: any[] }) {
  const router = useRouter();
  const supabase = createClient();
  const [residents, setResidents] = useState(initialResidents);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isBulkOpen, setIsBulkOpen] = useState(false);
  
  // Single Form state
  const [editingResident, setEditingResident] = useState<any>(null);
  const [formData, setFormData] = useState({
    nik: "",
    nama_lengkap: "",
    jenis_kelamin: "Laki-laki",
    agama: "Islam",
    rt: "",
    pekerjaan: ""
  });

  const resetMessages = () => {
    setErrorMsg("");
    setSuccessMsg("");
  };

  const openForm = (resident: any = null) => {
    resetMessages();
    if (resident) {
      setEditingResident(resident);
      setFormData({
        nik: resident.nik,
        nama_lengkap: resident.nama_lengkap,
        jenis_kelamin: resident.jenis_kelamin || "Laki-laki",
        agama: resident.agama || "Islam",
        rt: resident.rt || "",
        pekerjaan: resident.pekerjaan || ""
      });
    } else {
      setEditingResident(null);
      setFormData({ nik: "", nama_lengkap: "", jenis_kelamin: "Laki-laki", agama: "Islam", rt: "", pekerjaan: "" });
    }
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    resetMessages();

    try {
      if (editingResident) {
        // Update
        const { error } = await supabase
          .from("residents")
          .update(formData)
          .eq("id", editingResident.id);
        
        if (error) throw error;
        setSuccessMsg("Data warga berhasil diperbarui.");
      } else {
        // Insert
        const { error } = await supabase
          .from("residents")
          .insert([formData]);
        
        if (error) throw error;
        setSuccessMsg("Warga baru berhasil ditambahkan.");
      }
      
      setIsFormOpen(false);
      refreshData();
    } catch (error: any) {
      setErrorMsg(error.message || "Terjadi kesalahan saat menyimpan data.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string, nama: string) => {
    if (!window.confirm(`Yakin ingin menghapus data ${nama}?`)) return;
    
    setIsLoading(true);
    resetMessages();
    try {
      const { error } = await supabase.from("residents").delete().eq("id", id);
      if (error) throw error;
      setSuccessMsg("Data berhasil dihapus.");
      refreshData();
    } catch (error: any) {
      setErrorMsg(error.message || "Gagal menghapus data.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    resetMessages();

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      if (jsonData.length === 0) {
        throw new Error("File kosong atau format salah.");
      }

      // Validasi Header (harus ada nik, nama_lengkap, dll)
      const firstRow: any = jsonData[0];
      const requiredColumns = ["nik", "nama_lengkap", "jenis_kelamin", "agama", "rt", "pekerjaan"];
      
      for (const col of requiredColumns) {
        if (!(col in firstRow)) {
          throw new Error(`Kolom "${col}" tidak ditemukan di baris pertama Excel.`);
        }
      }

      // Proses Upsert ke Supabase
      const { error } = await supabase
        .from("residents")
        .upsert(
          jsonData.map((row: any) => ({
            nik: String(row.nik).trim(),
            nama_lengkap: row.nama_lengkap,
            jenis_kelamin: row.jenis_kelamin,
            agama: row.agama,
            rt: String(row.rt),
            pekerjaan: row.pekerjaan
          })),
          { onConflict: 'nik' }
        );

      if (error) throw error;

      setSuccessMsg(`Berhasil mengimpor ${jsonData.length} data warga.`);
      setIsBulkOpen(false);
      refreshData();

    } catch (error: any) {
      setErrorMsg(error.message || "Gagal memproses file Excel.");
    } finally {
      setIsLoading(false);
      // Reset input file
      e.target.value = '';
    }
  };

  const refreshData = async () => {
    const { data } = await supabase.from("residents").select("*").order("created_at", { ascending: false });
    if (data) setResidents(data);
    router.refresh(); // refresh server cache if any
  };

  return (
    <div>
      {/* Alert Messages */}
      {errorMsg && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
          <AlertCircle size={20} /> {errorMsg}
        </div>
      )}
      {successMsg && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center gap-2">
          <AlertCircle size={20} /> {successMsg}
        </div>
      )}

      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Manajemen Data Warga</h2>
        <div className="flex gap-2">
          <button 
            onClick={() => { resetMessages(); setIsBulkOpen(true); }}
            className="flex items-center gap-2 bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <Upload size={16} /> Import Bulk
          </button>
          <button 
            onClick={() => openForm()}
            className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <Plus size={16} /> Tambah Warga
          </button>
        </div>
      </div>

      {/* Table Data */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Nama / NIK</th>
                <th className="px-6 py-4">Agama & L/P</th>
                <th className="px-6 py-4">RT</th>
                <th className="px-6 py-4">Pekerjaan</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {residents && residents.length > 0 ? (
                residents.map((r: any) => (
                  <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900">{r.nama_lengkap}</p>
                      <p className="text-xs text-slate-500 font-mono mt-1">{r.nik}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      <p>{r.agama}</p>
                      <p className="text-xs mt-1">{r.jenis_kelamin}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      <span className="bg-slate-100 px-2 py-1 rounded-md font-medium text-xs">RT {r.rt}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {r.pekerjaan}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button onClick={() => openForm(r)} className="text-blue-600 hover:text-blue-800 transition-colors p-1" title="Edit">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(r.id, r.nama_lengkap)} className="text-red-500 hover:text-red-700 transition-colors p-1" title="Hapus">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500 flex-col flex items-center justify-center">
                    <Users size={32} className="mb-2 text-slate-300" />
                    Belum ada data warga terdaftar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Single Form (Create/Edit) */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800">
                {editingResident ? "Edit Data Warga" : "Tambah Warga Baru"}
              </h3>
              <button onClick={() => setIsFormOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">NIK</label>
                <input 
                  type="text" 
                  required 
                  value={formData.nik}
                  onChange={(e) => setFormData({...formData, nik: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-900 bg-white font-medium"
                  placeholder="Masukkan 16 digit NIK"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Nama Lengkap</label>
                <input 
                  type="text" 
                  required 
                  value={formData.nama_lengkap}
                  onChange={(e) => setFormData({...formData, nama_lengkap: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-900 bg-white font-medium"
                  placeholder="Nama sesuai KTP"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Jenis Kelamin</label>
                  <select 
                    value={formData.jenis_kelamin}
                    onChange={(e) => setFormData({...formData, jenis_kelamin: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-900 bg-white font-medium"
                  >
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Agama</label>
                  <select 
                    value={formData.agama}
                    onChange={(e) => setFormData({...formData, agama: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-900 bg-white font-medium"
                  >
                    <option value="Islam">Islam</option>
                    <option value="Kristen">Kristen</option>
                    <option value="Katolik">Katolik</option>
                    <option value="Hindu">Hindu</option>
                    <option value="Buddha">Buddha</option>
                    <option value="Konghucu">Konghucu</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">RT</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.rt}
                    onChange={(e) => setFormData({...formData, rt: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-900 bg-white font-medium"
                    placeholder="Contoh: 01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Pekerjaan</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.pekerjaan}
                    onChange={(e) => setFormData({...formData, pekerjaan: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-900 bg-white font-medium"
                    placeholder="Contoh: Petani"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsFormOpen(false)}
                  className="px-5 py-2 rounded-lg text-slate-600 font-medium hover:bg-slate-100 transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="px-5 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Bulk Import */}
      {isBulkOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800">Import Bulk Data Warga</h3>
              <button onClick={() => setIsBulkOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="bg-blue-50 text-blue-800 p-4 rounded-xl text-sm mb-6 border border-blue-100">
                <p className="font-semibold mb-2">Panduan Format File Excel/CSV:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Baris pertama <b>wajib</b> berisi nama kolom persis seperti berikut (huruf kecil semua):<br/><code className="bg-blue-200 px-1 py-0.5 rounded font-mono text-xs">nik, nama_lengkap, jenis_kelamin, agama, rt, pekerjaan</code></li>
                  <li>Sistem akan menggunakan NIK sebagai kunci (Key). NIK baru akan ditambahkan, NIK yang sudah ada akan diperbarui datanya.</li>
                </ul>
              </div>

              <label className="border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 hover:border-blue-400 transition-all group">
                <UploadCloud size={40} className="text-slate-400 group-hover:text-blue-500 mb-3 transition-colors" />
                <p className="text-sm font-semibold text-slate-700">Pilih file Excel (.xlsx, .xls) atau CSV</p>
                <p className="text-xs text-slate-500 mt-1">atau drag & drop kesini</p>
                <input 
                  type="file" 
                  accept=".xlsx, .xls, .csv" 
                  className="hidden" 
                  onChange={handleFileUpload}
                  disabled={isLoading}
                />
              </label>

              {isLoading && (
                <div className="mt-4 text-center text-sm font-medium text-blue-600 animate-pulse">
                  Sedang memproses dan menyimpan data...
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
