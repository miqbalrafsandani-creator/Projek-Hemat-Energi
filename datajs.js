// Fase 2: baca data/data.json lalu tampilkan sebagai grafik Chart.js
const grid = document.getElementById('chart-grid');

function warna() {
  const css = getComputedStyle(document.documentElement);
  const ambil = n => css.getPropertyValue(n).trim();
  return [ambil('--leaf'), ambil('--pine'), ambil('--sun'), ambil('--off'), '#8DB86B'];
}

function buatKartu(c) {
  const kartu = document.createElement('article');
  kartu.className = 'chart-card';
  kartu.innerHTML =
    '<h2></h2><p class="chart-src"></p>' +
    '<div class="chart-box"><canvas role="img"></canvas></div>' +
    '<p class="chart-note"></p>';
  kartu.querySelector('h2').textContent = c.judul;
  kartu.querySelector('.chart-src').textContent = 'Sumber: ' + c.sumber + ' ';
  kartu.querySelector('.chart-note').textContent = c.penjelas;
  const kanvas = kartu.querySelector('canvas');
  kanvas.setAttribute('aria-label', c.judul + '. ' + c.label.map((l, i) => l + ': ' + c.nilai[i]).join(', '));
  grid.appendChild(kartu);
  return kanvas;
}

function gambar(c, kanvas) {
  const w = warna();
  const donat = c.tipe === 'doughnut';
  const horizontal = c.tipe === 'bar-horizontal';
  new Chart(kanvas, {
    type: donat ? 'doughnut' : 'bar',
    data: {
      labels: c.label,
      datasets: [{
        label: c.labelData || ('Jumlah ' + c.satuan),
        data: c.nilai,
        backgroundColor: donat ? w.slice(0, c.nilai.length) : w[0],
        borderWidth: donat ? 2 : 0,
        borderRadius: donat ? 0 : 6
      }]
    },
    options: {
      indexAxis: horizontal ? 'y' : 'x',
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: donat, position: 'bottom' } },
      scales: donat ? {} : {
        [horizontal ? 'x' : 'y']: { beginAtZero: true, ticks: { precision: 0 }, title: { display: true, text: c.labelData || ('Jumlah ' + c.satuan) } }
      }
    }
  });
}

function tampilkan(d) {
  if (typeof Chart === 'undefined') throw new Error('Chart.js belum termuat');
  grid.innerHTML = '';
  d.charts.forEach(c => gambar(c, buatKartu(c)));
}

function galat() {
  grid.innerHTML = '<p class="chart-error">Grafik belum bisa ditampilkan. Pastikan internet aktif karena Chart.js dimuat dari CDN, lalu muat ulang halaman.</p>';
}

// Utamakan data.json (jalan di server/hosting); kalau diblokir (buka dari folder), pakai salinan di data/data.js
fetch('data/data.json')
  .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
  .catch(() => window.DATA_CADANGAN)
  .then(d => { if (!d) throw new Error('Data tidak ada'); tampilkan(d); })
  .catch(galat);
