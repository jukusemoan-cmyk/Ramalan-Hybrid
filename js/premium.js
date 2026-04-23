// ================== PREMIUM CONTROLLER (VERSI GRATIS) ==================
// File: js/premium.js
// Semua fitur GRATIS, tidak perlu token

function checkPaymentSuccess() {
    // Tidak perlu cek payment success lagi
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('payment_success') === '1') {
        window.history.replaceState({}, document.title, window.location.pathname);
    }
}

function handleTokenUnlock(tokenCost, successCallback, redirectUrl = 'pricing.html', savePending = true) {
    // ✅ GRATIS - Selalu panggil callback
    if (successCallback) successCallback();
    return true;
}

function handlePremiumUnlock(displayCallback) {
    // ✅ GRATIS
    if (displayCallback) displayCallback();
    if (typeof showSuccessToast === 'function') {
        showSuccessToast(`✨ Ramalan Lengkap dibuka!`);
    }
    return true;
}

function handleManuritasUnlock(displayCallback) {
    // ✅ GRATIS
    if (displayCallback) displayCallback();
    if (typeof showSuccessToast === 'function') {
        showSuccessToast(`✨ Analisis Manuritas Lengkap dibuka!`);
    }
    return true;
}

function handlePustakaUnlock(lockArea, contentArea) {
    // ✅ GRATIS
    lockArea.classList.add('hidden');
    contentArea.classList.remove('hidden');
    return true;
}

function handleGeneratorPurchase(packageType, successCallback) {
    // ✅ GRATIS
    if (successCallback) successCallback();
    return true;
}

function savePendingPurchase(plan, tokens, orderId) {
    // Tidak perlu simpan apa-apa
}

function hasPremiumAccess(requiredTokens = 1) {
    // ✅ GRATIS - Selalu return true
    return true;
}

function getTokenBalance() {
    // Return 999 sebagai simbol unlimited
    return 999;
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

console.log('✅ premium.js v3.0.0 (GRATIS) loaded');
