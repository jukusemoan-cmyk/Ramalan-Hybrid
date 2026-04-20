// ================== MANURITAS GENERATOR ==================
// File: js/manuritas-generator.js
// Versi: 2.1 - Revisi berdasarkan feedback

// ---------- KONFIGURASI PAKET ----------
const PACKAGE_CONFIG = {
    silver: { 
        name: 'SILVER', 
        targetMin: 60, 
        targetMax: 74, 
        tokenCost: 5,
        displayTarget: '60-74%'
    },
    gold: { 
        name: 'GOLD', 
        targetMin: 75, 
        targetMax: 89, 
        tokenCost: 10,
        displayTarget: '75-89%'
    },
    platinum: { 
        name: 'PLATINUM', 
        targetMin: 90, 
        targetMax: 100, 
        tokenCost: 20,
        displayTarget: '90-100%'
    }
};

// ---------- LABEL PERSENTASE ----------
function getStrengthLabel(score) {
    if (score >= 90) return { label: 'SANGAT KUAT', stars: '', class: 'sangat-kuat' };
    if (score >= 75) return { label: 'KUAT', stars: '', class: 'kuat' };
    if (score >= 60) return { label: 'CUKUP', stars: '', class: 'cukup' };
    if (score >= 40) return { label: 'KURANG', stars: '', class: 'kurang' };
    return { label: 'LEMAH', stars: '', class: 'lemah' };
}

// ---------- GENERATE OPSI NAMA (HANYA 1 OPSI) ----------
function generateSingleNameOption(originalName, targetMin, targetMax, weton, wuku, saranList) {
    const baseName = originalName.split(' ')[0];
    
    // Ambil kata-kata power dari saranList
    const powerWords = [];
    saranList.forEach(s => {
        if (s.example) {
            const words = s.example.replace(/[.,]/g, '').split(' ').filter(w => w.length > 2);
            powerWords.push(...words);
        }
    });
    
    // Default power words jika kosong
    if (powerWords.length === 0) {
        powerWords.push('Utama', 'Wijaya', 'Mahendra', 'Baskara', 'Arkand', 'Kusuma', 'Pratama', 'Wirayuda');
    }
    
    // Hilangkan duplikat
    const uniqueWords = [...new Set(powerWords)];
    
    // Generate semua kombinasi yang mungkin
    const combinations = [];
    
    // Kombinasi dengan 1 kata tambahan
    uniqueWords.forEach(word => {
        combinations.push({
            name: `${baseName} ${word}`,
            modType: `Ditambahkan "${word}" di belakang nama`,
            addedWord: word
        });
        combinations.push({
            name: `${word} ${baseName}`,
            modType: `Ditambahkan "${word}" di depan nama`,
            addedWord: word
        });
    });
    
    // Jika target tinggi (85), tambahkan kombinasi 2 kata
    if (targetMin >= 85) {
        for (let i = 0; i < uniqueWords.length; i++) {
            for (let j = i + 1; j < uniqueWords.length; j++) {
                combinations.push({
                    name: `${baseName} ${uniqueWords[i]} ${uniqueWords[j]}`,
                    modType: `Ditambahkan "${uniqueWords[i]} ${uniqueWords[j]}" di belakang`,
                    addedWord: `${uniqueWords[i]} ${uniqueWords[j]}`
                });
                combinations.push({
                    name: `${uniqueWords[i]} ${baseName} ${uniqueWords[j]}`,
                    modType: `Ditambahkan "${uniqueWords[i]}" di depan dan "${uniqueWords[j]}" di belakang`,
                    addedWord: `${uniqueWords[i]}, ${uniqueWords[j]}`
                });
            }
        }
    }
    
    // Evaluasi setiap kombinasi dan cari yang masuk rentang target
    const validOptions = [];
    
    combinations.forEach(combo => {
        const hanacarakaResult = hanacarakaValue(combo.name);
        const strength = calculateNameStrength(hanacarakaResult.total, weton.neptu, wuku);
        
        if (strength.score >= targetMin && strength.score <= targetMax) {
            validOptions.push({
                name: combo.name,
                strength: strength.score,
                strengthLabel: getStrengthLabel(strength.score).label,
                strengthStars: getStrengthLabel(strength.score).stars,
                modificationType: combo.modType,
                addedWord: combo.addedWord,
                hanacarakaTotal: hanacarakaResult.total,
                originalName: originalName
            });
        }
    });
    
    // Urutkan berdasarkan kekuatan tertinggi
    validOptions.sort((a, b) => b.strength - a.strength);
    
    // Kembalikan hanya 1 opsi terbaik (atau null jika tidak ada)
    return validOptions.length > 0 ? validOptions[0] : null;
}

// ---------- LOAD OPSI NAMA (DIPANGGIL SAAT TOMBOL DIKLIK) ----------
async function loadNameOptions(packageType) {
    const config = PACKAGE_CONFIG[packageType];
    if (!config) {
        console.error('Paket tidak valid:', packageType);
        return;
    }
    
    const originalName = document.getElementById('fullName').value.trim();
    if (!originalName) {
        alert('Masukkan nama lengkap terlebih dahulu.');
        return;
    }
    
    if (!currentUserData) {
        alert('Data belum lengkap. Silakan refresh halaman.');
        return;
    }
    
    if (!currentManuritasResult) {
        alert('Lakukan analisis Manuritas terlebih dahulu.');
        return;
    }
    
    // Cek token
    const currentBalance = parseInt(localStorage.getItem('tokenBalance') || '0');
    if (currentBalance < config.tokenCost) {
        if (confirm(`Token Anda tidak cukup (${currentBalance}/${config.tokenCost}). Ingin membeli token sekarang?`)) {
            window.location.href = 'pricing.html';
        }
        return;
    }
    
    // Potong token
    const newBalance = currentBalance - config.tokenCost;
    localStorage.setItem('tokenBalance', newBalance);
    updateTokenDisplay();
    showSuccessToast(` ${config.tokenCost} Token digunakan. Sisa ${newBalance} Token.`);
    
    showLoading(true);
    
    try {
        // Hitung kekuatan saat ini
        const hanacarakaResult = hanacarakaValue(originalName);
        const currentStrength = calculateNameStrength(
            hanacarakaResult.total, 
            currentUserData.weton.neptu, 
            currentUserData.wuku
        );
        const currentLabel = getStrengthLabel(currentStrength.score);
        
        // Ambil saran penyempurnaan dari hasil Manuritas
        const saranList = currentManuritasResult.saran || [];
        
        // Generate 1 opsi terbaik
        const option = generateSingleNameOption(
            originalName,
            config.targetMin,
            config.targetMax,
            currentUserData.weton,
            currentUserData.wuku,
            saranList
        );
        
        // Simpan data untuk pembelian nanti
        window.pendingPurchaseData = {
            originalName: originalName,
            originalStrength: currentStrength.score,
            originalLabel: currentLabel.label,
            originalHanacaraka: hanacarakaResult.total,
            option: option,
            packageType: packageType,
            config: config
        };
        
        // Tampilkan opsi di bawah tombol
        displayNameOptionInline(option, config, originalName, currentStrength);
        
    } catch (e) {
        console.error('Gagal generate opsi:', e);
        alert('Terjadi kesalahan saat generate opsi nama.');
    } finally {
        showLoading(false);
    }
}

// ---------- TAMPILKAN OPSI NAMA (INLINE DI BAWAH TOMBOL) ----------
function displayNameOptionInline(option, config, originalName, currentStrength) {
    const container = document.getElementById('nameOptionsContainer');
    if (!container) return;
    
    const currentLabel = getStrengthLabel(currentStrength.score);
    
    if (!option) {
        container.innerHTML = `
            <div style="background: rgba(15,15,20,0.9); border-radius: 16px; padding: 24px; margin-top: 20px; text-align: center; border: 1px solid rgba(212,175,55,0.2);">
                <p style="color: #FF8A8A; font-size: 1.1rem;">
                    <i class="fas fa-exclamation-circle"></i> 
                    Maaf, tidak dapat menemukan opsi nama dengan target ${config.displayTarget}.
                </p>
                <p style="margin-top: 16px; color: #A0A0B0;">
                    Coba paket yang lebih tinggi (Gold/Platinum) untuk mendapatkan opsi yang lebih baik.
                </p>
            </div>
        `;
        return;
    }
    
    const strengthDiff = option.strength - currentStrength.score;
    const hanacarakaDiff = option.hanacarakaTotal - (window.pendingPurchaseData?.originalHanacaraka || 0);
    
    let html = `
        <div style="margin-top: 24px;">
            <h4 style="color: #F3E5AB; margin-bottom: 16px;">
                <i class="fas fa-star"></i> Opsi Nama Selaras (Target ${config.displayTarget})
            </h4>
            <p style="margin-bottom: 16px; color: #A0A0B0;">
                Nama asli: <strong>${originalName}</strong> 
                (Kekuatan: ${currentStrength.score}% - ${currentLabel.label})
            </p>
            
            <div style="background: linear-gradient(145deg, rgba(20,20,25,0.95), rgba(10,10,12,0.95)); 
                        border-radius: 20px; padding: 28px; 
                        border: 2px solid ${option.strength >= 75 ? '#64C864' : '#D4AF37'};">
                
                <div style="text-align: center; margin-bottom: 20px;">
                    <h3 style="color: #D4AF37; font-size: 1.8rem; margin-bottom: 8px;"> ${option.name} </h3>
                    <div style="font-size: 2.5rem; font-weight: bold; color: ${option.strength >= 75 ? '#64C864' : '#D4AF37'};">
                        ${option.strength}%
                    </div>
                    <div style="color: #F3E5AB; font-size: 1.1rem; margin-top: 4px;">
                        ${option.strengthLabel} ${option.strengthStars}
                    </div>
                </div>
                
                <div style="background: rgba(15,15,20,0.6); border-radius: 12px; padding: 16px; margin-bottom: 20px;">
                    <p style="color: #B0B0C0; margin-bottom: 8px;">
                        <i class="fas fa-magic" style="color: #D4AF37;"></i> 
                        <strong>Modifikasi:</strong> ${option.modificationType}
                    </p>
                    <p style="color: #B0B0C0;">
                        <i class="fas fa-calculator"></i> 
                        <strong>Nilai Hanacaraka:</strong> ${option.hanacarakaTotal} 
                        (${hanacarakaDiff > 0 ? '+' : ''}${hanacarakaDiff} dari nama asli)
                    </p>
                </div>
                
                <button class="btn-premium" onclick="purchaseSelectedName()" 
                        style="width: 100%; padding: 16px; font-size: 1.1rem;">
                    <i class="fas fa-shopping-cart"></i> BELI NAMA INI (${config.tokenCost} Token)
                </button>
            </div>
        </div>
    `;
    
    container.innerHTML = html;
    container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ---------- BELI NAMA YANG DIPILIH ----------
async function purchaseSelectedName() {
    const data = window.pendingPurchaseData;
    if (!data || !data.option) {
        alert('Tidak ada opsi nama yang dipilih.');
        return;
    }
    
    // Cek token lagi (untuk keamanan)
    const currentBalance = parseInt(localStorage.getItem('tokenBalance') || '0');
    if (currentBalance < data.config.tokenCost) {
        alert('Token tidak cukup.');
        return;
    }
    
    // Potong token untuk pembelian
    const newBalance = currentBalance - data.config.tokenCost;
    localStorage.setItem('tokenBalance', newBalance);
    updateTokenDisplay();
    
    showLoading(true);
    
    try {
        // Hitung analisis lengkap untuk nama baru
        const result = await calculateManuritas(
            data.option.name,
            currentUserData.weton,
            currentUserData.wuku,
            manuritasData
        );
        
        if (!result) {
            alert('Gagal menghitung analisis.');
            return;
        }
        
        // Simpan data pembelian
        purchasedNameData = {
            name: data.option.name,
            strength: data.option.strength,
            strengthLabel: data.option.strengthLabel,
            strengthStars: data.option.strengthStars,
            originalName: data.originalName,
            originalStrength: data.originalStrength,
            originalLabel: data.originalLabel,
            originalHanacaraka: data.originalHanacaraka,
            modificationType: data.option.modificationType,
            addedWord: data.option.addedWord,
            hanacarakaTotal: data.option.hanacarakaTotal,
            result: result,
            purchasedAt: new Date().toISOString()
        };
        
        // Tampilkan hasil pembelian dengan format baru
        displayPurchasedNameResultNew(purchasedNameData);
        
        showSuccessToast(` Nama "${data.option.name}" berhasil dibeli!`);
        
    } catch (e) {
        console.error('Gagal membeli nama:', e);
        alert('Terjadi kesalahan saat memproses pembelian.');
    } finally {
        showLoading(false);
        window.pendingPurchaseData = null;
    }
}

// ---------- TAMPILKAN HASIL PEMBELIAN (FORMAT BARU) ----------
function displayPurchasedNameResultNew(data) {
    const container = document.getElementById('nameOptionsContainer');
    if (!container) return;
    
    const result = data.result;
    const tugas = result.tugasHidup;
    const rezeki = result.jalurRezeki;
    const kelebihan = result.kelebihan || [];
    const titikLuka = result.titikLuka;
    
    const strengthDiff = data.strength - data.originalStrength;
    const hanacarakaDiff = data.hanacarakaTotal - data.originalHanacaraka;
    
    // Analisis elemen untuk penjelasan modifikasi
    const wordAnalysis = analyzeAddedWord(data.addedWord, manuritasData);
    
    let html = `
        <div style="margin-top: 32px; background: linear-gradient(145deg, rgba(20,20,25,0.98), rgba(10,10,12,0.98)); 
                    border-radius: 24px; padding: 32px; border: 2px solid #D4AF37; box-shadow: 0 10px 40px rgba(0,0,0,0.5);">
            
            <!-- HEADER SELAMAT -->
            <div style="text-align: center; margin-bottom: 32px;">
                <div style="font-size: 1.2rem; color: #64C864; margin-bottom: 8px;">
                    <i class="fas fa-check-circle"></i> SELAMAT! Anda telah memilih nama baru:
                </div>
                <h2 style="color: #D4AF37; font-size: 2.2rem; margin-bottom: 12px;"> ${data.name} </h2>
                <div style="font-size: 2rem; font-weight: bold; color: ${data.strength >= 75 ? '#64C864' : '#D4AF37'};">
                    ${data.strength}%
                </div>
                <div style="color: #F3E5AB; font-size: 1.2rem; margin-top: 4px;">
                    (${data.strengthLabel}) ${data.strengthStars}
                </div>
            </div>
            
            <!-- TABEL PERBANDINGAN -->
            <div style="background: rgba(15,15,20,0.8); border-radius: 16px; padding: 20px; margin-bottom: 24px;">
                <h4 style="color: #D4AF37; margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
                    <i class="fas fa-chart-bar"></i> PERBANDINGAN DENGAN NAMA LAMA
                </h4>
                <table style="width: 100%; color: #E5E5E5; border-collapse: collapse; text-align: center;">
                    <tr style="border-bottom: 1px solid rgba(212,175,55,0.3);">
                        <th style="padding: 12px; text-align: left;"></th>
                        <th style="padding: 12px;">Nama Lama</th>
                        <th style="padding: 12px;">Nama Baru</th>
                    </tr>
                    <tr>
                        <td style="padding: 10px; text-align: left; font-weight: 500;">Nama</td>
                        <td style="padding: 10px;">${data.originalName}</td>
                        <td style="padding: 10px; color: #64C864; font-weight: 600;">${data.name}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; text-align: left; font-weight: 500;">Kekuatan</td>
                        <td style="padding: 10px;">${data.originalStrength}% (${data.originalLabel})</td>
                        <td style="padding: 10px; color: #64C864; font-weight: 600;">
                            ${data.strength}% (${data.strengthLabel}) 
                            <span style="color: #64C864;"> +${strengthDiff}%</span>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; text-align: left; font-weight: 500;">Hanacaraka</td>
                        <td style="padding: 10px;">${data.originalHanacaraka}</td>
                        <td style="padding: 10px; color: #64C864; font-weight: 600;">
                            ${data.hanacarakaTotal} 
                            <span style="color: #64C864;">(+${hanacarakaDiff})</span>
                        </td>
                    </tr>
                </table>
            </div>
            
            <!-- PENJELASAN MODIFIKASI -->
            <div class="analysis-section-card">
                <h4><i class="fas fa-magic" style="color:#D4AF37;"></i> PENJELASAN MODIFIKASI</h4>
                <p>${data.modificationType}. Kata <strong>"${data.addedWord}"</strong> memiliki nilai Hanacaraka ${wordAnalysis.value} dengan elemen <strong>${wordAnalysis.element}</strong>, yang ${wordAnalysis.effect}.</p>
            </div>
            
            <!-- TUGAS HIDUP -->
            <div class="analysis-section-card">
                <h4><i class="fas fa-bullseye" style="color:#D4AF37;"></i> TUGAS HIDUP (BARU): ${tugas?.name || '-'}</h4>
                <p>${tugas?.description || '-'}</p>
            </div>
            
            <!-- JALUR REZEKI -->
            <div class="analysis-section-card">
                <h4><i class="fas fa-coins" style="color:#D4AF37;"></i> JALUR REZEKI (BARU): ${rezeki?.name || '-'}</h4>
                <p>${rezeki?.description || '-'}</p>
                <p><strong>Bidang cocok:</strong> ${rezeki?.fields?.join(', ') || '-'}</p>
            </div>
            
            <!-- KELEBIHAN NAMA BARU -->
            <div class="analysis-section-card">
                <h4><i class="fas fa-check-circle" style="color:#64C864;"></i> KELEBIHAN NAMA BARU</h4>
                ${kelebihan.map(k => `<p style="margin-bottom:8px;"> ${k.text}</p>`).join('')}
            </div>
            
            ${titikLuka ? `
            <div class="analysis-section-card">
                <h4><i class="fas fa-heart" style="color:#D4AF37;"></i> TITIK LUKA BATIN (Usia ${titikLuka.age})</h4>
                <p><strong>Penyembuhan:</strong> ${titikLuka.healing || '-'}</p>
            </div>
            ` : ''}
            
            <!-- SARAN PENGGUNAAN -->
            <div class="analysis-section-card">
                <h4><i class="fas fa-lightbulb" style="color:#D4AF37;"></i> SARAN PENGGUNAAN</h4>
                <p> Gunakan <strong>"${data.name}"</strong> sebagai nama profesional di LinkedIn, email, atau kartu nama.</p>
                <p> Perkenalkan diri dengan nama ini di lingkungan baru untuk menarik energi positif.</p>
                <p> Tidak perlu mengubah dokumen legal, getaran nama bekerja saat diucapkan.</p>
            </div>
            
            <!-- TOMBOL PDF -->
            <div style="text-align: center; margin-top: 28px;">
                <button class="btn-pdf" onclick="downloadPurchasedNamePDF()" style="padding: 14px 32px;">
                    <i class="fas fa-download"></i> UNDUH SERTIFIKAT PDF
                </button>
            </div>
            
            <!-- DISCLAIMER -->
            <p style="text-align: center; margin-top: 20px; font-size: 0.9rem; opacity: 0.7; font-style: italic;">
                 Perubahan nama tidak harus legal. Energi nama bekerja melalui getaran saat nama itu diucapkan dan didengar.
            </p>
        </div>
    `;
    
    container.innerHTML = html;
    container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ---------- ANALISIS KATA TAMBAHAN ----------
function analyzeAddedWord(word, manuritasData) {
    // Hitung nilai Hanacaraka
    const value = hanacarakaValue(word).total;
    
    // Tentukan elemen berdasarkan nilai
    let element = 'Tanah';
    let effect = 'memberikan stabilitas dan fondasi yang kokoh';
    
    if (value <= 20) {
        element = 'Api';
        effect = 'memberikan energi kepemimpinan dan semangat yang membara';
    } else if (value <= 40) {
        element = 'Air';
        effect = 'memberikan ketenangan, kebijaksanaan, dan kemampuan beradaptasi';
    } else if (value <= 60) {
        element = 'Kayu';
        effect = 'memberikan pertumbuhan, kreativitas, dan visi ke depan';
    } else if (value <= 80) {
        element = 'Logam';
        effect = 'memberikan ketegasan, disiplin, dan kemampuan eksekusi';
    }
    
    return { value, element, effect };
}

// ---------- UPDATE TOKEN DISPLAY (DITAMBAHKAN) ----------
function updateTokenDisplay() {
    const balance = localStorage.getItem('tokenBalance') || '0';
    const span = document.getElementById('tokenBalanceSpan');
    if (span) span.textContent = balance;
    
    const btn = document.getElementById('unlockPremiumBtn');
    if (btn) {
        const token = parseInt(balance) || 0;
        btn.innerHTML = token >= 3 
            ? `<i class="fas fa-unlock"></i> BUKA RAMALAN LENGKAP (${token} Token tersedia)` 
            : `<i class="fas fa-shopping-cart"></i> BELI TOKEN UNTUK BUKA PREMIUM`;
    }
}

// Expose ke global
window.PACKAGE_CONFIG = PACKAGE_CONFIG;
window.getStrengthLabel = getStrengthLabel;
window.loadNameOptions = loadNameOptions;
window.purchaseSelectedName = purchaseSelectedName;
window.updateTokenDisplay = updateTokenDisplay;
