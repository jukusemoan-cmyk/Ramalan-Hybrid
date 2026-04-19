// ================== PREMIUM CONTROLLER ==================
// File: js/premium.js
// Fungsi untuk menangani konten premium dan pembayaran

/**
 * Mengecek apakah ada parameter payment_success di URL dan menambah token
 */
function checkPaymentSuccess() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('payment_success') === '1') {
        const pendingTokens = parseInt(localStorage.getItem('pendingTokens') || '0');
        const pendingPlan = localStorage.getItem('pendingPlan');
        
        if (pendingTokens > 0) {
            const currentBalance = addTokens(pendingTokens);
            
            localStorage.removeItem('pendingTokens');
            localStorage.removeItem('pendingPlan');
            localStorage.removeItem('pendingOrderId');
            
            showSuccessToast(`🎉 Selamat! ${pendingTokens} Token telah ditambahkan! Total: ${currentBalance} Token.`);
            updateTokenDisplay();
        }
        
        // Hapus parameter dari URL
        window.history.replaceState({}, document.title, window.location.pathname);
    }
}

/**
 * Handler untuk tombol unlock premium (sistem token)
 * @param {Function} displayCallback - Fungsi untuk menampilkan konten premium
 * @returns {boolean} - true jika berhasil, false jika token habis
 */
function handlePremiumUnlock(displayCallback) {
    if (hasToken()) {
        const remaining = deductToken();
        displayCallback();
        updateTokenDisplay();
        showSuccessToast(`✅ 1 Token digunakan. Sisa ${remaining} Token.`);
        return true;
    } else {
        if (confirm('Token Anda habis. Ingin membeli token sekarang?')) {
            window.location.href = 'pricing.html';
        }
        return false;
    }
}

/**
 * Handler untuk tombol unlock di halaman pustaka (modal)
 * @param {HTMLElement} lockArea - Elemen area kunci
 * @param {HTMLElement} contentArea - Elemen area konten
 * @returns {boolean} - true jika berhasil
 */
function handlePustakaUnlock(lockArea, contentArea) {
    if (hasToken()) {
        const remaining = deductToken();
        lockArea.classList.add('hidden');
        contentArea.classList.remove('hidden');
        updateTokenDisplay();
        showSuccessToast(`✅ 1 Token digunakan. Sisa ${remaining} Token.`);
        return true;
    } else {
        if (confirm('Token Anda habis. Ingin membeli token sekarang?')) {
            window.location.href = 'pricing.html';
        }
        return false;
    }
}
