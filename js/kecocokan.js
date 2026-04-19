// ================== KECOCOKAN JODOH ==================
// File: js/kecocokan.js
// Fungsi spesifik untuk halaman kecocokan

let kecocokanData = null;
let calendarData = null;
let currentResult = null;

/**
 * Analisis kecocokan Wuku
 */
function analyzeWuku(wuku1, wuku2) {
    const w1 = calendarData.wuku.find(w => w.name === wuku1);
    const w2 = calendarData.wuku.find(w => w.name === wuku2);
    if (!w1 || !w2) return { level: 'Netral', desc: 'Data Wuku tidak ditemukan.' };
    
    const sameElement = w1.element === w2.element;
    const elementCompatible = (w1.element === 'Api' && w2.element === 'Udara') || 
                             (w1.element === 'Air' && w2.element === 'Tanah') ||
                             (w1.element === 'Tanah' && w2.element === 'Air') ||
                             (w1.element === 'Udara' && w2.element === 'Api');
    
    const uripDiff = Math.abs(w1.urip_wuku - w2.urip_wuku);
    let level = 'Cukup';
    let desc = '';
    
    if (sameElement) {
        level = 'Sangat Baik';
        desc = `Keduanya lahir di Wuku dengan elemen ${w1.element} yang sama.`;
    } else if (elementCompatible) {
        level = 'Baik';
        desc = `Elemen Wuku ${w1.element} dan ${w2.element} saling melengkapi.`;
    } else if (uripDiff === 0) {
        level = 'Sangat Baik';
        desc = `Keduanya memiliki Urip Wuku yang sama.`;
    } else if (uripDiff % 3 === 0) {
        level = 'Baik';
        desc = `Selisih Urip Wuku (${uripDiff}) adalah bilangan harmonis.`;
    } else {
        level = 'Cukup';
        desc = `Wuku ${w1.name} dan ${w2.name} memiliki karakter berbeda.`;
    }
    
    return { level, desc, w1, w2 };
}

/**
 * Menghitung kecocokan dan menampilkan hasil
 */
async function calculateKecocokan(skipScroll = false) {
    if (!calendarData || !kecocokanData) { alert('Data masih dimuat.'); return; }

    const name1 = document.getElementById('name1').value.trim() || 'Anda';
    const name2 = document.getElementById('name2').value.trim() || 'Pasangan';
    const birth1 = document.getElementById('birth1').value;
    const birth2 = document.getElementById('birth2').value;
    if (!birth1 || !birth2) { alert('Lengkapi tanggal lahir keduanya.'); return; }

    const date1 = new Date(birth1);
    const date2 = new Date(birth2);
    
    const weton1 = getWeton(date1);
    const weton2 = getWeton(date2);
    
    const neptu1 = calculateNeptu(weton1.saptawara, weton1.pancawara, calendarData.saptawara, calendarData.pancawara);
    const neptu2 = calculateNeptu(weton2.saptawara, weton2.pancawara, calendarData.saptawara, calendarData.pancawara);
    const total = neptu1 + neptu2;

    const wuku1 = getWuku(date1).name;
    const wuku2 = getWuku(date2).name;

    document.getElementById('name1Display').textContent = name1;
    document.getElementById('name2Display').textContent = name2;
    document.getElementById('neptu1').textContent = neptu1;
    document.getElementById('neptu2').textContent = neptu2;
    document.getElementById('weton1Display').textContent = `${weton1.combo} (Wuku: ${wuku1})`;
    document.getElementById('weton2Display').textContent = `${weton2.combo} (Wuku: ${wuku2})`;
    document.getElementById('totalNeptu').textContent = total;

    const kategori = kecocokanData.kecocokan_jodoh.find(k => total >= k.min_neptu && total <= k.max_neptu);
    if (kategori) {
        document.getElementById('categoryName').textContent = `${kategori.category} (${kategori.status})`;
        document.getElementById('categoryDesc').textContent = kategori.description;
    } else {
        document.getElementById('categoryName').textContent = 'Tidak Diketahui';
    }

    const wukuAnalysis = analyzeWuku(wuku1, wuku2);

    currentResult = {
        name1, name2, birth1, birth2,
        weton1: weton1.combo, neptu1, wuku1,
        weton2: weton2.combo, neptu2, wuku2,
        total,
        category: kategori?.category || '-',
        status: kategori?.status || '-',
        desc: kategori?.description || '',
        wukuAnalysis
    };

    // Buat shareable link
    const url = new URL(window.location.href);
    url.searchParams.set('n1', name1);
    url.searchParams.set('b1', birth1);
    url.searchParams.set('n2', name2);
    url.searchParams.set('b2', birth2);
    document.getElementById('shareLink').value = url.toString();

    document.getElementById('resultSection').classList.remove('hidden');
    document.getElementById('premiumBox').classList.add('hidden');
    
    if (!skipScroll) {
        document.getElementById('resultSection').scrollIntoView({ behavior: 'smooth' });
    }
}

/**
 * Menampilkan konten premium kecocokan
 */
function displayKecocokanPremium() {
    if (!currentResult) { alert('Lakukan perhitungan dulu.'); return; }
    const r = currentResult;
    const w = r.wukuAnalysis;
    
    let saranNeptu = '';
    if (r.total >= 25) saranNeptu = 'Pasangan ini memiliki potensi kemakmuran luar biasa.';
    else if (r.total >= 19) saranNeptu = 'Hubungan ini diberkati keharmonisan alami.';
    else if (r.total >= 14) saranNeptu = 'Pasangan yang rukun, perlu usaha menjaga keseimbangan.';
    else if (r.total >= 8) saranNeptu = 'Potensi cukup baik, perlu saling pengertian ekstra.';
    else saranNeptu = 'Tantangan cukup besar, kunci: kesabaran dan saling memaafkan.';

    const html = `
        <h3 style="color:#D4AF37;"><i class="fas fa-crown"></i> Analisis Mendalam ${r.name1} & ${r.name2}</h3>
        <div style="background:rgba(15,15,20,0.8); padding:20px; border-radius:16px; margin:16px 0;">
            <p><strong>Weton Anda:</strong> ${r.weton1} (Neptu ${r.neptu1}) | Wuku: ${r.wuku1}</p>
            <p><strong>Weton Pasangan:</strong> ${r.weton2} (Neptu ${r.neptu2}) | Wuku: ${r.wuku2}</p>
            <p><strong>Total Neptu:</strong> ${r.total} → ${r.category} (${r.status})</p>
        </div>
        <div style="margin:16px 0;">
            <h4 style="color:#D4AF37;"><i class="fas fa-om"></i> Analisis Wuku</h4>
            <p>${w.desc}</p>
        </div>
        <p style="background:rgba(15,15,20,0.8); padding:20px; border-radius:16px;"><i class="fas fa-lightbulb"></i> <strong>Saran:</strong> ${saranNeptu}</p>
    `;
    document.getElementById('premiumBox').innerHTML = html;
    document.getElementById('premiumBox').classList.remove('hidden');
}

// Fungsi share
function copyLink() {
    const input = document.getElementById('shareLink');
    input.select();
    navigator.clipboard?.writeText(input.value).then(() => showSuccessToast('Tautan disalin!'));
}

function shareWA() {
    const link = document.getElementById('shareLink').value;
    window.open(`https://wa.me/?text=${encodeURIComponent('Lihat kecocokan jodohku! ' + link)}`, '_blank');
}

function shareTelegram() {
    const link = document.getElementById('shareLink').value;
    window.open(`https://t.me/share/url?url=${encodeURIComponent(link)}`, '_blank');
}
