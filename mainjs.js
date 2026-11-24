// Menu navigasi di HP
const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.nav');
if (navToggle) {
  navToggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open);
  });
}

// Saklar lampu di halaman Beranda
const saklar = document.getElementById('saklar');
if (saklar) {
  const hero = document.querySelector('.hero');
  const pesan = document.getElementById('pesan');
  const label = document.getElementById('saklar-label');
  saklar.addEventListener('click', () => {
    const nyala = saklar.getAttribute('aria-checked') !== 'true';
    saklar.setAttribute('aria-checked', nyala);
    hero.dataset.lamp = nyala ? 'on' : 'off';
    label.textContent = nyala ? 'Lampu ruang kosong: menyala' : 'Lampu ruang kosong: mati';
    pesan.textContent = nyala
      ? 'Lampu menyala di ruangan yang tidak dipakai. Energi terbuang sia-sia.'
      : 'Cukup satu klik, energi terhemat. Sesederhana itu.';
  });
}

// Tahun di footer
document.querySelectorAll('.tahun').forEach(el => el.textContent = new Date().getFullYear());


// ===== Fase 3: halaman Aksi & Rekomendasi =====

// Tantangan hemat energi (centang + progres, tersimpan di perangkat)
const daftar = document.getElementById('daftar-tantangan');
if (daftar) {
  const kotak = daftar.querySelectorAll('input[type="checkbox"]');
  const bar = document.getElementById('bar');
  const bilah = document.querySelector('.progress');
  const labelProgres = document.getElementById('progress-label');
  const KUNCI = 'tantangan-hemat-energi';

  let tersimpan = [];
  try { tersimpan = JSON.parse(localStorage.getItem(KUNCI)) || []; } catch (e) { tersimpan = []; }
  kotak.forEach(k => { k.checked = tersimpan.includes(k.value); });

  const perbarui = () => {
    const selesai = [...kotak].filter(k => k.checked);
    const total = kotak.length;
    bar.style.width = (selesai.length / total * 100) + '%';
    bilah.setAttribute('aria-valuenow', selesai.length);
    labelProgres.textContent = selesai.length === total
      ? 'Semua kebiasaan selesai. Terima kasih sudah menyelamatkan energi hari ini!'
      : selesai.length + ' dari ' + total + ' kebiasaan selesai';
    try { localStorage.setItem(KUNCI, JSON.stringify(selesai.map(k => k.value))); } catch (e) {}
  };

  kotak.forEach(k => k.addEventListener('change', perbarui));
  document.getElementById('reset-tantangan').addEventListener('click', () => {
    kotak.forEach(k => { k.checked = false; });
    perbarui();
  });
  perbarui();
}

// Tip harian (berganti sesuai hari, bisa diganti manual)
const tipTeks = document.getElementById('tip-teks');
if (tipTeks) {
  const tips = [
    'Biasakan jadi orang terakhir yang keluar kelas, lalu cek saklar lampu dan kipas.',
    'Charger yang tetap tercolok tetap menarik listrik. Cabut kalau sudah tidak dipakai.',
    'Buka tirai dan manfaatkan cahaya siang sebelum menyalakan lampu.',
    'Gunakan mode hemat daya di laptop dan matikan layar saat ditinggal sebentar.',
    'Ajak satu teman hari ini untuk ikut mematikan yang tak perlu.',
    'Matikan proyektor begitu presentasi selesai, jangan tunggu akhir pelajaran.',
    'Bersihkan lampu dan kipas secara berkala agar bekerja efisien.'
  ];
  let urutan = new Date().getDay() % tips.length;
  const tampil = () => { tipTeks.textContent = tips[urutan]; };
  document.getElementById('tip-lain').addEventListener('click', () => {
    urutan = (urutan + 1) % tips.length;
    tampil();
  });
  tampil();
}
