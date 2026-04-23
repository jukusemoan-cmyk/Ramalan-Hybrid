// ================== PRICING / TOKEN ==================
// File: js/pricing.js
// Fungsi spesifik untuk halaman pembelian token

const WORKER_URL = 'https://pekerja-ramalan.jukusemoan.workers.dev';
let currentSelectedPlan = null;
let isLoading = false;

const paymentMethods = [
    { id: 'qris', name: 'QRIS', icon: 'fa-qrcode' },
    { id: 'gopay', name: 'GoPay', icon: 'fa-wallet' },
    { id: 'ovo', name: 'OVO', icon: 'fa-mobile-alt' },
    { id: 'dana', name: 'DANA', icon: 'fa-money-bill-wave' },
    { id: 'bank_transfer', name: 'Transfer Bank', icon: 'fa-university' }
];

function renderPaymentMethods() {
    const container = document.getElementById('paymentMethodsContainer');
    if (!container) return;
    
    container.innerHTML = paymentMethods.map(m => `
        <div class="payment-method" onclick="processPayment('${m.id}')">
            <i class="fas ${m.icon}"></i>
            <div>${m.name}</div>
        </div>
    `).join('');
}

function selectPlan(plan) {
    currentSelectedPlan = plan;
    
    let planName = '', planPrice = '', tokenAmount = '';
    if (plan === 'coba') { 
        planName = 'Paket Coba'; 
        planPrice = 'Rp50.000'; 
        tokenAmount = '30 Token';
    } else if (plan === 'hemat') { 
        planName = 'Paket Hemat'; 
        planPrice = 'Rp100.000'; 
        tokenAmount = '75 Token';
    } else if (plan === 'sultan') { 
        planName = 'Paket Sultan'; 
        planPrice = 'Rp200.000'; 
        tokenAmount = '200 Token';
    }
    
    // Update modal display
    const planNameEl = document.getElementById('planName');
    const planPriceEl = document.getElementById('planPrice');
    const selectedPackageDisplay = document.getElementById('selectedPackageDisplay');
    
    if (planNameEl) planNameEl.textContent = planName;
    if (planPriceEl) planPriceEl.textContent = planPrice;
    if (selectedPackageDisplay) {
        selectedPackageDisplay.textContent = `${planName} • ${tokenAmount} • ${planPrice}`;
    }
    
    renderPaymentMethods();
    document.getElementById('paymentModal').classList.remove('hidden');
}

function closePaymentModal() {
    if (!isLoading) {
        document.getElementById('paymentModal').classList.add('hidden');
    }
}

async function processPayment(method) {
    if (!currentSelectedPlan || isLoading) return;
    
    let amount = 0, tokens = 0, planName = '';
    if (currentSelectedPlan === 'coba') { 
        amount = 50000; 
        tokens = 30; 
        planName = 'Paket Coba'; 
    } else if (currentSelectedPlan === 'hemat') { 
        amount = 100000; 
        tokens = 75; 
        planName = 'Paket Hemat'; 
    } else if (currentSelectedPlan === 'sultan') { 
        amount = 200000; 
        tokens = 200; 
        planName = 'Paket Sultan'; 
    }
    
    const orderId = 'TOKEN-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7);
    
    // Simpan state form jika ada
    const savedName = localStorage.getItem('temp_userName');
    const savedBirth = localStorage.getItem('temp_birthDate');
    const savedFullName = localStorage.getItem('temp_fullName');
    
    if (savedName || savedBirth || savedFullName) {
        localStorage.setItem('pendingUserName', savedName || '');
        localStorage.setItem('pendingBirthDate', savedBirth || '');
        localStorage.setItem('pendingFullName', savedFullName || '');
    }
    
    isLoading = true;
    const container = document.getElementById('paymentMethodsContainer');
    container.innerHTML = '<div style="text-align:center; padding:20px;"><div class="loading-spinner"></div><p>Menghubungkan ke Midtrans...</p></div>';
    
    try {
        const response = await fetch(`${WORKER_URL}/api/create-transaction`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                order_id: orderId,
                plan: currentSelectedPlan,
                plan_name: planName,
                amount: amount,
                tokens: tokens,
                payment_method: method,
                customer_name: localStorage.getItem('userName') || getUserName() || 'Pelanggan'
            })
        });
        
        const data = await response.json();
        
        if (data.redirect_url) {
            localStorage.setItem('pendingOrderId', orderId);
            localStorage.setItem('pendingTokens', tokens);
            localStorage.setItem('pendingPlan', currentSelectedPlan);
            window.location.href = data.redirect_url;
        } else {
            alert('Gagal membuat transaksi. Silakan coba lagi.');
            renderPaymentMethods();
            isLoading = false;
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Terjadi kesalahan jaringan. Periksa koneksi internet Anda.');
        renderPaymentMethods();
        isLoading = false;
    }
}

// Helper function untuk mendapatkan nama user
function getUserName() {
    return localStorage.getItem('userName') || 
           localStorage.getItem('temp_userName') || 
           'Pelanggan';
}

function initPricing() {
    updateTokenDisplay();
    
    // Cek apakah user sudah punya token
    const tokenBalance = localStorage.getItem('tokenBalance') || '0';
    const tokenSpan = document.getElementById('tokenBalanceAmount');
    if (tokenSpan) tokenSpan.textContent = tokenBalance;
}

// Expose functions to global
window.selectPlan = selectPlan;
window.closePaymentModal = closePaymentModal;
window.processPayment = processPayment;
window.renderPaymentMethods = renderPaymentMethods;
