// Backend sinkronisasi Pengeluaran Bulanan (Google Apps Script)
// Ganti PIN di bawah dengan kata sandi buatanmu sendiri (minimal 8 karakter).
const PIN = 'GANTI-PIN-INI';

function doGet() {
  return ContentService.createTextOutput('Backend pengeluaran aktif.');
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const req = JSON.parse(e.postData.contents);
    if (PIN === 'GANTI-PIN-INI') return keluar_({ ok: false, error: 'PIN di Code.gs belum diganti' });
    if (req.pin !== PIN) return keluar_({ ok: false, error: 'pin' });

    const st = ambil_();
    const ops = req.ops || [];
    ops.forEach(op => {
      if (op.t === 'add') {
        const id = Number(op.e.id);
        if (!st.data.some(d => d.id === id)) {
          st.data.push({ id: id, tgl: String(op.e.tgl), kat: String(op.e.kat), ket: String(op.e.ket), jml: Number(op.e.jml) });
        }
      } else if (op.t === 'del') {
        st.data = st.data.filter(d => d.id !== Number(op.id));
      } else if (op.t === 'delbulan') {
        st.data = st.data.filter(d => !d.tgl.startsWith(String(op.bulan)));
      } else if (op.t === 'inc') {
        const j = Number(op.jml);
        if (j > 0) st.pemasukan[String(op.bulan)] = j; else delete st.pemasukan[String(op.bulan)];
      } else if (op.t === 'incbila') { // isi hanya jika bulan itu belum punya pendapatan
        if (st.pemasukan[String(op.bulan)] === undefined && Number(op.jml) > 0) st.pemasukan[String(op.bulan)] = Number(op.jml);
      }
    });
    if (ops.length) tulis_(st);
    return keluar_({ ok: true, data: st.data, pemasukan: st.pemasukan });
  } catch (err) {
    return keluar_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function keluar_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

function sheet_(nama, kepala) {
  const ss = SpreadsheetApp.getActive();
  let s = ss.getSheetByName(nama);
  if (!s) { s = ss.insertSheet(nama); s.appendRow(kepala); }
  return s;
}

function ambil_() {
  const sp = sheet_('Pengeluaran', ['id', 'tgl', 'kat', 'ket', 'jml']);
  const si = sheet_('Pendapatan', ['bulan', 'jml']);
  const data = sp.getDataRange().getValues().slice(1)
    .filter(r => r[0] !== '')
    .map(r => ({ id: Number(r[0]), tgl: String(r[1]), kat: String(r[2]), ket: String(r[3]), jml: Number(r[4]) }));
  const pemasukan = {};
  si.getDataRange().getValues().slice(1).forEach(r => {
    if (r[0] !== '') pemasukan[String(r[0])] = Number(r[1]);
  });
  return { data: data, pemasukan: pemasukan };
}

function tulis_(st) {
  isi_(sheet_('Pengeluaran', ['id', 'tgl', 'kat', 'ket', 'jml']),
    st.data.map(d => [d.id, d.tgl, d.kat, d.ket, d.jml]), 5, [2, 3, 4]);
  isi_(sheet_('Pendapatan', ['bulan', 'jml']),
    Object.keys(st.pemasukan).sort().map(b => [b, st.pemasukan[b]]), 2, [1]);
}

// Kolom teks diformat "teks biasa" agar tanggal/bulan tidak diubah Sheets jadi tanggal otomatis.
function isi_(s, rows, jumlahKolom, kolomTeks) {
  const akhir = s.getLastRow();
  if (akhir > 1) s.getRange(2, 1, akhir - 1, jumlahKolom).clearContent();
  if (!rows.length) return;
  kolomTeks.forEach(c => s.getRange(2, c, rows.length, 1).setNumberFormat('@'));
  s.getRange(2, 1, rows.length, jumlahKolom).setValues(rows);
}
