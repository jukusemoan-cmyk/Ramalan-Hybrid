/**
 * Main Controller untuk Website Primbon Hybrid
 * Menghubungkan calculator.js, data JSON, dan DOM
 */

// ---------- KONFIGURASI PATH DATA ----------
const DATA_PATHS = {
    calendar: 'data/bali-calendar.json',
    weton: 'data/bali-weton.json',
    zodiacShio: 'data/zodiac-shio.json',
    fortunes: (zodiac) => `data/fortunes/${zodiac.toLowerCase()}.json`
};

// ---------- VARIABEL GLOBAL UNTUK MENYIMPAN DATA ----------
let calendarData = null;
let wetonData = null;
let zodiacShioData = null;
let currentFortunes = null;       // Data ramalan untuk zodiak user
let currentUserData = null;       // Hasil kalkulasi user
let isPremium = false;            // Status premium user

// ---------- DOM ELEMENTS (Akan diisi setelah halaman siap) ----------
const elements = {
    // Form Input
    userName: null,
    birthDate: null,
    submitBtn: null,
    resultSection: null,
    
    // Identitas
    displayName: null,
    displayZodiac: null,
    displayShio: null,
    displayWeton: null,
    displayNeptu: null,
    displayWuku: null,
    
    // Kartu Ramalan Free
    loveFree: null,
    careerFree: null,
    financeFree: null,
    healthFree: null,
    
    // Tombol Premium
    unlockBtn: null,
    premiumBox: null,
    
    // Loading indicator
    loadingOverlay: null
};

// ---------- INISIALISASI DOM ELEMENTS ----------
function initDOMElements() {
    elements.userName = document.getElementById('userName');
    elements.birthDate = document.getElementById('birthDate');
    elements.submitBtn = document.getElementById('revealBtn');
    elements.resultSection = document.getElementById('resultSection');
    
    elements.displayName = document.getElementById('displayName');
    elements.displayZodiac = document.getElementById('displayZodiac');
    elements.displayShio = document.getElementById('displayShio');
    elements.displayWeton = document.getElementById('displayWeton');
    elements.displayNeptu = document.getElementById('displayNeptu');
    elements.displayWuku = document.getElementById('displayWuku');
    
    elements.loveFree = document.getElementById('predictionLove');
    elements.careerFree = document.getElementById('predictionCareer');
    elements.financeFree = document.getElementById('predictionFinance');
    elements.healthFree = document.getElementById('predictionHealth');
    
    elements.unlockBtn = document.getElementById('unlockPremiumBtn');
    elements.premiumBox = document.getElementById('premiumDetailBox');
    elements.loadingOverlay = document.getElementById('loadingOverlay');
}

// ---------- FUNGSI PENGAMBILAN DATA JSON ----------
async function fetchJSON(path) {
    try {
        const response = await fetch(path);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error(`Gagal memuat ${path}:`, error);
        return null;
    }
}

async function loadAllData() {
    showLoading(true);
    try {
        // Load data dasar secara paralel
        const [calendar, weton, zodiacShio] = await Promise.all([
            fetchJSON(DATA_PATHS.calendar),
            fetchJSON(DATA_PATHS.weton),
            fetchJSON(DATA_PATHS.zodiacShio)
        ]);
        
        calendarData = calendar;
        wetonData = weton;
        zodiacShioData = zodiacShio;
        
        console.log('✅ Semua data dasar berhasil dimuat');
    } catch (error) {
        console.error('❌ Gagal memuat data dasar:', error);
        alert('Terjadi kesalahan saat memuat data. Silakan refresh halaman.');
    } finally {
        showLoading(false);
    }
}

async function loadFortunes(zodiac) {
    showLoading(true);
    try {
        const path = DATA_PATHS.fortunes(zodiac);
        currentFortunes = await fetchJSON(path);
        console.log(`✅ Data ramalan ${zodiac} berhasil dimuat`);
        return currentFortunes;
    } catch (error) {
        console.error(`❌ Gagal memuat ramalan ${zodiac}:`, error);
        return null;
    } finally {
        showLoading(false);
    }
}

// ---------- FUNGSI MENAMPILKAN LOADING ----------
function showLoading(show) {
    if (elements.loadingOverlay) {
        elements.loadingOverlay.style.display = show ? 'flex' : 'none';
    }
}

// ---------- FUNGSI UTAMA MENAMPILKAN HASIL ----------
async function handleReveal() {
    // Validasi input
    const name = elements.userName.value.trim() || 'Sang Pencari';
    const birthVal = elements.birthDate.value;
    if (!birthVal) {
        alert('Silakan pilih tanggal lahir terlebih dahulu.');
        return;
    }
    
    // Pastikan data dasar sudah termuat
    if (!calendarData || !wetonData) {
        alert('Data masih dimuat, silakan tunggu sebentar...');
        return;
    }
    
    showLoading(true);
    
    try {
        // 1. Kalkulasi data user
        const birthDate = new Date(birthVal);
        currentUserData = await calculateAll(birthVal, calendarData, wetonData);
        
        // 2. Load data ramalan sesuai zodiak
        const zodiac = currentUserData.zodiac;
        const fortunes = await loadFortunes(zodiac);
        if (!fortunes) {
            alert(`Data ramalan untuk ${zodiac} belum tersedia.`);
            return;
        }
        
        // 3. Cari data shio yang sesuai
        const shioData = fortunes.find(f => f.shio === currentUserData.shio);
        if (!shioData) {
            alert(`Data untuk kombinasi ${zodiac} - ${currentUserData.shio} tidak ditemukan.`);
            return;
        }
        
        // 4. Tampilkan data identitas
        displayIdentity(currentUserData, name);
        
        // 5. Tampilkan ramalan gratis
        displayFreeFortunes(shioData.free);
        
        // 6. Simpan data premium untuk nanti
        currentFortunes = shioData;
        
        // 7. Tampilkan section hasil
        elements.resultSection.classList.remove('hidden');
        
        // 8. Reset premium box
        elements.premiumBox.classList.add('hidden');
        elements.premiumBox.innerHTML = '';
        isPremium = false;
        
        // 9. Scroll ke hasil
        elements.resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
    } catch (error) {
        console.error('Error saat memproses:', error);
        alert('Terjadi kesalahan saat memproses data.');
    } finally {
        showLoading(false);
    }
}

function displayIdentity(userData, name) {
    elements.displayName.innerHTML = `<i class="fas fa-star"></i> ${name}`;
    elements.displayZodiac.innerHTML = `<i class="fas fa-moon"></i> ${userData.zodiac}`;
    elements.displayShio.innerHTML = `<i class="fas fa-dragon"></i> ${userData.shio}`;
    elements.displayWeton.innerHTML = `<i class="fas fa-calendar"></i> ${userData.weton.combo}`;
    elements.displayNeptu.innerHTML = `<i class="fas fa-hashtag"></i> Neptu: ${userData.weton.neptu}`;
    elements.displayWuku.innerHTML = `<i class="fas fa-om"></i> Wuku: ${userData.wuku.name}`;
}

function displayFreeFortunes(freeData) {
    elements.loveFree.textContent = `“${freeData.love}”`;
    elements.careerFree.textContent = `“${freeData.career}”`;
    elements.financeFree.textContent = `“${freeData.finance}”`;
    elements.healthFree.textContent = `“${freeData.health}”`;
}

// ---------- FUNGSI UNTUK PREMIUM ----------
function handleUnlockPremium() {
    if (!currentFortunes || !currentUserData) {
        alert('Silakan lakukan ramalan terlebih dahulu.');
        return;
    }
    
    // Simulasi pembayaran berhasil (nanti bisa diganti dengan integrasi payment gateway)
    // Untuk demo, kita langsung tampilkan konten premium.
    
    const premium = currentFortunes.premium;
    const user = currentUserData;
    
    const html = `
        <div style="display:flex; flex-direction:column; gap:20px;">
            <h3 style="font-family:'Cinzel'; color:#E9CF7A; margin-bottom:8px;">
                <i class="fas fa-crown"></i> Ramalan Mendalam untuk ${elements.userName.value.trim() || 'Sang Pencari'}
            </h3>
            
            <div style="background:#0F111A; border-radius:24px; padding:20px;">
                <p style="color:#C6A434; font-size:1.3rem; margin-bottom:8px;">
                    <i class="fas fa-heart"></i> Asmara
                </p>
                <p style="line-height:1.6;">${premium.love}</p>
            </div>
            
            <div style="background:#0F111A; border-radius:24px; padding:20px;">
                <p style="color:#C6A434; font-size:1.3rem; margin-bottom:8px;">
                    <i class="fas fa-briefcase"></i> Karir
                </p>
                <p style="line-height:1.6;">${premium.career}</p>
            </div>
            
            <div style="background:#0F111A; border-radius:24px; padding:20px;">
                <p style="color:#C6A434; font-size:1.3rem; margin-bottom:8px;">
                    <i class="fas fa-coins"></i> Keuangan
                </p>
                <p style="line-height:1.6;">${premium.finance}</p>
            </div>
            
            <div style="background:#0F111A; border-radius:24px; padding:20px;">
                <p style="color:#C6A434; font-size:1.3rem; margin-bottom:8px;">
                    <i class="fas fa-heartbeat"></i> Kesehatan
                </p>
                <p style="line-height:1.6;">${premium.health}</p>
            </div>
            
            <p style="margin-top:8px; text-align:right; font-style:italic;">— Telah dibuka dengan kunci semesta —</p>
            <p style="font-size:0.9rem; border-top:1px solid #3E3629; padding-top:16px;">
                <i class="fas fa-gem"></i> Fitur premium. (Simulasi berbayar, integrasikan dengan payment gateway)
            </p>
        </div>
    `;
    
    elements.premiumBox.innerHTML = html;
    elements.premiumBox.classList.remove('hidden');
    isPremium = true;
    
    elements.premiumBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ---------- INISIALISASI AWAL ----------
async function init() {
    console.log('🚀 Inisialisasi Primbon Hybrid...');
    
    // Setel DOM elements
    initDOMElements();
    
    // Set default date ke hari ini
    if (elements.birthDate) {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        elements.birthDate.value = `${yyyy}-${mm}-${dd}`;
    }
    
    // Load semua data dasar
    await loadAllData();
    
    // Event listener
    if (elements.submitBtn) {
        elements.submitBtn.addEventListener('click', handleReveal);
    }
    
    if (elements.unlockBtn) {
        elements.unlockBtn.addEventListener('click', handleUnlockPremium);
    }
    
    console.log('✅ Inisialisasi selesai. Website siap digunakan.');
}

// Jalankan inisialisasi setelah DOM siap
document.addEventListener('DOMContentLoaded', init);
