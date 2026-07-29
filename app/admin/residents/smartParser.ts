import * as XLSX from 'xlsx';

export interface ResidentRow {
  nik: string;
  nama_lengkap: string;
  jenis_kelamin: string;
  agama: string;
  rt: string;
  pekerjaan: string;
  usia?: number;
  pendidikan_terakhir?: string;
  status_perkawinan?: string;
}

const ALIAS_MAP: Record<keyof ResidentRow, string[]> = {
  nik: ['nik', 'no. nik', 'nomor nik', 'no nik', 'nik penduduk', 'no ktp', 'nomor ktp', 'ktp', 'nomor identitas', 'identitas'],
  nama_lengkap: ['nama lengkap', 'nama', 'nama penduduk', 'nama warga', 'nama_lengkap', 'nma', 'nama kk', 'nama kepala keluarga'],
  jenis_kelamin: ['jenis kelamin', 'jk', 'sex', 'gender', 'l/p', 'jenis_kelamin', 'kelamin', 'l / p', 'pria/wanita', 'pria / wanita'],
  agama: ['agama', 'agm', 'kepercayaan'],
  rt: ['rt', 'no. rt', 'no rt', 'rukun tetangga', 'no_rt', 'rt/rw', 'rt / rw'],
  pekerjaan: ['pekerjaan', 'jenis pekerjaan', 'status pekerjaan', 'mata pencaharian', 'profesi', 'profesi / pekerjaan'],
  usia: ['usia', 'umur', 'age'],
  pendidikan_terakhir: ['pendidikan', 'pendidikan terakhir', 'ijazah', 'tingkat pendidikan'],
  status_perkawinan: ['status perkawinan', 'status nikah', 'status kawin', 'perkawinan', 'status']
};

export function parseResidentExcel(worksheet: XLSX.WorkSheet): { rows: ResidentRow[]; headerRowIdx: number } {
  // 1. Convert sheet to 2D array of cells
  const rawRows: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  if (!rawRows || rawRows.length === 0) {
    throw new Error("File Excel kosong atau tidak dapat dibaca.");
  }

  // 2. Scan up to first 20 rows to detect header row
  let headerRowIdx = -1;
  let colMapping: Record<number, keyof ResidentRow> = {};
  const maxScan = Math.min(rawRows.length, 20);

  for (let i = 0; i < maxScan; i++) {
    const row = rawRows[i] || [];
    const prevRow = i > 0 ? (rawRows[i - 1] || []) : [];
    const currentMapping: Record<number, keyof ResidentRow> = {};

    for (let colIdx = 0; colIdx < row.length; colIdx++) {
      const cellVal = String(row[colIdx] || '').toLowerCase().replace(/[\n\r]+/g, ' ').replace(/\s+/g, ' ').trim();
      const prevVal = String(prevRow[colIdx] || '').toLowerCase().replace(/[\n\r]+/g, ' ').replace(/\s+/g, ' ').trim();
      const combinedVal = `${prevVal} ${cellVal}`.trim();

      // Check against alias map
      for (const [key, aliases] of Object.entries(ALIAS_MAP)) {
        const typedKey = key as keyof ResidentRow;
        if (aliases.includes(cellVal) || aliases.includes(combinedVal)) {
          currentMapping[colIdx] = typedKey;
          break;
        } else if (aliases.some(alias => cellVal === alias || cellVal.includes(alias) || combinedVal.includes(alias))) {
          // Fallback substring check (e.g. "Nomor NIK Warga")
          if (!currentMapping[colIdx]) {
            currentMapping[colIdx] = typedKey;
          }
        }
      }
    }

    const mappedKeys = Object.values(currentMapping);
    // A row is considered a header if it maps at least 'nik' and 'nama_lengkap', OR maps at least 3 distinct required keys
    const hasNikAndNama = mappedKeys.includes('nik') && mappedKeys.includes('nama_lengkap');
    const distinctKeysCount = new Set(mappedKeys).size;

    if (hasNikAndNama || distinctKeysCount >= 3) {
      headerRowIdx = i;
      colMapping = currentMapping;
      break;
    }
  }

  if (headerRowIdx === -1) {
    throw new Error("Gagal mendeteksi baris header tabel. Pastikan terdapat kolom NIK dan Nama Lengkap pada 20 baris pertama.");
  }

  // Check if essential columns are found
  const foundKeys = new Set(Object.values(colMapping));
  if (!foundKeys.has('nik') || !foundKeys.has('nama_lengkap')) {
    throw new Error(`Baris header terdeteksi di baris ke-${headerRowIdx + 1}, namun kolom wajib NIK atau Nama Lengkap tidak ditemukan.`);
  }

  // 3. Extract and sanitize data rows
  const parsedRows: ResidentRow[] = [];

  for (let r = headerRowIdx + 1; r < rawRows.length; r++) {
    const row = rawRows[r] || [];
    
    // Check if row has data in mapped columns
    const rawNik = row[Object.keys(colMapping).find(k => colMapping[Number(k)] === 'nik') as any];
    const rawNama = row[Object.keys(colMapping).find(k => colMapping[Number(k)] === 'nama_lengkap') as any];
    
    if (rawNik === undefined && rawNama === undefined) continue; // Skip empty row
    
    // Sanitize NIK (remove non-digits, e.g. quotes, spaces, dashes)
    const nikStr = String(rawNik || '').replace(/[^0-9]/g, '').trim();
    const namaStr = String(rawNama || '').trim();

    // Skip if NIK is empty, invalid, or summary footer like "TOTAL"
    if (!nikStr || nikStr.length < 8 || !namaStr || namaStr.toLowerCase().startsWith('total') || namaStr.toLowerCase().startsWith('jumlah')) {
      continue;
    }

    // Helper to extract value by mapped key
    const getValue = (targetKey: keyof ResidentRow, defaultVal: string = ''): string => {
      const colEntry = Object.entries(colMapping).find(([_, k]) => k === targetKey);
      if (!colEntry) return defaultVal;
      const val = row[Number(colEntry[0])];
      return val !== undefined && val !== null ? String(val).trim() : defaultVal;
    };

    // Normalize Jenis Kelamin
    let jkStr = getValue('jenis_kelamin', 'Laki-laki').toLowerCase();
    if (jkStr.startsWith('l') || jkStr === 'pria' || jkStr === 'male' || jkStr === 'm') {
      jkStr = 'Laki-laki';
    } else if (jkStr.startsWith('p') || jkStr === 'wanita' || jkStr === 'female' || jkStr === 'f' || jkStr === 'w') {
      jkStr = 'Perempuan';
    } else {
      jkStr = 'Laki-laki'; // default
    }

    // Normalize Agama
    let agamaStr = getValue('agama', 'Islam');
    if (agamaStr) {
      agamaStr = agamaStr.charAt(0).toUpperCase() + agamaStr.slice(1).toLowerCase();
    } else {
      agamaStr = 'Islam';
    }

    // Normalize RT
    let rtStr = getValue('rt', '01');
    rtStr = rtStr.replace(/^rt[\s/_.-]*/i, '').replace(/[^0-9]/g, '').trim();
    if (!rtStr) rtStr = '01';
    else if (rtStr.length === 1) rtStr = `0${rtStr}`;
    else if (rtStr.length > 2) rtStr = rtStr.slice(0, 2); // e.g. if someone put 001

    // Normalize Pekerjaan
    let pekerjaanStr = getValue('pekerjaan', '-');
    if (!pekerjaanStr) pekerjaanStr = '-';

    // Normalize Usia
    let usiaStr = getValue('usia', '0');
    let usiaNum = parseInt(usiaStr.replace(/[^0-9]/g, ''));
    if (isNaN(usiaNum)) usiaNum = 0;

    // Normalize Pendidikan
    let pendidikanStr = getValue('pendidikan_terakhir', '-');
    if (!pendidikanStr) pendidikanStr = '-';

    // Normalize Status Perkawinan
    let statusKawinStr = getValue('status_perkawinan', '-');
    if (!statusKawinStr) statusKawinStr = '-';

    parsedRows.push({
      nik: nikStr,
      nama_lengkap: namaStr,
      jenis_kelamin: jkStr,
      agama: agamaStr,
      rt: rtStr,
      pekerjaan: pekerjaanStr,
      usia: usiaNum,
      pendidikan_terakhir: pendidikanStr,
      status_perkawinan: statusKawinStr
    });
  }

  // 4. Client-Side Deduplication by NIK
  const uniqueRows = Array.from(new Map(parsedRows.map(row => [row.nik, row])).values());

  if (uniqueRows.length === 0) {
    throw new Error(`Baris header ditemukan di baris ke-${headerRowIdx + 1}, namun tidak ada data warga valid di baris-baris bawahnya.`);
  }

  return { rows: uniqueRows, headerRowIdx };
}
