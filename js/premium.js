// ================== PREMIUM CONTROLLER ==================
// File: js/premium.js
// Versi: 2.0.0 - Final dengan Manuritas support
// Fungsi untuk menangani konten premium, token, dan pembayaran

/**
 * Mengecek apakah ada parameter payment_success di URL dan menambah token
 * Juga menangani pending action setelah pembelian
 */
function checkPaymentSuccess() {
    const urlParams = new URLSearchParams(window.location.search);
    
    if (urlParams.get('payment_success') === '1') {
        const pendingTokens = parseInt(localStorage.getItem('pendingTokens') || '0');
        const pendingPlan = localStorage.getItem('pendingPlan');
        
        if (pendingTokens > 0) {
            const currentBalance = addTokens(pendingTokens);
            
            // Bersihkan data pending
            localStorage.removeItem('pendingTokens');
            localStorage.removeItem('pendingPlan');
            localStorage.removeItem('pendingOrderId');
            
            showSuccessToast(` Selamat! ${pendingTokens} Token telah ditambahkan! Total: ${currentBalance} Token.`);
            updateTokenDisplay();
            
            // Cek apakah ada pending action yang perlu dilanjutkan
            const pendingAction = localStorage.getItem('pendingAction');
            const pendingUserName = localStorage.getItem('pendingUserName');
            const pendingBirthDate = localStorage.getItem('pendingBirthDate');
            const pendingFullName = localStorage.getItem('pendingFullName');
            
            if (pendingAction === 'ramalan') {
                // Kembalikan data form
                if (pendingUserName) {
                    const userNameInput = document.getElementById('userName');
                    if (userNameInput) userNameInput.value = pendingUserName;
                }
                if (pendingBirthDate) {
                    const birthDateInput = document.getElementById('birthDate');
                    if (birthDateInput) birthDateInput.value = pendingBirthDate;
                }
                if (pendingFullName) {
                    const fullNameInput = document.getElementById('fullName');
                    if (fullNameInput) fullNameInput.value = pendingFullName;
                }
                
                // Bersihkan pending data
                localStorage.removeItem('pendingAction');
                localStorage.removeItem('pendingUserName');
                localStorage.removeItem('pendingBirthDate');
                localStorage.removeItem('pendingFullName');
                
                // Trigger reveal jika ada fungsi
                setTimeout(() => {
                    if (typeof handleReveal === 'function') {
                        handleReveal();
                    }
                }, 500);
            }
        }
        
        // Hapus parameter dari URL
        window.history.replaceState({}, document.title, window.location.pathname);
    }
}

/**
 * Handler umum untuk unlock dengan token
 * @param {number} tokenCost - Jumlah token yang dibutuhkan
 * @param {Function} successCallback - Fungsi yang dijalankan jika berhasil
 * @param {string} redirectUrl - URL redirect jika token kurang (default: 'pricing.html')
 * @param {boolean} savePending - Simpan state untuk kembali setelah pembelian
 * @returns {boolean} - true jika berhasil, false jika gagal
 */
function handleTokenUnlock(tokenCost, successCallback, redirectUrl = 'pricing.html', savePending = true) {
    const currentBalance = parseInt(localStorage.getItem('tokenBalance') || '0');
    
    if (currentBalance >= tokenCost) {
        // Potong token
        const newBalance = currentBalance - tokenCost;
        localStorage.setItem('tokenBalance', newBalance);
        
        // Jalankan callback
        if (successCallback) successCallback();
        
        // Update UI
        updateTokenDisplay();
        showSuccessToast(` ${tokenCost} Token digunakan. Sisa ${newBalance} Token.`);
        
        return true;
    } else {
        // Simpan state jika diperlukan
        if (savePending) {
            const userName = document.getElementById('userName')?.value || '';
            const birthDate = document.getElementById('birthDate')?.value || '';
            const fullName = document.getElementById('fullName')?.value || '';
            
            localStorage.setItem('pendingAction', 'ramalan');
            if (userName) localStorage.setItem('pendingUserName', userName);
            if (birthDate) localStorage.setItem('pendingBirthDate', birthDate);
            if (fullName) localStorage.setItem('pendingFullName', fullName);
        }
        
        // Tampilkan konfirmasi
        if (confirm(`Anda membutuhkan ${tokenCost} Token. Token Anda: ${currentBalance}. Ingin membeli token sekarang?`)) {
            window.location.href = redirectUrl;
        }
        
        return false;
    }
}

/**
 * Handler untuk tombol unlock premium ramalan (3 token)
 * @param {Function} displayCallback - Fungsi untuk menampilkan konten premium
 * @returns {boolean} - true jika berhasil
 */
function handlePremiumUnlock(displayCallback) {
    return handleTokenUnlock(3, displayCallback, 'pricing.html', true);
}

/**
 * Handler untuk tombol unlock Manuritas Premium (3 token)
 * @param {Function} displayCallback - Fungsi untuk menampilkan konten Manuritas Premium
 * @returns {boolean} - true jika berhasil
 */
function handleManuritasUnlock(displayCallback) {
    return handleTokenUnlock(3, displayCallback, 'pricing.html', true);
}

/**
 * Handler untuk tombol unlock di halaman pustaka (1 token)
 * @param {HTMLElement} lockArea - Elemen area kunci
 * @param {HTMLElement} contentArea - Elemen area konten
 * @returns {boolean} - true jika berhasil
 */
function handlePustakaUnlock(lockArea, contentArea) {
    return handleTokenUnlock(1, () => {
        lockArea.classList.add('hidden');
        contentArea.classList.remove('hidden');
    }, 'pricing.html', false);
}

/**
 * Handler untuk membeli paket generator nama
 * @param {string} packageType - 'silver', 'gold', atau 'platinum'
 * @param {Function} successCallback - Fungsi jika berhasil
 * @returns {boolean} - true jika berhasil
 */
function handleGeneratorPurchase(packageType, successCallback) {
    const costs = { silver: 5, gold: 10, platinum: 20 };
    const tokenCost = costs[packageType] || 5;
    
    return handleTokenUnlock(tokenCost, successCallback, 'pricing.html', true);
}

/**
 * Menyimpan data pembelian untuk diproses setelah pembayaran
 * @param {string} plan - Nama paket
 * @param {number} tokens - Jumlah token
 * @param {string} orderId - ID order
 */
function savePendingPurchase(plan, tokens, orderId) {
    localStorage.setItem('pendingPlan', plan);
    localStorage.setItem('pendingTokens', tokens);
    localStorage.setItem('pendingOrderId', orderId);
}

/**
 * Cek apakah user memiliki akses premium (token cukup)
 * @param {number} requiredTokens - Token yang dibutuhkan
 * @returns {boolean}
 */
function hasPremiumAccess(requiredTokens = 1) {
    const balance = parseInt(localStorage.getItem('tokenBalance') || '0');
    return balance >= requiredTokens;
}

/**
 * Mendapatkan sisa token user
 * @returns {number}
 */
function getTokenBalance() {
    return parseInt(localStorage.getItem('tokenBalance') || '0');
}

// Expose ke global
window.checkPaymentSuccess = checkPaymentSuccess;
window.handleTokenUnlock = handleTokenUnlock;
window.handlePremiumUnlock = handlePremiumUnlock;
window.handleManuritasUnlock = handleManuritasUnlock;
window.handlePustakaUnlock = handlePustakaUnlock;
window.handleGeneratorPurchase = handleGeneratorPurchase;
window.savePendingPurchase = savePendingPurchase;
window.hasPremiumAccess = hasPremiumAccess;
window.getTokenBalance = getTokenBalance;

console.log(' premium.js v2.0.0 loaded');
