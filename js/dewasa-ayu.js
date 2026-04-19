// ================== DEWASA AYU ==================
// File: js/dewasa-ayu.js
// Fungsi spesifik untuk halaman Dewasa Ayu

let calendarData = null;
let currentDayData = null;

/**
 * Mendapatkan Tri Wara berdasarkan Saptawara dan Pancawara
 */
function getTriWara(saptawara, pancawara) {
    const s = calendarData.saptawara.find(x => x.name === saptawara);
    const p = calendarData.pancawara.find(x => x.name === pancawara);
    if (!s || !p) return null;
    
    const total = s.urip + p.urip;
    const mod = total % 3;
    
    const triWaraList = [
        { name: 'Pasah', meaning: 'Jatuh / Selesai', activity: 'Baik untuk upacara kematian atau penyucian. Tidak baik untuk memulai sesuatu yang baru.' },
        { name: 'Beteng', meaning: 'Kuat / Kokoh', activity: 'Baik untuk membuat pagar, benteng spiritual, atau melindungi sesuatu.' },
        { name: 'Kajeng', meaning: 'Keras / Sakral', activity: 'Energi kuat. Baik untuk bekerja keras, tetapi waspadai konflik dan keras kepala.' }
    ];
    
    return triWaraList[mod === 0 ? 2 : mod - 1];
}

/**
 * Menghitung Dewasa Ayu untuk tanggal yang dipilih
 */
function calculateDewasaAyu() {
    if (!calendarData) { alert('Data masih dimuat.'); return; }
    
    const dateStr = document.getElementById('selectedDate').value;
    if (!dateStr) { alert('Pilih tanggal terlebih dahulu.'); return; }
    
    const date = new Date(dateStr);
    const weton = getWeton(date);
    const wuku = getWuku(date);
    const triWara = getTriWara(weton.saptawara, weton.pancawara);
    const wukuData = calendarData.wuku.find(w => w.name === wuku.name);
    
    let level = 'Cukup';
    if (wukuData) {
        if (wukuData.activity.includes('Sangat baik')) level = 'Sangat Baik';
        else if (wukuData.activity.includes('Baik')) level = 'Baik';
        else if (wukuData.activity.includes('Tidak baik')) level = 'Kurang Baik';
    }
    
    document.getElementById('dayLevel').textContent = level;
    document.getElementById('dayShortDesc').textContent = wukuData?.activity || '-';
    document.getElementById('wukuDisplay').textContent = `${wuku.name} (${wukuData?.meaning || ''})`;
    document.getElementById('saptawaraDisplay').textContent = weton.saptawara;
    document.getElementById('pancawaraDisplay').textContent = weton.pancawara;
    document.getElementById('triwaraDisplay').textContent = triWara ? `${triWara.name}` : '-';
    
    currentDayData = { date: dateStr, weton, wuku: wukuData, triWara, level };
    
    document.getElementById('resultSection').classList.remove('hidden');
    document.getElementById('premiumBox').classList.add('hidden');
}

/**
 * Menampilkan konten premium Dewasa Ayu
 */
function displayDewasaAyuPremium() {
    if (!currentDayData) { alert('Cek hari baik dulu.'); return; }
    
    const d = currentDayData;
    const w = d.wuku;
    const t = d.triWara;
    
    let rekomendasi = '';
    if (d.level === 'Sangat Baik') rekomendasi = 'Sangat baik untuk memulai usaha baru, menikah, pindah rumah, atau upacara penting.';
    else if (d.level === 'Baik') rekomendasi = 'Hari ini baik untuk aktivitas rutin, bekerja, belajar, dan silaturahmi.';
    else if (d.level === 'Cukup') rekomendasi = 'Hari ini cukup baik. Lakukan aktivitas biasa, tetapi tunda keputusan besar.';
    else rekomendasi = 'Hari ini kurang baik untuk memulai hal baru. Lebih baik untuk istirahat, introspeksi, atau menyelesaikan pekerjaan lama.';
    
    const html = `
        <h3 style="color:#D4AF37; margin-bottom:20px;"><i class="fas fa-crown"></i> Analisis Dewasa Ayu</h3>
        <p><strong>Tanggal:</strong> ${d.date}</p>
        <p><strong>Wuku:</strong> ${w.name} (${w.meaning})</p>
        <p style="margin-top:12px;">${w.character}</p>
        <p style="margin-top:12px;"><i class="fas fa-check-circle" style="color:#D4AF37;"></i> <strong>Aktivitas yang dianjurkan:</strong> ${w.activity}</p>
        <p style="margin-top:12px;"><i class="fas fa-times-circle" style="color:#D4AF37;"></i> <strong>Pantangan:</strong> Hindari arah ${w.forbidden_direction}.</p>
        
        <div style="margin-top:24px; padding-top:20px; border-top:1px solid rgba(212,175,55,0.2);">
            <p><strong>Saptawara:</strong> ${d.weton.saptawara}</p>
            <p><strong>Pancawara:</strong> ${d.weton.pancawara}</p>
        </div>
        
        <div style="margin-top:20px; padding-top:20px; border-top:1px solid rgba(212,175,55,0.2);">
            <p><strong>Tri Wara:</strong> ${t.name} (${t.meaning})</p>
            <p>${t.activity}</p>
        </div>
        
        <div style="margin-top:24px; background:rgba(15,15,20,0.8); padding:20px; border-radius:16px;">
            <p><i class="fas fa-lightbulb" style="color:#D4AF37;"></i> <strong>Rekomendasi Aktivitas Hari Ini:</strong></p>
            <p>${rekomendasi}</p>
            <p style="margin-top:12px;">Energi hari ini didominasi oleh Wuku ${w.name} dengan elemen ${w.element}. Kombinasi dengan Tri Wara ${t.name} menghasilkan energi yang ${d.level}.</p>
        </div>
        
        <p style="margin-top:20px; font-style:italic; opacity:0.8;">Catatan: Dewasa Ayu adalah panduan, bukan aturan mutlak. Niat tulus dan usaha keras tetap menjadi penentu utama.</p>
    `;
    
    document.getElementById('premiumBox').innerHTML = html;
    document.getElementById('premiumBox').classList.remove('hidden');
}

/**
 * Inisialisasi halaman Dewasa Ayu
 */
async function initDewasaAyu() {
    // Set default date to today
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    document.getElementById('selectedDate').value = `${yyyy}-${mm}-${dd}`;
    
    try {
        const data = await loadAllData();
        calendarData = data.calendar;
    } catch(e) {
        alert('Gagal memuat data kalender.');
        return;
    }
    
    updateTokenDisplay();
    checkPaymentSuccess();
    
    document.getElementById('checkBtn').addEventListener('click', calculateDewasaAyu);
    document.getElementById('premiumBtn').addEventListener('click', () => {
        handlePremiumUnlock(displayDewasaAyuPremium);
    });
}
