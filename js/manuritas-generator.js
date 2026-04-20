// ================== MANURITAS GENERATOR ==================
// File: js/manuritas-generator.js
// Fungsi untuk generate nama selaras dan fitur pembelian

// ---------- 1. FUNGSI GENERATE NAMA BARU ----------

/**
 * Menghasilkan opsi nama baru berdasarkan target persentase
 * @param {string} originalName - Nama asli user
 * @param {number} currentScore - Persentase kekuatan nama saat ini
 * @param {number} targetScore - Target persentase yang diinginkan
 * @param {object} weton - Data weton user
 * @param {object} wuku - Data wuku user
 * @param {array} positiveSyllables - Daftar suku kata positif dari JSON
 * @returns {array} - Array opsi nama baru
 */
function generateNameOptions(originalName, currentScore, targetScore, weton, wuku, positiveSyllables) {
    const options = [];
    const baseName = originalName.split(' ')[0]; // Ambil nama pertama sebagai dasar
    const syllables = positiveSyllables.templates || positiveSyllables;
    
    // Tentukan jumlah opsi berdasarkan paket
    let optionCount = 3;
    if (targetScore >= 90) optionCount = 2;  // Platinum: lebih sedikit tapi berkualitas
    else if (targetScore >= 80) optionCount = 4; // Gold: lebih banyak pilihan
    
    // Generate opsi dengan kombinasi berbeda
    for (let i = 0; i < optionCount; i++) {
        const randomSyllable = syllables[Math.floor(Math.random() * syllables.length)];
        const randomSyllable2 = syllables[Math.floor(Math.random() * syllables.length)];
        
        let newName = '';
        let modificationType = '';
        
        if (targetScore >= 90) {
            // Platinum: modifikasi total
            if (i === 0) {
                newName = randomSyllable.syllable + ' ' + baseName + ' ' + randomSyllable2.syllable;
                modificationType = 'Kombinasi tiga suku kata selaras';
            } else {
                newName = randomSyllable.syllable + ' ' + baseName;
                modificationType = 'Penambahan suku kata pembuka';
            }
        } else if (targetScore >= 80) {
            // Gold: modifikasi sedang
            if (i === 0) {
                newName = baseName + ' ' + randomSyllable.syllable;
                modificationType = 'Penambahan nama belakang';
            } else if (i === 1) {
                newName = randomSyllable.syllable + ' ' + baseName;
                modificationType = 'Penambahan nama depan';
            } else if (i === 2) {
                newName = baseName.slice(0, -1) + 'a';
                modificationType = 'Modifikasi akhiran';
            } else {
                newName = baseName + ' ' + randomSyllable.syllable;
                modificationType = 'Penambahan suku kata selaras';
            }
        } else {
            // Silver: modifikasi ringan
            if (i === 0) {
                newName = baseName + ' ' + randomSyllable.syllable.slice(0, 3);
                modificationType = 'Penambahan suku kata pendek';
            } else if (i === 1) {
                newName = baseName.slice(0, -1) + 'i';
                modificationType = 'Perubahan vokal akhir';
            } else {
                newName = baseName + ' ' + randomSyllable.syllable;
                modificationType = 'Penambahan nama panggilan';
            }
        }
        
        // Hitung kekuatan nama baru (simulasi)
        const hanacarakaResult = hanacarakaValue(newName);
        const newStrength = calculateNameStrength(hanacarakaResult.total, weton.neptu, wuku);
        
        options.push({
            id: `option_${Date.now()}_${i}`,
            name: newName,
            strength: newStrength.score,
            strengthLabel: newStrength.label,
            modificationType: modificationType,
            hanacarakaTotal: hanacarakaResult.total,
            description: generateOptionDescription(newStrength.score, targetScore, modificationType)
        });
    }
    
    // Urutkan berdasarkan kekuatan tertinggi
    options.sort((a, b) => b.strength - a.strength);
    
    return options;
}

/**
 * Menghasilkan deskripsi untuk opsi nama
 */
function generateOptionDescription(score, targetScore, modificationType) {
    if (score >= targetScore) {
        return `✅ Nama ini mencapai target kekuatan ${targetScore}%. ${modificationType} berhasil meningkatkan getaran nama secara signifikan.`;
    } else if (score >= targetScore - 10) {
        return `🟡 Nama ini mendekati target dengan kekuatan ${score}%. ${modificationType} memberikan peningkatan yang cukup baik.`;
    } else {
        return `🔵 ${modificationType} memberikan kekuatan ${score}%. Meskipun belum mencapai target, ada peningkatan dari sebelumnya.`;
    }
}

// ---------- 2. FUNGSI PEMBELIAN NAMA ----------

/**
 * Variabel global untuk menyimpan opsi nama yang dipilih
 */
let selectedNameOption = null;
//let manuritasData = null; sudah dideklarasikan di ramalan.html

/**
 * Menampilkan opsi nama di UI (dipanggil setelah analisis gratis)
 */
function displayNameOptions(originalName, currentScore, weton, wuku, data) {
    manuritasData = data;
    
    const container = document.getElementById('nameOptionsContainer');
    if (!container) return;
    
    // Tentukan paket yang tersedia
    const packages = [
        { id: 'silver', name: '🥉 SILVER', target: 75, token: 5 },
        { id: 'gold', name: '🥈 GOLD', target: 85, token: 10 },
        { id: 'platinum', name: '🥇 PLATINUM', target: 95, token: 20 }
    ];
    
    let html = `<h4 style="color: #F3E5AB; margin-bottom: 20px;">🌟 Generator Nama Selaras</h4>`;
    html += `<p style="margin-bottom: 16px;">Nama Anda saat ini memiliki kekuatan <strong>${currentScore}%</strong>. Pilih paket untuk melihat opsi nama dengan kekuatan lebih tinggi.</p>`;
    
    packages.forEach(pkg => {
        if (currentScore < pkg.target) {
            html += `
                <div style="background: rgba(15,15,20,0.8); border-radius: 16px; padding: 20px; margin-bottom: 16px; border: 1px solid rgba(212,175,55,0.2);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                        <h5 style="color: #D4AF37; margin: 0;">${pkg.name} - Target ${pkg.target}%</h5>
                        <span style="color: #D4AF37;"><i class="fas fa-coins"></i> ${pkg.token} Token</span>
                    </div>
                    <button class="btn-premium" onclick="loadNameOptions('${pkg.id}', ${pkg.target}, ${pkg.token})" style="width: 100%; padding: 12px;">
                        <i class="fas fa-eye"></i> Lihat Opsi Nama
                    </button>
                </div>
            `;
        }
    });
    
    if (currentScore >= 95) {
        html += `<p style="color: #64C864;"><i class="fas fa-check-circle"></i> Nama Anda sudah sangat kuat (${currentScore}%). Tidak diperlukan modifikasi.</p>`;
    }
    
    container.innerHTML = html;
}

/**
 * Memuat opsi nama untuk paket tertentu
 */
async function loadNameOptions(packageId, targetScore, tokenCost) {
    const originalName = document.getElementById('fullName').value.trim();
    if (!originalName) {
        alert('Masukkan nama lengkap terlebih dahulu.');
        return;
    }
    
    if (!currentUserData || !manuritasData) {
        alert('Data belum lengkap. Silakan refresh halaman.');
        return;
    }
    
    // Cek token
    const currentBalance = parseInt(localStorage.getItem('tokenBalance') || '0');
    if (currentBalance < tokenCost) {
        if (confirm(`Token Anda tidak cukup (${currentBalance}/${tokenCost}). Ingin membeli token sekarang?`)) {
            window.location.href = 'pricing.html';
        }
        return;
    }
    
    // Hitung kekuatan saat ini
    const hanacarakaResult = hanacarakaValue(originalName);
    const currentStrength = calculateNameStrength(
        hanacarakaResult.total, 
        currentUserData.weton.neptu, 
        currentUserData.wuku
    );
    
    // Generate opsi
    const options = generateNameOptions(
        originalName,
        currentStrength.score,
        targetScore,
        currentUserData.weton,
        currentUserData.wuku,
        manuritasData.positiveSyllables
    );
    
    // Tampilkan opsi di modal
    displayOptionsModal(options, packageId, targetScore, tokenCost, originalName);
}

/**
 * Menampilkan modal dengan opsi nama
 */
function displayOptionsModal(options, packageId, targetScore, tokenCost, originalName) {
    // Buat modal jika belum ada
    let modal = document.getElementById('nameOptionsModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'nameOptionsModal';
        modal.className = 'payment-modal';
        document.body.appendChild(modal);
    }
    
    let html = `
        <div class="payment-content" style="max-width: 600px; max-height: 80vh; overflow-y: auto;">
            <h3 style="color: #D4AF37; margin-bottom: 20px;">
                <i class="fas fa-star"></i> Pilih Nama Selaras Anda
            </h3>
            <p style="margin-bottom: 20px;">Nama asli: <strong>${originalName}</strong> | Target: ${targetScore}%</p>
    `;
    
    options.forEach((opt, idx) => {
        html += `
            <div style="background: rgba(15,15,20,0.9); border-radius: 16px; padding: 20px; margin-bottom: 16px; border: 1px solid ${opt.strength >= targetScore ? '#64C864' : 'rgba(212,175,55,0.3)'};">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                    <h4 style="color: #F3E5AB; margin: 0;">${opt.name}</h4>
                    <span style="color: #D4AF37; font-weight: bold;">${opt.strength}% (${opt.strengthLabel})</span>
                </div>
                <p style="color: #A0A0B0; margin-bottom: 12px; font-size: 0.9rem;">${opt.description}</p>
                <p style="color: #A0A0B0; margin-bottom: 16px; font-size: 0.85rem;"><i class="fas fa-info-circle"></i> Nilai Hanacaraka: ${opt.hanacarakaTotal}</p>
                <button class="btn-premium" onclick="purchaseNameOption('${opt.name}', ${opt.strength}, ${tokenCost})" style="width: 100%; padding: 12px;">
                    <i class="fas fa-shopping-cart"></i> Beli Nama Ini (${tokenCost} Token)
                </button>
            </div>
        `;
    });
    
    html += `
            <button class="btn-pricing" onclick="closeNameOptionsModal()" style="margin-top: 16px; width: 100%;">Tutup</button>
        </div>
    `;
    
    modal.innerHTML = html;
    modal.classList.remove('hidden');
}

/**
 * Menutup modal opsi nama
 */
function closeNameOptionsModal() {
    const modal = document.getElementById('nameOptionsModal');
    if (modal) modal.classList.add('hidden');
}

/**
 * Memproses pembelian nama
 */
async function purchaseNameOption(selectedName, newStrength, tokenCost) {
    // Potong token
    let currentBalance = parseInt(localStorage.getItem('tokenBalance') || '0');
    if (currentBalance < tokenCost) {
        alert('Token tidak cukup.');
        return;
    }
    
    currentBalance -= tokenCost;
    localStorage.setItem('tokenBalance', currentBalance);
    updateTokenDisplay();
    
    // Tutup modal
    closeNameOptionsModal();
    
    // Simpan nama yang dibeli
    selectedNameOption = {
        name: selectedName,
        strength: newStrength,
        purchasedAt: new Date().toISOString()
    };
    
    // Tampilkan notifikasi sukses
    showSuccessToast(`🎉 Selamat! Anda telah membeli nama "${selectedName}" dengan kekuatan ${newStrength}%!`);
    
    // Tampilkan analisis lengkap untuk nama baru
    await displayManuritasResult(selectedName);
}

/**
 * Menampilkan analisis Manuritas lengkap untuk nama yang dibeli
 */
async function displayManuritasResult(fullName) {
    if (!currentUserData || !manuritasData) {
        alert('Data tidak lengkap.');
        return;
    }
    
    showLoading(true);
    
    try {
        // Hitung ulang analisis untuk nama baru
        const result = await calculateManuritas(
            fullName,
            currentUserData.weton,
            currentUserData.wuku,
            manuritasData
        );
        
        if (!result) {
            alert('Gagal menghitung analisis.');
            return;
        }
        
        // Tampilkan di modal hasil
        displayManuritasPremiumModal(result, true);
        
    } catch (e) {
        console.error('Gagal menampilkan hasil:', e);
        alert('Terjadi kesalahan.');
    } finally {
        showLoading(false);
    }
}

/**
 * Menampilkan modal hasil Manuritas Premium (untuk nama yang dibeli)
 */
function displayManuritasPremiumModal(result, isPurchased = false) {
    let modal = document.getElementById('manuritasResultModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'manuritasResultModal';
        modal.className = 'payment-modal';
        document.body.appendChild(modal);
    }
    
    const strength = result.strength;
    const tugas = result.tugasHidup;
    const watak = result.watak;
    const luka = result.titikLuka;
    const rezeki = result.jalurRezeki;
    const kelebihan = result.kelebihan || [];
    const kekurangan = result.kekurangan || [];
    const saran = result.saran || [];
    const peta = result.petaEnergi || { physical: [], psychological: [] };
    const extreme = result.extreme || [];
    
    let html = `
        <div class="payment-content" style="max-width: 700px; max-height: 85vh; overflow-y: auto; text-align: left;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h3 style="color: #D4AF37; margin: 0;">
                    <i class="fas fa-crown"></i> Hasil Analisis Nama Baru
                </h3>
                ${isPurchased ? '<span style="color: #64C864;"><i class="fas fa-check-circle"></i> Dibeli</span>' : ''}
            </div>
            
            <div style="background: rgba(15,15,20,0.9); border-radius: 16px; padding: 20px; margin-bottom: 20px; text-align: center;">
                <h2 style="color: #F3E5AB; margin-bottom: 8px;">${result.name}</h2>
                <div style="font-size: 3rem; color: #D4AF37; font-weight: bold;">${strength.score}%</div>
                <div style="color: #A0A0B0;">${strength.label} - ${strength.interpretation}</div>
                <div style="margin-top: 12px; color: #A0A0B0; font-size: 0.9rem;">Total Nilai Hanacaraka: ${result.hanacaraka.total}</div>
            </div>
            
            <!-- Tugas Hidup -->
            <div style="background: rgba(15,15,20,0.8); border-radius: 16px; padding: 20px; margin-bottom: 16px;">
                <h4 style="color: #D4AF37; margin-bottom: 12px;"><i class="fas fa-bullseye"></i> Tugas Hidup: ${tugas?.name || '-'}</h4>
                <p style="line-height: 1.7;">${tugas?.description || '-'}</p>
                ${tugas?.career ? `<p style="margin-top: 12px;"><strong>Karir yang cocok:</strong> ${tugas.career}</p>` : ''}
            </div>
            
            <!-- Watak Asli vs Topeng -->
            <div style="background: rgba(15,15,20,0.8); border-radius: 16px; padding: 20px; margin-bottom: 16px;">
                <h4 style="color: #D4AF37; margin-bottom: 12px;"><i class="fas fa-mask"></i> Watak Asli vs. Topeng Sosial: ${watak?.name || '-'}</h4>
                <p><strong>Watak Asli:</strong> ${watak?.watak_asli || '-'}</p>
                <p><strong>Topeng Sosial:</strong> ${watak?.topeng_sosial || '-'}</p>
                <p><strong>Dampak:</strong> ${watak?.impact || '-'}</p>
                <p><strong>Saran:</strong> ${watak?.advice || '-'}</p>
            </div>
            
            <!-- Titik Luka Batin -->
            <div style="background: rgba(15,15,20,0.8); border-radius: 16px; padding: 20px; margin-bottom: 16px;">
                <h4 style="color: #D4AF37; margin-bottom: 12px;"><i class="fas fa-heart-broken"></i> Titik Luka Batin (Usia ${luka?.age || '-'})</h4>
                <p><strong>Peristiwa:</strong> ${luka?.event || '-'}</p>
                <p><strong>Dampak:</strong> ${luka?.impact || '-'}</p>
                <p><strong>Penyembuhan:</strong> ${luka?.healing || '-'}</p>
            </div>
            
            <!-- Jalur Rezeki -->
            <div style="background: rgba(15,15,20,0.8); border-radius: 16px; padding: 20px; margin-bottom: 16px;">
                <h4 style="color: #D4AF37; margin-bottom: 12px;"><i class="fas fa-coins"></i> Jalur Rezeki: ${rezeki?.name || '-'}</h4>
                <p><strong>Sumber:</strong> ${rezeki?.source || '-'}</p>
                <p><strong>Bidang cocok:</strong> ${rezeki?.fields?.join(', ') || '-'}</p>
                <p>${rezeki?.description || '-'}</p>
            </div>
            
            <!-- Kelebihan Nama -->
            ${kelebihan.length > 0 ? `
            <div style="background: rgba(15,15,20,0.8); border-radius: 16px; padding: 20px; margin-bottom: 16px;">
                <h4 style="color: #64C864; margin-bottom: 12px;"><i class="fas fa-check-circle"></i> Kelebihan Nama</h4>
                ${kelebihan.map(k => `<p style="margin-bottom: 8px;">• ${k.text}</p>`).join('')}
            </div>
            ` : ''}
            
            <!-- Kekurangan Nama -->
            ${kekurangan.length > 0 ? `
            <div style="background: rgba(15,15,20,0.8); border-radius: 16px; padding: 20px; margin-bottom: 16px;">
                <h4 style="color: #FF8A8A; margin-bottom: 12px;"><i class="fas fa-exclamation-triangle"></i> Kekurangan Nama</h4>
                ${kekurangan.map(k => `<p style="margin-bottom: 8px;">• ${k.text}</p>`).join('')}
            </div>
            ` : ''}
            
            ${isPurchased ? `
            <div style="text-align: center; margin-top: 24px;">
                <button class="btn-pdf" onclick="downloadManuritasPDF()">
                    <i class="fas fa-download"></i> Unduh Sertifikat PDF
                </button>
            </div>
            ` : ''}
            
            <button class="btn-pricing" onclick="closeManuritasModal()" style="margin-top: 20px; width: 100%;">Tutup</button>
        </div>
    `;
    
    modal.innerHTML = html;
    modal.classList.remove('hidden');
    
    // Simpan result untuk PDF
    window.currentManuritasResult = result;
}

/**
 * Menutup modal Manuritas
 */
function closeManuritasModal() {
    const modal = document.getElementById('manuritasResultModal');
    if (modal) modal.classList.add('hidden');
}

/**
 * Mengunduh PDF sertifikat nama selaras
 */
async function downloadManuritasPDF() {
    const result = window.currentManuritasResult;
    if (!result) {
        alert('Tidak ada data untuk diunduh.');
        return;
    }
    
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    // Header
    pdf.setFontSize(24);
    pdf.setTextColor(212, 175, 55);
    pdf.text('Sertifikat Nama Selaras', 105, 30, { align: 'center' });
    
    pdf.setFontSize(16);
    pdf.setTextColor(0, 0, 0);
    pdf.text('Oracle Nusantara', 105, 45, { align: 'center' });
    
    pdf.setDrawColor(212, 175, 55);
    pdf.line(20, 55, 190, 55);
    
    let yPos = 70;
    pdf.setFontSize(14);
    pdf.text(`Nama: ${result.name}`, 20, yPos); yPos += 10;
    pdf.text(`Kekuatan Nama: ${result.strength.score}% (${result.strength.label})`, 20, yPos); yPos += 10;
    pdf.text(`Total Nilai Hanacaraka: ${result.hanacaraka.total}`, 20, yPos); yPos += 15;
    
    pdf.setFontSize(12);
    pdf.text(`Tugas Hidup: ${result.tugasHidup?.name || '-'}`, 20, yPos); yPos += 8;
    
    const tugasDesc = result.tugasHidup?.description || '-';
    const wrappedTugas = pdf.splitTextToSize(tugasDesc, 170);
    pdf.text(wrappedTugas, 20, yPos);
    yPos += wrappedTugas.length * 6 + 10;
    
    pdf.text(`Watak Asli: ${result.watak?.watak_asli || '-'}`, 20, yPos); yPos += 8;
    pdf.text(`Jalur Rezeki: ${result.jalurRezeki?.name || '-'}`, 20, yPos); yPos += 15;
    
    // Footer
    pdf.setFontSize(10);
    pdf.setTextColor(80, 80, 80);
    pdf.text(`Dianalisis dengan Manuritas • oracle-nusantara.com`, 105, 280, { align: 'center' });
    pdf.text(`© 2026 Oracle Nusantara`, 105, 290, { align: 'center' });
    
    pdf.save(`Sertifikat-Nama-${result.name.replace(/\s/g, '-')}.pdf`);
    showSuccessToast('📄 Sertifikat PDF berhasil diunduh!');
}

// Expose ke global
window.generateNameOptions = generateNameOptions;
window.displayNameOptions = displayNameOptions;
window.loadNameOptions = loadNameOptions;
window.closeNameOptionsModal = closeNameOptionsModal;
window.purchaseNameOption = purchaseNameOption;
window.displayManuritasResult = displayManuritasResult;
window.closeManuritasModal = closeManuritasModal;
window.downloadManuritasPDF = downloadManuritasPDF;
