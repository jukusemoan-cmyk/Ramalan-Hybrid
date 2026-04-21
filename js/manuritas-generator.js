// ================== MANURITAS GENERATOR ==================
// File: js/manuritas-generator.js
// Versi: 4.0.0 - Final dengan semua perbaikan
// Deskripsi: Generator Nama Selaras + Evaluasi Traits + Hasil Lengkap

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

// ---------- FETCH JSON (UNTUK GENERATOR) ----------
async function fetchJSON(path) {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`HTTP ${res.status} - ${path}`);
    return await res.json();
}

// ---------- GENERATE ANGKA KEBERUNTUNGAN ----------
function generateLuckyNumbers(neptu, hanacaraka) {
    const n1 = (neptu * 7) % 100;
    const n2 = (hanacaraka * 3) % 100;
    const n3 = ((neptu + hanacaraka) * 5) % 100;
    const n4 = (neptu * hanacaraka) % 100;
    return [n1, n2, n3, n4].map(n => n < 10 ? '0' + n : '' + n);
}

// ---------- GENERATE OPSI NAMA (HANYA 1 OPSI) ----------
function generateSingleNameOption(originalName, targetMin, targetMax, weton, wuku) {
    const baseName = originalName.split(' ')[0];
    
    // Ambil kata-kata power dari positive-syllables.json
    const syllablesData = window.positiveSyllablesData;
    let powerWords = [];
    
    if (syllablesData && syllablesData.syllables) {
        powerWords = syllablesData.syllables
            .filter(s => ['kata_tradisional', 'nama_modern', 'tokoh_inspiratif'].includes(s.type))
            .map(s => s.text);
    }
    
    // Default power words jika kosong
    if (powerWords.length === 0) {
        powerWords = ['Utama', 'Wijaya', 'Mahendra', 'Baskara', 'Arkand', 'Kusuma', 'Pratama', 'Wirayuda'];
    }
    
    // Hilangkan duplikat
    const uniqueWords = [...new Set(powerWords)];
    
    // Generate semua kombinasi yang mungkin
    const combinations = [];
    
    // Kombinasi dengan 1 kata tambahan
    uniqueWords.slice(0, 30).forEach(word => {
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
        for (let i = 0; i < Math.min(uniqueWords.length, 15); i++) {
            for (let j = i + 1; j < Math.min(uniqueWords.length, 15); j++) {
                combinations.push({
                    name: `${baseName} ${uniqueWords[i]} ${uniqueWords[j]}`,
                    modType: `Ditambahkan "${uniqueWords[i]} ${uniqueWords[j]}" di belakang nama`,
                    addedWord: `${uniqueWords[i]} ${uniqueWords[j]}`
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
    
    // Kembalikan hanya 1 opsi terbaik
    return validOptions.length > 0 ? validOptions[0] : null;
}

// ---------- LOAD OPSI NAMA (DIPANGGIL SAAT TOMBOL DIKLIK) ----------
async function loadNameOptions(packageType) {
    const config = PACKAGE_CONFIG[packageType];
    if (!config) {
        console.error('Paket tidak valid:', packageType);
        return;
    }
    
    const originalName = document.getElementById('fullName')?.value.trim();
    if (!originalName) {
        alert('Masukkan nama lengkap terlebih dahulu.');
        return;
    }
    
    if (!window.currentUserData) {
        alert('Data belum lengkap. Silakan refresh halaman.');
        return;
    }
    
    // Cek token
    const currentBalance = parseInt(localStorage.getItem('tokenBalance') || '0');
    if (currentBalance < config.tokenCost) {
        if (confirm(`Token Anda tidak cukup (${currentBalance}/${config.tokenCost}). Ingin membeli token sekarang?`)) {
            // Simpan state untuk kembali
            localStorage.setItem('pendingAction', 'generator');
            localStorage.setItem('pendingPackage', packageType);
            window.location.href = 'pricing.html';
        }
        return;
    }
    
    // Potong token
    const newBalance = currentBalance - config.tokenCost;
    localStorage.setItem('tokenBalance', newBalance);
    if (typeof updateTokenDisplay === 'function') updateTokenDisplay();
    if (typeof showSuccessToast === 'function') {
        showSuccessToast(` ${config.tokenCost} Token digunakan. Sisa ${newBalance} Token.`);
    }
    
    if (typeof showLoading === 'function') showLoading(true);
    
    try {
        const currentUserData = window.currentUserData;
        
        // Hitung kekuatan saat ini
        const hanacarakaResult = hanacarakaValue(originalName);
        const currentStrength = calculateNameStrength(
            hanacarakaResult.total, 
            currentUserData.weton.neptu, 
            currentUserData.wuku
        );
        const currentLabel = getStrengthLabel(currentStrength.score);
        
        // Generate 1 opsi terbaik
        const option = generateSingleNameOption(
            originalName,
            config.targetMin,
            config.targetMax,
            currentUserData.weton,
            currentUserData.wuku
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
        displayNameOptionInline(option, config, originalName, currentStrength, currentUserData);
        
    } catch (e) {
        console.error('Gagal generate opsi:', e);
        alert('Terjadi kesalahan saat generate opsi nama.');
    } finally {
        if (typeof showLoading === 'function') showLoading(false);
    }
}

// ---------- TAMPILKAN OPSI NAMA (INLINE DI BAWAH TOMBOL) ----------
function displayNameOptionInline(option, config, originalName, currentStrength, userData) {
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
    
    // Dapatkan traits untuk opsi nama baru
    const weton = userData?.weton || window.currentUserData?.weton;
    const wuku = userData?.wuku || window.currentUserData?.wuku;
    
    let traitsHTML = '';
    if (option.strength >= 60) {
        const traits = getTraitsForName(option.name, option.strength, weton, wuku, 'kelebihan', 2);
        traitsHTML = renderTraitsHTML(traits, 'Kelebihan Nama', 'check-circle', '#64C864');
    } else {
        const traits = getTraitsForName(option.name, option.strength, weton, wuku, 'kekurangan', 2);
        traitsHTML = renderTraitsHTML(traits, 'Area yang Perlu Diperkuat', 'exclamation-triangle', '#D4AF37');
    }
    
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
                        (Nama asli: ${window.pendingPurchaseData?.originalHanacaraka || 0})
                    </p>
                </div>
                
                ${traitsHTML}
                
                <button class="btn-premium" onclick="purchaseSelectedName()" 
                        style="width: 100%; padding: 16px; font-size: 1.1rem; margin-top: 20px;">
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
    
    const currentBalance = parseInt(localStorage.getItem('tokenBalance') || '0');
    if (currentBalance < data.config.tokenCost) {
        alert('Token tidak cukup.');
        return;
    }
    
    const newBalance = currentBalance - data.config.tokenCost;
    localStorage.setItem('tokenBalance', newBalance);
    if (typeof updateTokenDisplay === 'function') updateTokenDisplay();
    
    if (typeof showLoading === 'function') showLoading(true);
    
    try {
        const currentUserData = window.currentUserData;
        
        // Load data Manuritas lengkap
        const manuritasData = {
            tugasHidup: await fetchJSON('../data/manuritas-tugas-hidup.json'),
            watak: await fetchJSON('../data/manuritas-watak.json'),
            titikLuka: await fetchJSON('../data/manuritas-titik-luka.json'),
            jalurRezeki: await fetchJSON('../data/manuritas-jalur-rezeki.json'),
            kelebihan: window.manuritasTraitsData?.templates?.filter(t => t.type === 'kelebihan') || [],
            kekurangan: window.manuritasTraitsData?.templates?.filter(t => t.type === 'kekurangan') || [],
            saran: await fetchJSON('../data/manuritas-saran-nama.json'),
            petaEnergi: await fetchJSON('../data/manuritas-peta-energi.json'),
            extreme: window.manuritasExtremeData
        };
        
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
        
        window.purchasedNameData = {
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
        
        displayPurchasedNameResultNew(window.purchasedNameData);
        
        if (typeof showSuccessToast === 'function') {
            showSuccessToast(` Nama "${data.option.name}" berhasil dibeli!`);
        }
        
    } catch (e) {
        console.error('Gagal membeli nama:', e);
        alert('Terjadi kesalahan saat memproses pembelian: ' + e.message);
    } finally {
        if (typeof showLoading === 'function') showLoading(false);
        window.pendingPurchaseData = null;
    }
}

// ---------- TAMPILKAN HASIL PEMBELIAN (LENGKAP) ----------
function displayPurchasedNameResultNew(data) {
    const container = document.getElementById('nameOptionsContainer');
    if (!container) return;
    
    const result = data.result;
    const tugas = result.tugasHidup || { name: 'Sang Pencari Jati Diri', description: 'Perjalanan menemukan makna hidup melalui pengalaman dan refleksi mendalam.' };
    const rezeki = result.jalurRezeki || { name: 'Kreativitas & Pelayanan', description: 'Rezeki mengalir melalui karya kreatif dan bantuan tulus kepada sesama.', fields: ['Seni', 'Pendidikan', 'Konsultasi', 'Layanan Masyarakat'] };
    const titikLuka = result.titikLuka || { age: 28, cause: 'pengkhianatan atau kekecewaan masa lalu', healing: 'memaafkan dan menerima bahwa semua adalah proses pembelajaran.' };
    const peta = result.petaEnergi || { physical: [{ area: 'Leher dan Bahu', prevention: 'Peregangan rutin dan hindari stres berlebihan.' }], psychological: [] };
    
    const strengthDiff = data.strength - data.originalStrength;
    const hanacarakaDiff = data.hanacarakaTotal - data.originalHanacaraka;
    
    const wordAnalysis = analyzeAddedWord(data.addedWord);
    
    // Dapatkan traits untuk nama baru
    const weton = window.currentUserData?.weton;
    const wuku = window.currentUserData?.wuku;
    const kelebihanTraits = getTraitsForName(data.name, data.strength, weton, wuku, 'kelebihan', 4);
    const kekuranganTraits = getTraitsForName(data.name, data.strength, weton, wuku, 'kekurangan', 2);
    
    // Data premium tambahan
    const elemenDominan = result.hanacaraka.dominantElement;
    const warna = window.warnaKeberuntunganData?.colors?.[elemenDominan] || { primary: ['Emas'], secondary: ['Putih'] };
    const kristal = window.kristalData?.crystals?.[elemenDominan] || { name: 'Clear Quartz', benefits: 'Membersihkan energi.' };
    const pekerjaan = window.pekerjaanData?.jobs?.[elemenDominan]?.fields || ['Manager', 'Analis'];
    const afirmasi = window.afirmasiData?.affirmations?.[elemenDominan] || ['Aku percaya diri.', 'Aku sukses.'];
    const angkaHoki = generateLuckyNumbers(weton?.neptu || 10, data.hanacarakaTotal);
    
    // Generate rangkuman
    const rangkuman = generateSummaryForNewName(data, result, kelebihanTraits, kekuranganTraits);
    
    let html = `
        <div style="margin-top: 32px; background: linear-gradient(145deg, rgba(20,20,25,0.98), rgba(10,10,12,0.98)); 
                    border-radius: 24px; padding: 32px; border: 2px solid #D4AF37;">
            
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
            
            <div style="background: rgba(15,15,20,0.8); border-radius: 16px; padding: 20px; margin-bottom: 24px;">
                <h4 style="color: #D4AF37; margin-bottom: 16px;"><i class="fas fa-chart-bar"></i> PERBANDINGAN DENGAN NAMA LAMA</h4>
                <table style="width: 100%; color: #E5E5E5; border-collapse: collapse; text-align: center;">
                    <tr style="border-bottom: 1px solid rgba(212,175,55,0.3);">
                        <th style="padding: 12px; text-align: left;"></th>
                        <th style="padding: 12px;">Nama Lama</th>
                        <th style="padding: 12px;">Nama Baru</th>
                    </tr>
                    <tr><td>Nama</td><td>${data.originalName}</td><td style="color: #64C864;">${data.name}</td></tr>
                    <tr><td>Kekuatan</td><td>${data.originalStrength}% (${data.originalLabel})</td>
                        <td style="color: #64C864;">${data.strength}% (${data.strengthLabel})  +${strengthDiff}%</td></tr>
                    <tr><td>Hanacaraka</td><td>${data.originalHanacaraka}</td>
                        <td style="color: #64C864;">${data.hanacarakaTotal} (+${hanacarakaDiff})</td></tr>
                </table>
            </div>
            
            <div class="analysis-section-card">
                <h4><i class="fas fa-magic" style="color:#D4AF37;"></i> PENJELASAN MODIFIKASI</h4>
                <p>${data.modificationType}. Kata <strong>"${data.addedWord}"</strong> memiliki nilai Hanacaraka ${wordAnalysis.value} dengan elemen <strong>${wordAnalysis.element}</strong>, yang ${wordAnalysis.effect}.</p>
            </div>
            
            <div class="analysis-section-card">
                <h4><i class="fas fa-bullseye" style="color:#D4AF37;"></i> TUGAS HIDUP (BARU): ${tugas.name}</h4>
                <p>${tugas.description}</p>
            </div>
            
            <div class="analysis-section-card">
                <h4><i class="fas fa-coins" style="color:#D4AF37;"></i> JALUR REZEKI (BARU): ${rezeki.name}</h4>
                <p>${rezeki.description}</p>
                <p><strong>Bidang cocok:</strong> ${rezeki.fields?.join(', ') || '-'}</p>
            </div>
            
            <div class="analysis-section-card">
                <h4><i class="fas fa-check-circle" style="color:#64C864;"></i> KELEBIHAN NAMA BARU</h4>
                ${kelebihanTraits.length > 0 ? kelebihanTraits.map(k => `<p style="margin-bottom:8px;"> ${k.text}</p>`).join('') : '<p>Energi nama ini seimbang dan harmonis.</p>'}
            </div>
            
            <div class="analysis-section-card">
                <h4><i class="fas fa-exclamation-triangle" style="color:#FF8A8A;"></i> AREA YANG PERLU DIPERKUAT</h4>
                ${kekuranganTraits.length > 0 ? kekuranganTraits.map(k => `<p style="margin-bottom:8px;"> ${k.text}</p>`).join('') : '<p>Tidak ada area kelemahan signifikan yang terdeteksi.</p>'}
            </div>
            
            <div class="analysis-section-card">
                <h4><i class="fas fa-heart" style="color:#D4AF37;"></i> TITIK LUKA BATIN (Usia ${titikLuka.age})</h4>
                <p><strong>Penyebab:</strong> ${titikLuka.cause}</p>
                <p><strong>Penyembuhan:</strong> ${titikLuka.healing}</p>
            </div>
            
            ${peta.physical?.length > 0 ? `
            <div class="analysis-section-card">
                <h4><i class="fas fa-heartbeat" style="color:#D4AF37;"></i> PETA KERENTANAN FISIK</h4>
                <p><strong>Area:</strong> ${peta.physical[0]?.area || '-'}</p>
                <p><strong>Preventif:</strong> ${peta.physical[0]?.prevention || '-'}</p>
            </div>
            ` : ''}
            
            <div class="analysis-section-card">
                <h4><i class="fas fa-clover"></i> KEBERUNTUNGAN ANDA</h4>
                <p><strong> Angka:</strong> ${angkaHoki.join('  ')}</p>
                <p><strong> Warna:</strong> ${warna.primary?.join(', ')}</p>
                <p><strong> Kristal:</strong> ${kristal.name} - ${kristal.benefits}</p>
            </div>
            
            <div class="analysis-section-card">
                <h4><i class="fas fa-briefcase"></i> BIDANG PEKERJAAN COCOK</h4>
                <p>${pekerjaan.slice(0, 5).join(', ')}</p>
            </div>
            
            <div class="analysis-section-card">
                <h4><i class="fas fa-quote-right"></i> AFIRMASI HARIAN</h4>
                <p>"${afirmasi[0]}"</p>
            </div>
            
            <div class="analysis-section-card">
                <h4><i class="fas fa-scroll"></i> RANGKUMAN</h4>
                ${rangkuman}
            </div>
            
            <div class="analysis-section-card">
                <h4><i class="fas fa-lightbulb" style="color:#D4AF37;"></i> SARAN PENGGUNAAN</h4>
                <p> Gunakan <strong>"${data.name}"</strong> sebagai nama profesional di LinkedIn, email, atau kartu nama.</p>
                <p> Perkenalkan diri dengan nama ini di lingkungan baru untuk menarik energi positif.</p>
                <p> Tidak perlu mengubah dokumen legal, getaran nama bekerja saat diucapkan.</p>
            </div>
            
            <div style="display:flex; justify-content:center; gap:16px; margin-top:28px;">
                <button class="btn-pdf" onclick="downloadPurchasedNamePDF()">
                    <i class="fas fa-download"></i> UNDUH SERTIFIKAT PDF
                </button>
                <button class="btn-share" onclick="sharePurchasedName()">
                    <i class="fas fa-share-alt"></i> BAGIKAN
                </button>
            </div>
            
            <div style="display:flex; justify-content:center; gap:16px; margin-top:20px;">
                <span class="badge" style="background:#D4AF37; color:#0A0A0C;"><i class="fas fa-crown"></i> Premium Member</span>
                <span class="badge" style="background:#64C864; color:#0A0A0C;"><i class="fas fa-medal"></i> Nama Baru Diaktifkan</span>
            </div>
            
            <p style="text-align: center; margin-top: 20px; font-size: 0.9rem; opacity: 0.7; font-style: italic;">
                 Perubahan nama tidak harus legal. Energi nama bekerja melalui getaran saat nama itu diucapkan dan didengar.
            </p>
        </div>
    `;
    
    container.innerHTML = html;
    container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ---------- FUNGSI PEMBANTU ----------

function generateSummaryForNewName(data, result, kelebihan, kekurangan) {
    const strength = data.strength;
    const hanacaraka = data.hanacarakaTotal;
    const elemen = result.hanacaraka.dominantElement;
    const tugas = result.tugasHidup?.name || 'Sang Pencari Jati Diri';
    const rezeki = result.jalurRezeki?.name || 'Kreativitas & Pelayanan';
    
    const p1 = `Nama barumu "${data.name}" memiliki getaran ${hanacaraka} poin dengan dominasi elemen ${elemen}. Kekuatan mencapai ${strength}% (${data.strengthLabel}), menandakan fondasi energetik yang ${strength >= 60 ? 'kokoh dan mendukung' : 'perlu dioptimalkan'}.`;
    
    const p2 = `Misi utamamu hadir sebagai "${tugas}". Jalan kemakmuran mengarah pada "${rezeki}". Keduanya saling bertaut membentuk cetak biru takdir personalmu.`;
    
    const p3 = `Kelebihan nama ini meliputi ${kelebihan.slice(0, 2).map(k => k.text.toLowerCase()).join(' serta ') || 'energi yang seimbang'}. Area yang perlu diperkuat adalah ${kekurangan.slice(0, 1).map(k => k.text.toLowerCase()).join('') || 'tidak ada yang signifikan'}.`;
    
    const p4 = `Gunakan nama ini dalam kehidupan profesional dan sosial. Ucapkan dengan penuh kesadaran karena nama adalah doa. Jaga keseimbangan antara ambisi dan istirahat.`;
    
    return `<p style="margin-bottom:16px; text-align:justify;">${p1}</p>
            <p style="margin-bottom:16px; text-align:justify;">${p2}</p>
            <p style="margin-bottom:16px; text-align:justify;">${p3}</p>
            <p style="margin-bottom:0; text-align:justify;">${p4}</p>`;
}

function sharePurchasedName() {
    const data = window.purchasedNameData;
    if (!data) return;
    
    const shareText = ` AKU PUNYA NAMA BARU! \n\nNama Baru: ${data.name}\nKekuatan: ${data.strength}% (${data.strengthLabel})\nTugas Hidup: ${data.result?.tugasHidup?.name || '-'}\n\n#OracleNusantara #NamaSelaras #CetakBiruDiriku`;
    
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
}

// ---------- ANALISIS KATA TAMBAHAN ----------
function analyzeAddedWord(word) {
  const syllablesData = window.positiveSyllablesData;
  
  // Cek di positive-syllables.json dulu
  if (syllablesData && syllablesData.syllables) {
    const wordData = syllablesData.syllables.find(s => s.text === word);
    if (wordData) {
      return {
        value: wordData.hanacaraka_value,
        element: wordData.element,
        effect: wordData.energy
      };
    }
  }
  
  // Fallback: hitung manual
  let value = 0;
  try {
    if (typeof hanacarakaValue === 'function') {
      value = hanacarakaValue(word).total;
    } else {
      // Perhitungan sederhana
      value = word.length * 5;
    }
  } catch(e) {
    value = word.length * 5;
  }
  
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

// ---------- DOWNLOAD SERTIFIKAT PDF ----------
async function downloadPurchasedNamePDF() {
  console.log('🔵 downloadPurchasedNamePDF called');
  
  const data = window.purchasedNameData;
  if (!data) {
    showErrorToast('Tidak ada data untuk diunduh.');
    return;
  }
  
  try {
    const { jsPDF } = window.jspdf;
    if (!jsPDF) {
      showErrorToast('Library PDF tidak terload. Refresh halaman.');
      return;
    }
    
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
    
    // Nama Baru
    pdf.setFontSize(18);
    pdf.text(`✨ ${data.name} ✨`, 105, yPos, { align: 'center' });
    yPos += 15;
    
    // Kekuatan
    pdf.setFontSize(14);
    pdf.text(`Kekuatan Nama: ${data.strength}% (${data.strengthLabel})`, 20, yPos);
    yPos += 10;
    pdf.text(`Nilai Hanacaraka: ${data.hanacarakaTotal}`, 20, yPos);
    yPos += 10;
    pdf.text(`Nama Asli: ${data.originalName} (${data.originalStrength}%)`, 20, yPos);
    yPos += 15;
    
    // Tugas Hidup & Jalur Rezeki
    pdf.setFontSize(12);
    pdf.text(`Tugas Hidup: ${data.result?.tugasHidup?.name || '-'}`, 20, yPos);
    yPos += 8;
    pdf.text(`Jalur Rezeki: ${data.result?.jalurRezeki?.name || '-'}`, 20, yPos);
    yPos += 15;
    
    // Saran Penggunaan
    pdf.setFontSize(11);
    pdf.setTextColor(80, 80, 80);
    pdf.text('Saran Penggunaan:', 20, yPos);
    yPos += 6;
    pdf.text('• Gunakan sebagai nama profesional di lingkungan kerja.', 25, yPos);
    yPos += 6;
    pdf.text('• Perkenalkan diri dengan nama ini di lingkungan baru.', 25, yPos);
    yPos += 6;
    pdf.text('• Tidak perlu mengubah dokumen legal.', 25, yPos);
    yPos += 15;
    
    // Footer
    pdf.setFontSize(10);
    pdf.text(`Dianalisis dengan Manuritas • oracle-nusantara.com`, 105, 280, { align: 'center' });
    pdf.text(`© 2026 Oracle Nusantara • Diterbitkan oleh Doni Chandra Utama`, 105, 290, { align: 'center' });
    
    pdf.save(`Sertifikat-Nama-${data.name.replace(/\s/g, '-')}.pdf`);
    showSuccessToast('📄 Sertifikat PDF berhasil diunduh!');
    
  } catch(e) {
    console.error('❌ Error downloadPurchasedNamePDF:', e);
    showErrorToast('Gagal mengunduh PDF: ' + e.message);
  }
}

// ---------- EXPOSE KE GLOBAL ----------
window.PACKAGE_CONFIG = PACKAGE_CONFIG;
window.getStrengthLabel = getStrengthLabel;
window.loadNameOptions = loadNameOptions;
window.purchaseSelectedName = purchaseSelectedName;
window.sharePurchasedName = sharePurchasedName;
window.analyzeAddedWord = analyzeAddedWord;
window.downloadPurchasedNamePDF = downloadPurchasedNamePDF;


console.log(' manuritas-generator.js v4.0.0 loaded');
