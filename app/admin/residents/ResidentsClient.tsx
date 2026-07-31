"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Edit2, Trash2, Upload, Plus, X, UploadCloud, AlertCircle, Users, Search } from "lucide-react";
import * as XLSX from "xlsx";
import { useRouter } from "next/navigation";
import { addResidentAction, updateResidentAction, deleteResidentAction, bulkImportResidentsAction } from "./actions";
import { parseResidentExcel } from "./smartParser";

export default function ResidentsClient({ initialResidents }: { initialResidents: any[] }) {
  const router = useRouter();
  const supabase = createClient();
  const [residents, setResidents] = useState(initialResidents);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState<number | "ALL">(10);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setResidents(initialResidents);
  }, [initialResidents]);

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
    pekerjaan: "",
    usia: "",
    pendidikan_terakhir: "Tidak/Belum Sekolah",
    status_perkawinan: "Belum Kawin"
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
        pekerjaan: resident.pekerjaan || "",
        usia: resident.usia?.toString() || "",
        pendidikan_terakhir: resident.pendidikan_terakhir || "Tidak/Belum Sekolah",
        status_perkawinan: resident.status_perkawinan || "Belum Kawin"
      });
    } else {
      setEditingResident(null);
      setFormData({ nik: "", nama_lengkap: "", jenis_kelamin: "Laki-laki", agama: "Islam", rt: "", pekerjaan: "", usia: "", pendidikan_terakhir: "Tidak/Belum Sekolah", status_perkawinan: "Belum Kawin" });
    }
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    resetMessages();

    try {
      let res;
      if (editingResident) {
        res = await updateResidentAction(editingResident.id, formData);
      } else {
        res = await addResidentAction(formData);
      }
      
      if (!res.success) {
        throw new Error(res.error || "Gagal menyimpan data.");
      }

      setSuccessMsg(editingResident ? "Data warga berhasil diperbarui." : "Warga baru berhasil ditambahkan.");
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
      const res = await deleteResidentAction(id);
      if (!res.success) throw new Error(res.error || "Gagal menghapus data.");
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

      const { rows: rowsToUpsert, headerRowIdx } = parseResidentExcel(worksheet);

      const res = await bulkImportResidentsAction(rowsToUpsert);
      if (!res.success) {
        throw new Error(res.error || "Gagal mengimpor data dari Excel.");
      }

      setSuccessMsg(`Berhasil mengimpor ${rowsToUpsert.length} data warga (Header terdeteksi otomatis di baris ke-${headerRowIdx + 1}).`);
      setIsBulkOpen(false);
      refreshData();

    } catch (error: any) {
      setErrorMsg(error.message || "Gagal memproses file Excel.");
    } finally {
      setIsLoading(false);
      e.target.value = '';
    }
  };

  const refreshData = async () => {
    router.refresh();
    const { data } = await supabase.from("residents").select("*").order("created_at", { ascending: false });
    if (data) setResidents(data);
  };

  const filteredResidents = residents.filter((r: any) => 
    r.nama_lengkap.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.nik.includes(searchQuery)
  );

  const totalPages = itemsPerPage === "ALL" ? 1 : Math.ceil(filteredResidents.length / itemsPerPage);
  
  const displayedResidents = itemsPerPage === "ALL" 
    ? filteredResidents 
    : filteredResidents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
      <div className="flex flex-col sm:flex-row justify-end mb-6 gap-4">
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

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Cari Nama / NIK..." 
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm text-slate-900 bg-white"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-sm text-slate-500">Tampilkan:</span>
          <select 
            value={itemsPerPage}
            onChange={(e) => { 
              setItemsPerPage(e.target.value === "ALL" ? "ALL" : Number(e.target.value)); 
              setCurrentPage(1); 
            }}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 bg-white"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value="ALL">Semua</option>
          </select>
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
                <th className="px-6 py-4">Usia</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayedResidents && displayedResidents.length > 0 ? (
                displayedResidents.map((r: any) => (
                  <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-800">{r.nama_lengkap}</div>
                      <div className="text-xs text-slate-500 font-medium tracking-wider">{r.nik}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-700">{r.agama}</div>
                      <div className="text-xs text-slate-500">{r.jenis_kelamin}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                        {r.rt}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {r.pekerjaan}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {r.usia !== null && r.usia !== undefined ? `${r.usia} thn` : '-'}
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
        
        {/* Pagination Controls */}
        {itemsPerPage !== "ALL" && totalPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-between items-center px-6 py-4 border-t border-slate-100 gap-4">
            <p className="text-sm text-slate-500">
              Menampilkan <span className="font-medium">{((currentPage - 1) * itemsPerPage) + 1}</span> - <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredResidents.length)}</span> dari <span className="font-medium">{filteredResidents.length}</span> data
            </p>
            <div className="flex gap-2">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors"
              >
                Sebelumnya
              </button>
              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors"
              >
                Selanjutnya
              </button>
            </div>
          </div>
        )}
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
            {errorMsg && (
              <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2 text-sm font-medium">
                <AlertCircle size={18} /> {errorMsg}
              </div>
            )}
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
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Usia</label>
                  <input 
                    type="number" 
                    required 
                    min="0"
                    value={formData.usia}
                    onChange={(e) => setFormData({...formData, usia: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-900 bg-white font-medium"
                    placeholder="Contoh: 25"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Pendidikan</label>
                  <select 
                    value={formData.pendidikan_terakhir}
                    onChange={(e) => setFormData({...formData, pendidikan_terakhir: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-900 bg-white font-medium"
                  >
                    <option value="Tidak/Belum Sekolah">Tidak/Belum Sekolah</option>
                    <option value="Belum Tamat SD/Sederajat">Belum Tamat SD/Sederajat</option>
                    <option value="SLTP/Sederajat">SLTP/Sederajat</option>
                    <option value="SLTA/Sederajat">SLTA/Sederajat</option>
                    <option value="Diploma IV/Strata I">Diploma IV/Strata I</option>
                    <option value="Strata II/Strata III">Strata II/Strata III</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Status Perkawinan</label>
                  <select 
                    value={formData.status_perkawinan}
                    onChange={(e) => setFormData({...formData, status_perkawinan: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-900 bg-white font-medium"
                  >
                    <option value="Belum Kawin">Belum Kawin</option>
                    <option value="Kawin">Kawin</option>
                    <option value="Cerai Hidup">Cerai Hidup</option>
                    <option value="Cerai Mati">Cerai Mati</option>
                  </select>
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
            {errorMsg && (
              <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2 text-sm font-medium">
                <AlertCircle size={18} /> {errorMsg}
              </div>
            )}
            <div className="p-6">
              <div className="bg-blue-50 text-blue-800 p-4 rounded-xl text-sm mb-6 border border-blue-100">
                <p className="font-semibold mb-2 flex items-center gap-1.5">⚡ Smart Excel Parser v1.5 Aktif:</p>
                <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
                  <li><b>Deteksi Header Otomatis:</b> Sistem otomatis mengenali baris judul tabel meskipun diawali oleh judul dokumen/gambar di baris 1-20.</li>
                  <li><b>Urutan Kolom Fleksibel:</b> Posisi kolom tidak wajib berurutan (misal NIK boleh di depan, tengah, atau belakang).</li>
                  <li><b>Mendukung Alias Kolom:</b> Mengenali berbagai variasi nama kolom (misal: &quot;JK&quot; / &quot;L/P&quot; &rarr; Jenis Kelamin, &quot;No. NIK&quot; &rarr; NIK, dsb.).</li>
                  <li><b>Sanitasi NIK &amp; Upsert:</b> Penyaringan NIK ganda otomatis di sistem. NIK baru ditambahkan (Insert), NIK lama diperbarui (Update) tanpa menghapus data lain.</li>
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
