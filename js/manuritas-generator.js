// ================== MANURITAS GENERATOR ==================
// File: js/manuritas-generator.js
// Fungsi untuk generate nama selaras dan fitur pembelian
// Versi: 2.0 - Final dengan spesifikasi yang disepakati

// ---------- 1. FUNGSI GENERATE NAMA BARU ----------

/**
 * Menghasilkan opsi nama baru berdasarkan target rentang kekuatan
 * @param {string} originalName - Nama asli user
 * @param {number} targetMin - Target persentase minimal
 * @param {number} targetMax - Target persentase maksimal
 * @param {object} weton - Data weton user
 * @param {object} wuku - Data wuku user
 * @param {array} saranList - Daftar saran penyempurnaan dari hasil Manuritas
 * @returns {array} - Array opsi nama baru (maksimal 3)
 */
function generateNameOptions(originalName, targetMin, targetMax, weton, wuku, saranList) {
    const options = [];
    const baseName = originalName.split(' ')[0];
    
    // Ambil kata-kata dari saran penyempurnaan
    const saranWords = [];
    saranList.forEach(s => {
        if (s.example) {
            const words = s.example.replace(/[.,]/g, '').split(' ').filter(w => w.length > 2);
            saranWords.push(...words);
        }
    });
    
    // Jika tidak ada saran, gunakan default
    if (saranWords.length === 0) {
        saranWords.push('Utama', 'Wijaya', 'Mahendra', 'Baskara', 'Arkand');
    }
    
    // Generate kombinasi
    const combinations = [];
    
    // Kombinasi 1: Nama + Kata
    saranWords.forEach(word => {
        combinations.push({
            name: `${baseName} ${word}`,
            modType: `Penambahan "${word}" di belakang`
        });
        combinations.push({
            name: `${word} ${baseName}`,
            modType: `Penambahan "${word}" di depan`
        });
    });
    
    // Kombinasi 2: Nama + Kata1 + Kata2 (untuk platinum)
    if (targetMin >= 85) {
        for (let i = 0; i < saranWords.length; i++) {
            for (let j = i + 1; j < saranWords.length; j++) {
                combinations.push({
                    name: `${baseName} ${saranWords[i]} ${saranWords[j]}`,
                    modType: `Penambahan "${saranWords[i]} ${saranWords[j]}"`
                });
                combinations.push({
                    name: `${saranWords[i]} ${baseName} ${saranWords[j]}`,
                    modType: `Penambahan "${saranWords[i]}" di depan dan "${saranWords[j]}" di belakang`
                });
            }
        }
    }
    
    // Evaluasi setiap kombinasi
    combinations.forEach(combo => {
        const hanacarakaResult = hanacarakaValue(combo.name);
        const strength = calculateNameStrength(hanacarakaResult.total, weton.neptu, wuku);
        
        // Hanya ambil yang masuk rentang target
        if (strength.score >= targetMin && strength.score <= targetMax) {
            options.push({
                name: combo.name,
                strength: strength.score,
                strengthLabel: strength.label,
                modificationType: combo.modType,
                hanacarakaTotal: hanacarakaResult.total,
                originalName: originalName
            });
        }
    });
    
    // Hilangkan duplikat (berdasarkan nama)
    const uniqueOptions = [];
    const seenNames = new Set();
    options.forEach(opt => {
        if (!seenNames.has(opt.name)) {
            seenNames.add(opt.name);
            uniqueOptions.push(opt);
        }
    });
    
    // Urutkan berdasarkan kekuatan tertinggi, ambil maksimal 3
    uniqueOptions.sort((a, b) => b.strength - a.strength);
    return uniqueOptions.slice(0, 3);
}

/**
 * Menghasilkan deskripsi modifikasi
 */
function generateModificationDescription(option) {
    const addedValue = option.hanacarakaTotal - (option.originalHanacaraka || 0);
    return `Ditambahkan "${option.modificationType}". Nilai Hanacaraka bertambah ${addedValue} poin, meningkatkan kekuatan nama dari segi energetik.`;
}

// ---------- 2. FUNGSI PEMBELIAN NAMA ----------

let selectedNameOption = null;
let purchasedNameData = null;

/**
 * Memuat opsi nama untuk paket tertentu (dipanggil saat tombol diklik)
 */
async function loadNameOptions(packageId, targetMin, targetMax, tokenCost) {
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
    if (currentBalance < tokenCost) {
        if (confirm(`Token Anda tidak cukup (${currentBalance}/${tokenCost}). Ingin membeli token sekarang?`)) {
            window.location.href = 'pricing.html';
        }
        return;
    }
    
    // Potong token
    const newBalance = currentBalance - tokenCost;
    localStorage.setItem('tokenBalance', newBalance);
    updateTokenDisplay();
    showSuccessToast(` ${tokenCost} Token digunakan. Sisa ${newBalance} Token.`);
    
    // Hitung kekuatan saat ini
    const hanacarakaResult = hanacarakaValue(originalName);
    const currentStrength = calculateNameStrength(
        hanacarakaResult.total, 
        currentUserData.weton.neptu, 
        currentUserData.wuku
    );
    
    // Ambil saran penyempurnaan dari hasil Manuritas
    const saranList = currentManuritasResult.saran || [];
    
    // Generate opsi
    const options = generateNameOptions(
        originalName,
        targetMin,
        targetMax,
        currentUserData.weton,
        currentUserData.wuku,
        saranList
    );
    
    // Tampilkan opsi di container inline
    displayNameOptionsInline(options, packageId, targetMin, targetMax, originalName, currentStrength.score);
}

/**
 * Menampilkan opsi nama secara inline di bawah tombol
 */
function displayNameOptionsInline(options, packageId, targetMin, targetMax, originalName, currentScore) {
    const container = document.getElementById('nameOptionsContainer');
    if (!container) return;
    
    if (options.length === 0) {
        container.innerHTML = `
            <div style="background: rgba(15,15,20,0.8); border-radius: 16px; padding: 20px; margin-top: 20px; text-align: center;">
                <p style="color: #FF8A8A;"><i class="fas fa-exclamation-circle"></i> Maaf, tidak ada opsi nama yang mencapai target ${targetMin}-${targetMax}%.</p>
                <p style="margin-top: 12px;">Coba paket yang lebih tinggi untuk mendapatkan opsi yang lebih baik.</p>
            </div>
        `;
        return;
    }
    
    let html = `
        <div style="margin-top: 24px;">
            <h4 style="color: #F3E5AB; margin-bottom: 16px;">
                <i class="fas fa-star"></i> Opsi Nama Selaras (Target ${targetMin}-${targetMax}%)
            </h4>
            <p style="margin-bottom: 16px; color: #A0A0B0;">Nama asli: <strong>${originalName}</strong> (Kekuatan: ${currentScore}%)</p>
    `;
    
    options.forEach((opt, idx) => {
        html += `
            <div style="background: rgba(15,15,20,0.9); border-radius: 16px; padding: 20px; margin-bottom: 16px; border: 2px solid #64C864;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                    <h4 style="color: #F3E5AB; margin: 0;"> ${opt.name}</h4>
                    <span style="color: #64C864; font-weight: bold; font-size: 1.2rem;">${opt.strength}%</span>
                </div>
                <p style="color: #A0A0B0; margin-bottom: 12px; font-size: 0.9rem;">${opt.modificationType}</p>
                <button class="btn-premium" onclick="selectAndDisplayNameOption('${opt.name.replace(/'/g, "\\'")}', ${opt.strength}, '${opt.modificationType.replace(/'/g, "\\'")}', ${opt.hanacarakaTotal})" style="width: 100%; padding: 12px;">
                    <i class="fas fa-check-circle"></i> Pilih Nama Ini & Lihat Analisis Lengkap
                </button>
            </div>
        `;
    });
    
    html += `</div>`;
    container.innerHTML = html;
    
    // Scroll ke container
    container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * Memilih opsi nama dan menampilkan analisis lengkap
 */
async function selectAndDisplayNameOption(selectedName, newStrength, modificationType, hanacarakaTotal) {
    if (!currentUserData || !currentManuritasResult) {
        alert('Data tidak lengkap.');
        return;
    }
    
    const originalName = document.getElementById('fullName').value.trim();
    const originalHanacaraka = currentManuritasResult.hanacaraka.total;
    const originalStrength = currentManuritasResult.strength.score;
    
    showLoading(true);
    
    try {
        // Hitung analisis untuk nama baru
        const result = await calculateManuritas(
            selectedName,
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
            name: selectedName,
            strength: newStrength,
            originalName: originalName,
            originalStrength: originalStrength,
            originalHanacaraka: originalHanacaraka,
            modificationType: modificationType,
            hanacarakaTotal: hanacarakaTotal,
            result: result,
            purchasedAt: new Date().toISOString()
        };
        
        // Tampilkan hasil di container
        displayPurchasedNameResult(purchasedNameData);
        
    } catch (e) {
        console.error('Gagal menampilkan hasil:', e);
        alert('Terjadi kesalahan.');
    } finally {
        showLoading(false);
    }
}

/**
 * Menampilkan hasil analisis untuk nama yang dibeli
 */
function displayPurchasedNameResult(data) {
    const container = document.getElementById('nameOptionsContainer');
    if (!container) return;
    
    const result = data.result;
    const tugas = result.tugasHidup;
    const rezeki = result.jalurRezeki;
    const kelebihan = result.kelebihan || [];
    const titikLuka = result.titikLuka;
    const peta = result.petaEnergi || { physical: [], psychological: [] };
    
    const strengthDiff = data.strength - data.originalStrength;
    const hanacarakaDiff = data.hanacarakaTotal - data.originalHanacaraka;
    
    let html = `
        <div style="margin-top: 32px; padding: 24px; background: linear-gradient(145deg, rgba(20,20,25,0.9), rgba(10,10,12,0.9)); border-radius: 24px; border: 2px solid #D4AF37;">
            <div style="text-align: center; margin-bottom: 24px;">
                <h2 style="color: #D4AF37; margin-bottom: 8px;"> ${data.name} </h2>
                <div style="font-size: 2.5rem; color: #64C864; font-weight: bold;">${data.strength}%</div>
                <div style="color: #F3E5AB;">${result.strength.label}</div>
            </div>
            
            <div style="background: rgba(15,15,20,0.8); border-radius: 16px; padding: 20px; margin-bottom: 20px;">
                <h4 style="color: #D4AF37; margin-bottom: 16px;"><i class="fas fa-chart-line"></i> Perbandingan dengan Nama Lama</h4>
                <table style="width: 100%; color: #E5E5E5; border-collapse: collapse;">
                    <tr style="border-bottom: 1px solid rgba(212,175,55,0.2);">
                        <th style="padding: 8px; text-align: left;">Aspek</th>
                        <th style="padding: 8px; text-align: center;">Nama Lama</th>
                        <th style="padding: 8px; text-align: center;">Nama Baru</th>
                        <th style="padding: 8px; text-align: center;">Perubahan</th>
                    </tr>
                    <tr>
                        <td style="padding: 8px;">Nama</td>
                        <td style="padding: 8px; text-align: center;">${data.originalName}</td>
                        <td style="padding: 8px; text-align: center; color: #64C864;">${data.name}</td>
                        <td style="padding: 8px; text-align: center;">-</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px;">Kekuatan</td>
                        <td style="padding: 8px; text-align: center;">${data.originalStrength}%</td>
                        <td style="padding: 8px; text-align: center; color: #64C864;">${data.strength}%</td>
                        <td style="padding: 8px; text-align: center; color: #64C864;"> +${strengthDiff}%</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px;">Nilai Hanacaraka</td>
                        <td style="padding: 8px; text-align: center;">${data.originalHanacaraka}</td>
                        <td style="padding: 8px; text-align: center; color: #64C864;">${data.hanacarakaTotal}</td>
                        <td style="padding: 8px; text-align: center; color: #64C864;">+${hanacarakaDiff}</td>
                    </tr>
                </table>
            </div>
            
            <div class="analysis-section-card">
                <h4><i class="fas fa-magic" style="color:#D4AF37;"></i> Penjelasan Modifikasi</h4>
                <p>${data.modificationType}. Nilai Hanacaraka bertambah ${hanacarakaDiff} poin, yang memperkuat fondasi energetik nama Anda.</p>
            </div>
            
            <div class="analysis-section-card">
                <h4><i class="fas fa-bullseye" style="color:#D4AF37;"></i> Tugas Hidup (Baru): ${tugas?.name || '-'}</h4>
                <p>${tugas?.description || '-'}</p>
            </div>
            
            <div class="analysis-section-card">
                <h4><i class="fas fa-coins" style="color:#D4AF37;"></i> Jalur Rezeki (Baru): ${rezeki?.name || '-'}</h4>
                <p>${rezeki?.description || '-'}</p>
                <p><strong>Bidang cocok:</strong> ${rezeki?.fields?.join(', ') || '-'}</p>
            </div>
            
            <div class="analysis-section-card">
                <h4><i class="fas fa-check-circle" style="color:#64C864;"></i> Kelebihan Nama Baru</h4>
                ${kelebihan.map(k => `<p style="margin-bottom:8px;"> ${k.text}</p>`).join('')}
            </div>
            
            ${titikLuka ? `
            <div class="analysis-section-card">
                <h4><i class="fas fa-heart-broken" style="color:#D4AF37;"></i> Titik Luka Batin (Usia ${titikLuka.age})</h4>
                <p><strong>Penyembuhan:</strong> ${titikLuka.healing || '-'}</p>
            </div>
            ` : ''}
            
            ${peta.physical.length > 0 ? `
            <div class="analysis-section-card">
                <h4><i class="fas fa-heartbeat" style="color:#D4AF37;"></i> Peta Kerentanan Energi</h4>
                <p><strong>Area Fisik:</strong> ${peta.physical[0]?.area || '-'}</p>
                <p><strong>Preventif:</strong> ${peta.physical[0]?.prevention || '-'}</p>
            </div>
            ` : ''}
            
            <div class="analysis-section-card">
                <h4><i class="fas fa-lightbulb" style="color:#D4AF37;"></i> Saran Penggunaan</h4>
                <p> Gunakan "${data.name}" sebagai nama profesional di LinkedIn, email, atau kartu nama.</p>
                <p> Perkenalkan diri dengan nama ini di lingkungan baru untuk menarik energi positif.</p>
                <p> Tidak perlu mengubah dokumen legal, getaran nama bekerja saat diucapkan.</p>
            </div>
            
            <div style="text-align: center; margin-top: 24px;">
                <button class="btn-pdf" onclick="downloadPurchasedNamePDF()">
                    <i class="fas fa-download"></i> Unduh Sertifikat PDF
                </button>
            </div>
            
            <p style="text-align: center; margin-top: 16px; font-size: 0.9rem; opacity: 0.7;">
                 Perubahan nama tidak harus legal. Energi nama bekerja melalui getaran saat nama itu diucapkan dan didengar.
            </p>
        </div>
    `;
    
    container.innerHTML = html;
    container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * Mengunduh PDF sertifikat nama yang dibeli
 */
async function downloadPurchasedNamePDF() {
    if (!purchasedNameData) {
        alert('Tidak ada data untuk diunduh.');
        return;
    }
    
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p', 'mm', 'a4');
    const data = purchasedNameData;
    const result = data.result;
    
    pdf.setFontSize(24);
    pdf.setTextColor(212, 175, 55);
    pdf.text('Sertifikat Nama Selaras', 105, 30, { align: 'center' });
    
    pdf.setFontSize(16);
    pdf.setTextColor(0, 0, 0);
    pdf.text('Oracle Nusantara', 105, 45, { align: 'center' });
    
    pdf.setDrawColor(212, 175, 55);
    pdf.line(20, 55, 190, 55);
    
    let yPos = 70;
    pdf.setFontSize(18);
    pdf.text(` ${data.name} `, 105, yPos, { align: 'center' });
    yPos += 15;
    
    pdf.setFontSize(14);
    pdf.setTextColor(0, 0, 0);
    pdf.text(`Kekuatan Nama: ${data.strength}% (${result.strength.label})`, 20, yPos);
    yPos += 10;
    pdf.text(`Nilai Hanacaraka: ${data.hanacarakaTotal}`, 20, yPos);
    yPos += 15;
    
    pdf.setFontSize(12);
    pdf.text(`Tugas Hidup: ${result.tugasHidup?.name || '-'}`, 20, yPos);
    yPos += 8;
    pdf.text(`Jalur Rezeki: ${result.jalurRezeki?.name || '-'}`, 20, yPos);
    yPos += 15;
    
    pdf.text('Saran Penggunaan:', 20, yPos);
    yPos += 8;
    pdf.text(' Gunakan sebagai nama profesional di lingkungan kerja.', 25, yPos);
    yPos += 6;
    pdf.text(' Perkenalkan diri dengan nama ini di lingkungan baru.', 25, yPos);
    yPos += 6;
    pdf.text(' Tidak perlu mengubah dokumen legal.', 25, yPos);
    
    pdf.setFontSize(10);
    pdf.setTextColor(80, 80, 80);
    pdf.text(`Dianalisis dengan Manuritas  oracle-nusantara.com`, 105, 280, { align: 'center' });
    pdf.text(`© 2026 Oracle Nusantara`, 105, 290, { align: 'center' });
    
    pdf.save(`Sertifikat-Nama-${data.name.replace(/\s/g, '-')}.pdf`);
    showSuccessToast(' Sertifikat PDF berhasil diunduh!');
}

// ---------- 3. FUNGSI DISPLAY OPTIONS (DIPANGGIL DARI RAMALAN.HTML) ----------

function displayNameOptions(originalName, currentScore, weton, wuku, data) {
    // Fungsi ini TIDAK digunakan lagi, diganti dengan loadNameOptions
    // Dibiarkan kosong untuk kompatibilitas
    console.log('displayNameOptions is deprecated. Use loadNameOptions instead.');
}

function closeNameOptionsModal() {
    // Tidak digunakan lagi karena inline
}

// Expose ke global
window.generateNameOptions = generateNameOptions;
window.displayNameOptions = displayNameOptions;
window.loadNameOptions = loadNameOptions;
window.closeNameOptionsModal = closeNameOptionsModal;
window.selectAndDisplayNameOption = selectAndDisplayNameOption;
window.downloadPurchasedNamePDF = downloadPurchasedNamePDF;
