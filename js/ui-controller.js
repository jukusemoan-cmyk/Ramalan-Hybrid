// ================== UI CONTROLLER ==================
// File: js/ui-controller.js
// Versi: 2.0.0 - Final dengan Manuritas support
// Fungsi-fungsi umum untuk mengontrol tampilan

/**
 * Menampilkan atau menyembunyikan loading overlay
 * @param {boolean} show - true untuk tampilkan, false untuk sembunyikan
 */
function showLoading(show) {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) overlay.style.display = show ? 'flex' : 'none';
}

/**
 * Memperbarui tampilan sisa token di UI
 * Update semua elemen yang menampilkan token
 */
function updateTokenDisplay() {
    const balance = localStorage.getItem('tokenBalance') || '0';
    const token = parseInt(balance) || 0;
    
    // Update span token balance
    const span = document.getElementById('tokenBalanceSpan');
    if (span) span.textContent = balance;
    
    // Update tombol unlock Ramalan Lengkap
    const unlockPremiumBtn = document.getElementById('unlockPremiumBtn');
    if (unlockPremiumBtn) {
        unlockPremiumBtn.innerHTML = token >= 3 
            ? `<i class="fas fa-unlock"></i> BUKA RAMALAN LENGKAP (${token} Token tersedia)` 
            : `<i class="fas fa-shopping-cart"></i> BELI TOKEN UNTUK BUKA PREMIUM`;
    }
    
    // Update tombol unlock Manuritas Premium
    const unlockManuritasBtn = document.getElementById('unlockManuritasBtn');
    if (unlockManuritasBtn) {
        unlockManuritasBtn.innerHTML = token >= 3 
            ? `<i class="fas fa-unlock"></i> BUKA ANALISIS MANURITAS LENGKAP (${token} Token tersedia)` 
            : `<i class="fas fa-lock"></i> BUKA ANALISIS MANURITAS LENGKAP (3 Token)`;
    }
    
    // Update tombol premium di halaman kecocokan
    const premiumBtn = document.getElementById('premiumBtn');
    if (premiumBtn) {
        if (token >= 3) {
            premiumBtn.innerHTML = `<i class="fas fa-unlock"></i> BUKA ANALISIS MENDALAM (${token} Token tersedia)`;
        } else {
            premiumBtn.innerHTML = '<i class="fas fa-shopping-cart"></i> BELI TOKEN UNTUK BUKA PREMIUM';
        }
    }
    
    // Update token display di halaman pricing (jika ada)
    const currentTokenSpan = document.getElementById('currentTokenSpan');
    if (currentTokenSpan) currentTokenSpan.textContent = balance;
    
    // Update tombol-tombol generator (jika ada)
    updateGeneratorButtons(token);
}

/**
 * Update tampilan tombol generator berdasarkan token
 * @param {number} token - Jumlah token
 */
function updateGeneratorButtons(token) {
    // Silver button (5 token)
    const silverBtn = document.querySelector('[onclick*="loadNameOptions(\'silver\')"]');
    if (silverBtn) {
        if (token >= 5) {
            silverBtn.disabled = false;
            silverBtn.style.opacity = '1';
        } else {
            silverBtn.disabled = true;
            silverBtn.style.opacity = '0.5';
        }
    }
    
    // Gold button (10 token)
    const goldBtn = document.querySelector('[onclick*="loadNameOptions(\'gold\')"]');
    if (goldBtn) {
        if (token >= 10) {
            goldBtn.disabled = false;
            goldBtn.style.opacity = '1';
        } else {
            goldBtn.disabled = true;
            goldBtn.style.opacity = '0.5';
        }
    }
    
    // Platinum button (20 token)
    const platinumBtn = document.querySelector('[onclick*="loadNameOptions(\'platinum\')"]');
    if (platinumBtn) {
        if (token >= 20) {
            platinumBtn.disabled = false;
            platinumBtn.style.opacity = '1';
        } else {
            platinumBtn.disabled = true;
            platinumBtn.style.opacity = '0.5';
        }
    }
}

/**
 * Menampilkan toast notifikasi sukses
 * @param {string} message - Pesan yang akan ditampilkan
 */
function showSuccessToast(message) {
    const toast = document.createElement('div');
    toast.className = 'success-toast';
    toast.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 5000);
}

/**
 * Menampilkan toast notifikasi error
 * @param {string} message - Pesan error
 */
function showErrorToast(message) {
    const toast = document.createElement('div');
    toast.className = 'success-toast';
    toast.style.background = '#8B0000';
    toast.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 5000);
}

/**
 * Menampilkan toast notifikasi info
 * @param {string} message - Pesan info
 */
function showInfoToast(message) {
    const toast = document.createElement('div');
    toast.className = 'success-toast';
    toast.style.background = '#0077B6';
    toast.innerHTML = `<i class="fas fa-info-circle"></i> ${message}`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 5000);
}

/**
 * Menyimpan nama user ke localStorage
 * @param {string} name - Nama user
 */
function saveUserName(name) {
    if (name) localStorage.setItem('userName', name);
}

/**
 * Mengambil nama user dari localStorage
 * @returns {string} - Nama user atau 'Sang Pencari'
 */
function getUserName() {
    return localStorage.getItem('userName') || 'Sang Pencari';
}

/**
 * Mengecek apakah user memiliki token minimal
 * @param {number} amount - Jumlah token minimal (default: 1)
 * @returns {boolean} - true jika token >= amount
 */
function hasToken(amount = 1) {
    return (parseInt(localStorage.getItem('tokenBalance') || '0')) >= amount;
}

/**
 * Mengurangi token
 * @param {number} amount - Jumlah token yang dikurangi (default: 1)
 * @returns {number} - Sisa token setelah dikurangi
 */
function deductToken(amount = 1) {
    let balance = parseInt(localStorage.getItem('tokenBalance') || '0');
    if (balance >= amount) {
        balance -= amount;
        localStorage.setItem('tokenBalance', balance);
    }
    updateTokenDisplay();
    return balance;
}

/**
 * Menambah token
 * @param {number} amount - Jumlah token yang ditambahkan
 * @returns {number} - Total token setelah ditambah
 */
function addTokens(amount) {
    let balance = parseInt(localStorage.getItem('tokenBalance') || '0');
    balance += amount;
    localStorage.setItem('tokenBalance', balance);
    updateTokenDisplay();
    return balance;
}

/**
 * Menampilkan modal konfirmasi
 * @param {string} title - Judul modal
 * @param {string} message - Pesan modal
 * @param {Function} onConfirm - Callback jika dikonfirmasi
 * @param {Function} onCancel - Callback jika dibatalkan
 */
function showConfirmModal(title, message, onConfirm, onCancel) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>${title}</h3>
            <p>${message}</p>
            <div class="modal-buttons">
                <button class="btn-secondary" id="modalCancel">Batal</button>
                <button class="btn-primary" id="modalConfirm">OK</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    document.getElementById('modalConfirm').onclick = () => {
        modal.remove();
        if (onConfirm) onConfirm();
    };
    
    document.getElementById('modalCancel').onclick = () => {
        modal.remove();
        if (onCancel) onCancel();
    };
}

/**
 * Scroll ke elemen dengan smooth behavior
 * @param {string|HTMLElement} element - ID elemen atau elemen DOM
 */
function scrollToElement(element) {
    const el = typeof element === 'string' ? document.getElementById(element) : element;
    if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// Expose ke global
window.showLoading = showLoading;
window.updateTokenDisplay = updateTokenDisplay;
window.showSuccessToast = showSuccessToast;
window.showErrorToast = showErrorToast;
window.showInfoToast = showInfoToast;
window.saveUserName = saveUserName;
window.getUserName = getUserName;
window.hasToken = hasToken;
window.deductToken = deductToken;
window.addTokens = addTokens;
window.showConfirmModal = showConfirmModal;
window.scrollToElement = scrollToElement;

console.log('✅ ui-controller.js v2.0.0 loaded');
