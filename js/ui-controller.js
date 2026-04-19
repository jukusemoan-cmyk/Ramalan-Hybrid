// ================== UI CONTROLLER ==================
// File: js/ui-controller.js
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
 */
function updateTokenDisplay() {
    const balance = localStorage.getItem('tokenBalance') || '0';
    const span = document.getElementById('tokenBalanceSpan');
    if (span) span.textContent = balance;
    
    const btn = document.getElementById('unlockPremiumBtn');
    if (btn) {
        const token = parseInt(balance) || 0;
        if (token > 0) {
            btn.innerHTML = `<i class="fas fa-unlock"></i> BUKA RAMALAN LENGKAP (${token} Token tersedia)`;
        } else {
            btn.innerHTML = '<i class="fas fa-shopping-cart"></i> BELI TOKEN UNTUK BUKA PREMIUM';
        }
    }
    
    // Update juga untuk halaman kecocokan
    const premiumBtn = document.getElementById('premiumBtn');
    if (premiumBtn) {
        const token = parseInt(balance) || 0;
        if (token > 0) {
            premiumBtn.innerHTML = `<i class="fas fa-unlock"></i> BUKA ANALISIS MENDALAM (${token} Token tersedia)`;
        } else {
            premiumBtn.innerHTML = '<i class="fas fa-shopping-cart"></i> BELI TOKEN UNTUK BUKA PREMIUM';
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
 * Mengecek apakah user memiliki token
 * @returns {boolean} - true jika token > 0
 */
function hasToken() {
    return (parseInt(localStorage.getItem('tokenBalance') || '0')) > 0;
}

/**
 * Mengurangi token sebanyak 1
 * @returns {number} - Sisa token setelah dikurangi
 */
function deductToken() {
    let balance = parseInt(localStorage.getItem('tokenBalance') || '0');
    if (balance > 0) {
        balance -= 1;
        localStorage.setItem('tokenBalance', balance);
    }
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
    return balance;
}
