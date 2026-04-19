// ================== PUSTAKA PRIMBON ==================
// File: js/pustaka.js
// Fungsi spesifik untuk halaman Pustaka

let calendarData = null;
let currentTab = 'wuku';
let currentDetailItem = null;

/**
 * Render konten berdasarkan tab dan pencarian
 */
function renderPustakaContent() {
    if (!calendarData) return;
    
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    let items = [];
    
    if (currentTab === 'wuku') items = calendarData.wuku;
    else if (currentTab === 'saptawara') items = calendarData.saptawara;
    else if (currentTab === 'pancawara') items = calendarData.pancawara;
    else if (currentTab === 'triwara') items = calendarData.wewaran_dasar?.tri_wara || [];
    else if (currentTab === 'hariraya') items = calendarData.hari_raya || [];
    
    const filtered = items.filter(item => 
        item.name.toLowerCase().includes(searchTerm) || 
        (item.meaning || '').toLowerCase().includes(searchTerm) ||
        (item.character || '').toLowerCase().includes(searchTerm)
    );
    
    const html = filtered.map(item => `
        <div class="pustaka-card" onclick="showPustakaDetail('${currentTab}', '${item.name}')">
            <h3>${item.name}</h3>
            <div style="color:#A0A0B0;">${item.meaning || item.alias || ''}</div>
            <p style="margin-top:8px; font-size:0.9rem;">${(item.character || item.description || '').substring(0, 60)}...</p>
        </div>
    `).join('');
    
    document.getElementById('contentArea').innerHTML = html || '<p style="text-align:center; grid-column:1/-1;">Tidak ditemukan</p>';
}

/**
 * Menampilkan detail item di modal
 */
function showPustakaDetail(type, name) {
    let item;
    if (type === 'wuku') item = calendarData.wuku.find(w => w.name === name);
    else if (type === 'saptawara') item = calendarData.saptawara.find(s => s.name === name);
    else if (type === 'pancawara') item = calendarData.pancawara.find(p => p.name === name);
    else if (type === 'triwara') item = calendarData.wewaran_dasar.tri_wara.find(t => t.name === name);
    else if (type === 'hariraya') item = calendarData.hari_raya.find(h => h.name === name);
    if (!item) return;
    
    currentDetailItem = { type, item };
    
    let basicHtml = `
        <h2 style="color:#D4AF37; margin-bottom:20px;">${item.name}</h2>
        <p><strong>Makna:</strong> ${item.meaning || item.alias || '-'}</p>
        <p style="margin-top:12px;"><strong>Deskripsi:</strong> ${item.character || item.description || '-'}</p>
    `;
    
    if (type === 'wuku') {
        basicHtml += `
            <p style="margin-top:12px;"><i class="fas fa-check-circle" style="color:#D4AF37;"></i> <strong>Aktivitas Baik:</strong> ${item.activity || '-'}</p>
            <p style="margin-top:12px;"><i class="fas fa-ban" style="color:#D4AF37;"></i> <strong>Pantangan:</strong> ${item.forbidden_direction || '-'}</p>
            <p style="margin-top:12px;"><i class="fas fa-leaf" style="color:#D4AF37;"></i> <strong>Elemen:</strong> ${item.element || '-'}</p>
        `;
    }
    
    if (type === 'triwara') {
        basicHtml += `<p style="margin-top:12px;"><i class="fas fa-tasks" style="color:#D4AF37;"></i> <strong>Rekomendasi Aktivitas:</strong> ${item.activity || '-'}</p>`;
    }
    
    document.getElementById('modalBody').innerHTML = basicHtml;
    
    // Konten premium
    const premiumHtml = `
        <div style="margin-top:24px; padding-top:24px; border-top:1px solid rgba(212,175,55,0.2);">
            <h4 style="color:#D4AF37;"><i class="fas fa-crown"></i> Pengetahuan Premium</h4>
            <p style="margin-top:12px;"><strong>Ritual yang Disarankan:</strong> ${getPremiumRitual(type, item)}</p>
            <p style="margin-top:12px;"><strong>Mantra / Doa:</strong> ${getPremiumMantra(type, item)}</p>
            <p style="margin-top:12px;"><strong>Filosofi Mendalam:</strong> ${getPremiumPhilosophy(type, item)}</p>
        </div>
    `;
    
    document.getElementById('premiumContentArea').innerHTML = premiumHtml;
    
    // Cek status token
    const hasTokenUnlocked = hasToken();
    document.getElementById('premiumLockArea').classList.toggle('hidden', hasTokenUnlocked);
    document.getElementById('premiumContentArea').classList.toggle('hidden', !hasTokenUnlocked);
    
    document.getElementById('detailModal').classList.remove('hidden');
}

function closePustakaModal() {
    document.getElementById('detailModal').classList.add('hidden');
}

function getPremiumRitual(type, item) {
    if (type === 'wuku') return `Pada Wuku ${item.name}, dianjurkan melakukan upacara kecil dengan sesajen canang sari dan bunga ${item.element === 'Api' ? 'merah' : item.element === 'Air' ? 'putih' : 'kuning'}.`;
    if (type === 'hariraya') return `Saat ${item.name}, lakukan persembahyangan dan meditasi. ${item.description}`;
    return 'Lakukan meditasi singkat di pagi hari menghadap matahari terbit.';
}

function getPremiumMantra(type, item) {
    if (type === 'wuku') return `"Om ${item.meaning.replace('Dewa ', '')} Ya Namah" – diucapkan 108 kali untuk memohon perlindungan.`;
    if (type === 'hariraya') return `"Om Swastiastu, semoga berkah ${item.name} membersihkan jiwa raga."`;
    return '"Om Swastiastu" – ucapkan dengan hati tulus sebelum memulai aktivitas.';
}

function getPremiumPhilosophy(type, item) {
    if (type === 'wuku') return `${item.name} mengajarkan kita tentang ${item.character?.split(',')[0] || 'keseimbangan'}. Dalam lontar kuno, energi ini selaras dengan perjalanan spiritual menuju pencerahan.`;
    if (type === 'hariraya') return `${item.name} adalah momen sakral untuk merenungkan ${item.description.toLowerCase()}. Filosofinya mengajak kita kembali ke esensi diri.`;
    return 'Setiap elemen dalam Wariga adalah cerminan dari hukum alam (Rta). Memahaminya berarti menyelaraskan diri dengan ritme semesta.';
}

/**
 * Inisialisasi halaman Pustaka
 */
async function initPustaka() {
    try {
        const data = await loadAllData();
        calendarData = data.calendar;
        renderPustakaContent();
    } catch(e) {
        alert('Gagal memuat data kalender.');
        return;
    }
    
    updateTokenDisplay();
    
    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentTab = btn.dataset.tab;
            renderPustakaContent();
        });
    });
    
    document.getElementById('searchInput').addEventListener('input', renderPustakaContent);
    
    document.getElementById('unlockPremiumDetail').addEventListener('click', () => {
        const lockArea = document.getElementById('premiumLockArea');
        const contentArea = document.getElementById('premiumContentArea');
        handlePustakaUnlock(lockArea, contentArea);
    });
}
