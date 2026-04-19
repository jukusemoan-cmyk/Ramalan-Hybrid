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
    
    let planName = '', planPrice = '';
    if (plan === 'coba') { planName = 'Paket Coba'; planPrice = 'Rp5.000'; }
    else if (plan === 'hemat') { planName = 'Paket Hemat'; planPrice = 'Rp20.000'; }
    else if (plan === 'sultan') { planName = 'Paket Sultan'; planPrice = 'Rp50.000'; }
    
    document.getElementById('planName').textContent = planName;
    document.getElementById('planPrice').textContent = planPrice;
    
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
    if (currentSelectedPlan === 'coba') { amount = 5000; tokens = 3; planName = 'Paket Coba'; }
    else if (currentSelectedPlan === 'hemat') { amount = 20000; tokens = 15; planName = 'Paket Hemat'; }
    else if (currentSelectedPlan === 'sultan') { amount = 50000; tokens = 50; planName = 'Paket Sultan'; }
    
    const orderId = 'TOKEN-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7);
    
    isLoading = true;
    const container = document.getElementById('paymentMethodsContainer');
    container.innerHTML = '<div style="text-align:center; padding:20px;"><div class="spinner"></div><p>Menghubungkan ke Midtrans...</p></div>';
    
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
                customer_name: getUserName()
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

function initPricing() {
    updateTokenDisplay();
    
    // Cek apakah user sudah punya token
    const tokenBalance = localStorage.getItem('tokenBalance') || '0';
    const tokenSpan = document.getElementById('tokenBalanceAmount');
    if (tokenSpan) tokenSpan.textContent = tokenBalance;
}
