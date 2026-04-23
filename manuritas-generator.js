// ================== MANURITAS GENERATOR ==================
// File: js/manuritas-generator.js
// Versi: 5.0.0 - Preview 3 Opsi Gratis + Harga Baru
// Deskripsi: Generator Nama Selaras + 3 Opsi Preview + Sertifikat Berbayar

// ---------- FORCE OVERRIDE TOAST FUNCTIONS (FIX RECURSION) ----------
(function() {
    window.showSuccessToast = function(message) {
        console.log(' Toast success:', message);
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(145deg, #1a3a1a, #0d1f0d);
            color: #64C864;
            padding: 12px 24px;
            border-radius: 50px;
            border: 1px solid #64C864;
            box-shadow: 0 4px 20px rgba(0,0,0,0.5);
            z-index: 9999;
            font-weight: bold;
            max-width: 90vw;
        `;
        toast.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 5000);
    };
    
    window.showErrorToast = function(message) {
        console.log(' Toast error:', message);
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(145deg, #3a1a1a, #1f0d0d);
            color: #FF8A8A;
            padding: 12px 24px;
            border-radius: 50px;
            border: 1px solid #FF8A8A;
            box-shadow: 0 4px 20px rgba(0,0,0,0.5);
            z-index: 9999;
            font-weight: bold;
            max-width: 90vw;
        `;
        toast.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 5000);
    };
    
    console.log(' Toast functions force-override applied');
})();

// ---------- KONFIGURASI PAKET (HARGA BARU) ----------
const PACKAGE_CONFIG = {
    silver: { 
        name: 'SILVER', 
        targetMin: 60, 
        targetMax: 74, 
        tokenCost: 20,        // HARGA BARU
        displayTarget: '60-74%'
    },
    gold: { 
        name: 'GOLD', 
        targetMin: 75, 
        targetMax: 89, 
        tokenCost: 50,        // HARGA BARU
        displayTarget: '75-89%'
    },
    platinum: { 
        name: 'PLATINUM', 
        targetMin: 90, 
        targetMax: 100, 
        tokenCost: 100,       // HARGA BARU
        displayTarget: '90-100%'
    }
};

// ---------- TRAITS FUNCTIONS ----------
function getTraitsForName(name, strengthScore, weton, wuku, filterType, limit = 2) {
  const traitsData = window.manuritasTraitsData;
  if (!traitsData || !traitsData.templates) {
    return [];
  }
  
  const templates = traitsData.templates.filter(t => {
    if (filterType && t.type !== filterType) return false;
    return true;
  });
  
  const uniqueTemplates = [];
  const seenTexts = new Set();
  
  for (let t of templates) {
    if (!seenTexts.has(t.text)) {
      seenTexts.add(t.text);
      uniqueTemplates.push(t);
    }
  }
  
  return uniqueTemplates.slice(0, limit);
}

function renderTraitsHTML(traits, title, icon, color) {
  if (!traits || traits.length === 0) return '';
  
  let html = `
    <div style="margin-top: 16px;">
      <h5 style="color: ${color}; margin-bottom: 8px; display: flex; align-items: center; gap: 6px; font-size: 0.95rem;">
        <i class="fas fa-${icon}"></i> ${title}
      </h5>
  `;
  
  traits.forEach(t => {
    html += `<p style="margin-bottom: 4px; color: #B0B0C0; font-size: 0.9rem;"> ${t.text}</p>`;
  });
  
  html += `</div>`;
  return html;
}

// ---------- LABEL PERSENTASE ----------
function getStrengthLabel(score) {
    if (score >= 90) return { label: 'SANGAT KUAT', stars: '', class: 'sangat-kuat' };
    if (score >= 75) return { label: 'KUAT', stars: '', class: 'kuat' };
    if (score >= 60) return { label: 'CUKUP', stars: '', class: 'cukup' };
    if (score >= 40) return { label: 'KURANG', stars: '', class: 'kurang' };
    return { label: 'LEMAH', stars: '', class: 'lemah' };
}

// ---------- FETCH JSON ----------
async function fetchJSON(path) {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`HTTP ${res.status} - ${path}`);
    return await res.json();
}

// ---------- GENERATE 3 OPSI NAMA (BARU) ----------
function generateMultipleNameOptions(originalName, targetMin, targetMax, weton, wuku, maxOptions = 3) {
  const baseName = originalName.split(' ')[0];
  
  const syllablesData = window.positiveSyllablesData;
  let powerWords = [];
  
  if (syllablesData && syllablesData.syllables) {
    powerWords = syllablesData.syllables
      .filter(s => ['kata_tradisional', 'nama_modern', 'tokoh_inspiratif'].includes(s.type))
      .map(s => s.text);
  }
  
  if (powerWords.length === 0) {
    console.warn(' positiveSyllablesData kosong, menggunakan default');
    powerWords = ['Utama', 'Wijaya', 'Mahendra', 'Baskara', 'Arkand', 'Kusuma', 'Pratama', 'Wirayuda', 'Ananta', 'Dirgantara', 'Samudra', 'Cakrawala'];
  }
  
  const uniqueWords = [...new Set(powerWords)];
  const combinations = [];
  
  // Kombinasi 1 kata (depan & belakang)
  uniqueWords.slice(0, 40).forEach(word => {
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
  
  // Kombinasi 2 kata (untuk target tinggi)
  if (targetMin >= 75) {
    for (let i = 0; i < Math.min(uniqueWords.length, 20); i++) {
      for (let j = i + 1; j < Math.min(uniqueWords.length, 20); j++) {
        combinations.push({
          name: `${baseName} ${uniqueWords[i]} ${uniqueWords[j]}`,
          modType: `Ditambahkan "${uniqueWords[i]} ${uniqueWords[j]}" di belakang nama`,
          addedWord: `${uniqueWords[i]} ${uniqueWords[j]}`
        });
        combinations.push({
          name: `${uniqueWords[i]} ${baseName} ${uniqueWords[j]}`,
          modType: `Ditambahkan "${uniqueWords[i]}" di depan dan "${uniqueWords[j]}" di belakang`,
          addedWord: `${uniqueWords[i]} + ${uniqueWords[j]}`
        });
      }
    }
  }
  
  console.log(` Mencoba ${combinations.length} kombinasi...`);
  
  const validOptions = [];
  const seenNames = new Set();
  
  combinations.forEach(combo => {
    if (seenNames.has(combo.name)) return;
    seenNames.add(combo.name);
    
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
  
  console.log(` Ditemukan ${validOptions.length} opsi valid`);
  
  validOptions.sort((a, b) => b.strength - a.strength);
  
  // Jika tidak cukup opsi, cari yang terdekat
  if (validOptions.length < maxOptions) {
    console.warn(` Hanya ${validOptions.length} opsi dalam rentang target, mencari opsi terdekat...`);
    
    const fallbackOptions = [];
    const seenFallback = new Set(validOptions.map(o => o.name));
    
    combinations.forEach(combo => {
      if (seenFallback.has(combo.name)) return;
      seenFallback.add(combo.name);
      
      const hanacarakaResult = hanacarakaValue(combo.name);
      const strength = calculateNameStrength(hanacarakaResult.total, weton.neptu, wuku);
      
      fallbackOptions.push({
        name: combo.name,
        strength: strength.score,
        strengthLabel: getStrengthLabel(strength.score).label,
        strengthStars: getStrengthLabel(strength.score).stars,
        modificationType: combo.modType,
        addedWord: combo.addedWord,
        hanacarakaTotal: hanacarakaResult.total,
        originalName: originalName
      });
    });
    
    fallbackOptions.sort((a, b) => {
      const diffA = Math.min(Math.abs(a.strength - targetMin), Math.abs(a.strength - targetMax));
      const diffB = Math.min(Math.abs(b.strength - targetMin), Math.abs(b.strength - targetMax));
      return diffA - diffB;
    });
    
    const needed = maxOptions - validOptions.length;
    validOptions.push(...fallbackOptions.slice(0, needed));
  }
  
  return validOptions.slice(0, maxOptions);
}

// ---------- LOAD OPSI NAMA (PREVIEW GRATIS - TIDAK POTONG TOKEN) ----------
async function loadNameOptions(packageType) {
  console.log(' loadNameOptions called with:', packageType);
  
  const config = PACKAGE_CONFIG[packageType];
  if (!config) {
    console.error(' Paket tidak valid:', packageType);
    return;
  }
  
  const originalName = document.getElementById('fullName')?.value.trim();
  if (!originalName) {
    showErrorToast('Masukkan nama lengkap terlebih dahulu.');
    return;
  }
  console.log(' Nama lengkap:', originalName);
  
  if (!window.currentUserData) {
    showErrorToast('Data belum lengkap. Silakan refresh halaman atau klik SINGKAP RAMALAN terlebih dahulu.');
    return;
  }
  console.log(' currentUserData tersedia');
  
  // PREVIEW GRATIS - TIDAK POTONG TOKEN!
  console.log(' Preview gratis - tidak ada token yang dipotong');
  
  if (typeof showLoading === 'function') showLoading(true);
  
  try {
    const currentUserData = window.currentUserData;
    console.log(' Weton:', currentUserData.weton);
    console.log(' Wuku:', currentUserData.wuku);
    
    const hanacarakaResult = hanacarakaValue(originalName);
    console.log(' Hanacaraka asli:', hanacarakaResult.total);
    
    const currentStrength = calculateNameStrength(
      hanacarakaResult.total, 
      currentUserData.weton.neptu, 
      currentUserData.wuku
    );
    console.log(' Kekuatan asli:', currentStrength.score + '%', currentStrength.label);
    
    // Generate 3 opsi
    const options = generateMultipleNameOptions(
      originalName,
      config.targetMin,
      config.targetMax,
      currentUserData.weton,
      currentUserData.wuku,
      3
    );
    
    console.log(' Opsi yang dihasilkan:', options.length);
    
    // Simpan data untuk pembelian nanti
    window.pendingPurchaseData = {
      originalName: originalName,
      originalStrength: currentStrength.score,
      originalLabel: currentStrength.label,
      originalHanacaraka: hanacarakaResult.total,
      options: options,
      packageType: packageType,
      config: config
    };
    
    // Tampilkan 3 opsi
    displayNameOptionsList(options, config, originalName, currentStrength, currentUserData);
    console.log(' displayNameOptionsList selesai');
    
  } catch (e) {
    console.error(' Gagal generate opsi:', e);
    showErrorToast('Terjadi kesalahan saat generate opsi nama: ' + e.message);
  } finally {
    if (typeof showLoading === 'function') showLoading(false);
  }
}

// ---------- TAMPILKAN 3 OPSI NAMA (BARU) ----------
function displayNameOptionsList(options, config, originalName, currentStrength, userData) {
    const container = document.getElementById('nameOptionsContainer');
    if (!container) return;
    
    const currentLabel = getStrengthLabel(currentStrength.score);
    const weton = userData?.weton || window.currentUserData?.weton;
    const wuku = userData?.wuku || window.currentUserData?.wuku;
    
    let html = `
        <div style="margin-top: 24px;">
            <h4 style="color: #F3E5AB; margin-bottom: 16px; text-align: center;">
                <i class="fas fa-star"></i> ${options.length} Opsi Nama Selaras - Paket ${config.name}
            </h4>
            <p style="margin-bottom: 20px; color: #A0A0B0; text-align: center;">
                Nama asli: <strong>${originalName}</strong> 
                (Kekuatan: ${currentStrength.score}% - ${currentLabel.label})
                <br><span style="font-size: 0.85rem; opacity: 0.8;">Target: ${config.displayTarget}</span>
            </p>
    `;
    
    if (options.length === 0) {
        html += `
            <div style="background: rgba(15,15,20,0.9); border-radius: 16px; padding: 24px; text-align: center; border: 1px solid rgba(212,175,55,0.2);">
                <p style="color: #FF8A8A; font-size: 1.1rem;">
                    <i class="fas fa-exclamation-circle"></i> 
                    Maaf, tidak dapat menemukan opsi nama dengan target ${config.displayTarget}.
                </p>
                <p style="margin-top: 16px; color: #A0A0B0;">
                    Coba paket yang lebih tinggi (Gold/Platinum) untuk mendapatkan opsi yang lebih baik.
                </p>
            </div>
        `;
    } else {
        options.forEach((option, index) => {
            const borderColor = option.strength >= 75 ? '#64C864' : '#D4AF37';
            const traits = option.strength >= 60 
                ? getTraitsForName(option.name, option.strength, weton, wuku, 'kelebihan', 2)
                : getTraitsForName(option.name, option.strength, weton, wuku, 'kekurangan', 2);
            const traitsTitle = option.strength >= 60 ? 'Kelebihan' : 'Area Perlu Diperkuat';
            const traitsIcon = option.strength >= 60 ? 'check-circle' : 'exclamation-triangle';
            const traitsColor = option.strength >= 60 ? '#64C864' : '#D4AF37';
            
            html += `
                <div style="background: linear-gradient(145deg, rgba(20,20,25,0.95), rgba(10,10,12,0.95)); 
                            border-radius: 20px; padding: 24px; margin-bottom: 20px;
                            border: 2px solid ${borderColor};">
                    
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                        <span style="background: ${borderColor}; color: #0A0A0C; padding: 4px 12px; border-radius: 20px; font-weight: 600; font-size: 0.8rem;">
                            OPSI ${index + 1}
                        </span>
                        <span style="color: #A0A0B0; font-size: 0.85rem;">
                            Nilai Hanacaraka: ${option.hanacarakaTotal}
                        </span>
                    </div>
                    
                    <div style="text-align: center; margin-bottom: 16px;">
                        <h3 style="color: #D4AF37; font-size: 1.6rem; margin-bottom: 8px;"> ${option.name} </h3>
                        <div style="font-size: 2.5rem; font-weight: bold; color: ${borderColor};">
                            ${option.strength}%
                        </div>
                        <div style="color: #F3E5AB; font-size: 1rem; margin-top: 4px;">
                            ${option.strengthLabel} ${option.strengthStars}
                        </div>
                    </div>
                    
                    <div style="background: rgba(15,15,20,0.6); border-radius: 12px; padding: 12px; margin-bottom: 16px;">
                        <p style="color: #B0B0C0; font-size: 0.9rem;">
                            <i class="fas fa-magic" style="color: #D4AF37;"></i> 
                            <strong>Modifikasi:</strong> ${option.modificationType}
                        </p>
                    </div>
                    
                    ${renderTraitsHTML(traits, traitsTitle, traitsIcon, traitsColor)}
                    
                    <button class="btn-premium" onclick="purchaseSelectedOption(${index})" 
                            style="width: 100%; padding: 14px; font-size: 1rem; margin-top: 20px; background: ${borderColor}; border-color: ${borderColor}; color: #0A0A0C;">
                        <i class="fas fa-shopping-cart"></i> BELI SERTIFIKAT (${config.tokenCost} Token)
                    </button>
                </div>
            `;
        });
        
        // Pesan jika kurang dari 3 opsi
        if (options.length < 3) {
            html += `
                <div style="background: rgba(212,175,55,0.1); border-radius: 12px; padding: 12px; margin-top: 16px; text-align: center; border: 1px dashed #D4AF37;">
                    <p style="color: #D4AF37; font-size: 0.9rem;">
                        <i class="fas fa-info-circle"></i> 
                        Hanya ditemukan ${options.length} opsi dalam rentang target. Beberapa opsi di atas adalah yang terdekat.
                    </p>
                </div>
            `;
        }
    }
    
    html += `</div>`;
    
    container.innerHTML = html;
    container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ---------- BELI OPSI YANG DIPILIH (BARU) ----------
async function purchaseSelectedOption(optionIndex) {
    const data = window.pendingPurchaseData;
    if (!data || !data.options || !data.options[optionIndex]) {
        showErrorToast('Tidak ada opsi nama yang dipilih.');
        return;
    }
    
    const selectedOption = data.options[optionIndex];
    const currentBalance = parseInt(localStorage.getItem('tokenBalance') || '0');
    
    if (currentBalance < data.config.tokenCost) {
        if (confirm(`Token Anda tidak cukup (${currentBalance}/${data.config.tokenCost}). Ingin membeli token sekarang?`)) {
            localStorage.setItem('pendingAction', 'generator');
            localStorage.setItem('pendingPackage', data.packageType);
            window.location.href = 'pricing.html';
        }
        return;
    }
    
    // Potong token
    const newBalance = currentBalance - data.config.tokenCost;
    localStorage.setItem('tokenBalance', newBalance);
    if (typeof updateTokenDisplay === 'function') updateTokenDisplay();
    
    showSuccessToast(` ${data.config.tokenCost} Token digunakan. Sisa ${newBalance} Token.`);
    
    if (typeof showLoading === 'function') showLoading(true);
    
    try {
        const currentUserData = window.currentUserData;
        
        // Load data Manuritas lengkap
        const manuritasData = {
            tugasHidup: await fetchJSON('../data/manuritas-tugas-hidup.json').catch(() => ({ templates: [] })),
            watak: await fetchJSON('../data/manuritas-watak.json').catch(() => ({ templates: [] })),
            titikLuka: await fetchJSON('../data/manuritas-titik-luka.json').catch(() => ({ templates: [] })),
            jalurRezeki: await fetchJSON('../data/manuritas-jalur-rezeki.json').catch(() => ({ templates: [] })),
            kelebihan: window.manuritasTraitsData?.templates?.filter(t => t.type === 'kelebihan') || [],
            kekurangan: window.manuritasTraitsData?.templates?.filter(t => t.type === 'kekurangan') || [],
            saran: await fetchJSON('../data/manuritas-saran-nama.json').catch(() => ({ templates: [] })),
            petaEnergi: await fetchJSON('../data/manuritas-peta-energi.json').catch(() => ({ physical: [], psychological: [] })),
            extreme: window.manuritasExtremeData || { templates: [] }
        };
        
        const result = await calculateManuritas(
            selectedOption.name,
            currentUserData.weton,
            currentUserData.wuku,
            manuritasData
        );
        
        if (!result) {
            showErrorToast('Gagal menghitung analisis.');
            return;
        }
        
        window.purchasedNameData = {
            name: selectedOption.name,
            strength: selectedOption.strength,
            strengthLabel: selectedOption.strengthLabel,
            strengthStars: selectedOption.strengthStars,
            originalName: data.originalName,
            originalStrength: data.originalStrength,
            originalLabel: data.originalLabel,
            originalHanacaraka: data.originalHanacaraka,
            modificationType: selectedOption.modificationType,
            addedWord: selectedOption.addedWord,
            hanacarakaTotal: selectedOption.hanacarakaTotal,
            result: result,
            packageType: data.packageType,
            purchasedAt: new Date().toISOString()
        };
        
        displayPurchasedNameResultNew(window.purchasedNameData);
        
        showSuccessToast(` Sertifikat "${selectedOption.name}" berhasil dibeli!`);
        
    } catch (e) {
        console.error('Gagal membeli nama:', e);
        showErrorToast('Terjadi kesalahan saat memproses pembelian: ' + e.message);
    } finally {
        if (typeof showLoading === 'function') showLoading(false);
    }
}

// ---------- TAMPILKAN HASIL PEMBELIAN (SERTIFIKAT LENGKAP) ----------
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
    
    const weton = window.currentUserData?.weton;
    const wuku = window.currentUserData?.wuku;
    const kelebihanTraits = getTraitsForName(data.name, data.strength, weton, wuku, 'kelebihan', 4);
    const kekuranganTraits = getTraitsForName(data.name, data.strength, weton, wuku, 'kekurangan', 2);
    
    const elemenDominan = result.hanacaraka.dominantElement;
    const warna = window.warnaKeberuntunganData?.colors?.[elemenDominan] || { primary: ['Emas'], secondary: ['Putih'] };
    const kristal = window.kristalData?.crystals?.[elemenDominan] || { name: 'Clear Quartz', benefits: 'Membersihkan energi.' };
    const pekerjaan = window.pekerjaanData?.jobs?.[elemenDominan]?.fields || ['Manager', 'Analis'];
    const afirmasi = window.afirmasiData?.affirmations?.[elemenDominan] || ['Aku percaya diri.', 'Aku sukses.'];
    const angkaHoki = generateLuckyNumbers(weton?.neptu || 10, data.hanacarakaTotal);
    
    const rangkuman = generateSummaryForNewName(data, result, kelebihanTraits, kekuranganTraits);
    
    let html = `
        <div style="margin-top: 32px; background: linear-gradient(145deg, rgba(20,20,25,0.98), rgba(10,10,12,0.98)); 
                    border-radius: 24px; padding: 32px; border: 2px solid #D4AF37;">
            
            <div style="text-align: center; margin-bottom: 32px;">
                <div style="font-size: 1.2rem; color: #64C864; margin-bottom: 8px;">
                    <i class="fas fa-check-circle"></i> SELAMAT! Anda telah memilih nama baru:
                </div>
                <h2 style="color: #D4AF37; font-size: 2.2rem; margin-bottom: 12px;"> ${data.name} </h2>
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
                    <tr><td style="padding: 8px;">Nama</td><td>${data.originalName}</td><td style="color: #64C864;">${data.name}</td></tr>
                    <tr><td style="padding: 8px;">Kekuatan</td><td>${data.originalStrength}% (${data.originalLabel})</td>
                        <td style="color: #64C864;">${data.strength}% (${data.strengthLabel})  +${strengthDiff}%</td></tr>
                    <tr><td style="padding: 8px;">Hanacaraka</td><td>${data.originalHanacaraka}</td>
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
                ${kelebihanTraits.length > 0 ? kelebihanTraits.map(k => `<p style="margin-bottom:8px;"> ${k.text}</p>`).join('') : '<p>Energi nama ini seimbang dan harmonis.</p>'}
            </div>
            
            <div class="analysis-section-card">
                <h4><i class="fas fa-exclamation-triangle" style="color:#FF8A8A;"></i> AREA YANG PERLU DIPERKUAT</h4>
                ${kekuranganTraits.length > 0 ? kekuranganTraits.map(k => `<p style="margin-bottom:8px;"> ${k.text}</p>`).join('') : '<p>Tidak ada area kelemahan signifikan yang terdeteksi.</p>'}
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
                <p><strong> Angka:</strong> ${angkaHoki.join('  ')}</p>
                <p><strong> Warna:</strong> ${warna.primary?.join(', ')}</p>
                <p><strong> Kristal:</strong> ${kristal.name} - ${kristal.benefits}</p>
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
                <p> Gunakan <strong>"${data.name}"</strong> sebagai nama profesional di LinkedIn, email, atau kartu nama.</p>
                <p> Perkenalkan diri dengan nama ini di lingkungan baru untuk menarik energi positif.</p>
                <p> Tidak perlu mengubah dokumen legal, getaran nama bekerja saat diucapkan.</p>
            </div>
            
            <div style="display:flex; justify-content:center; gap:16px; margin-top:28px; flex-wrap:wrap;">
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
                 Perubahan nama tidak harus legal. Energi nama bekerja melalui getaran saat nama itu diucapkan dan didengar.
            </p>
        </div>
    `;
    
    container.innerHTML = html;
    container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // Auto-activate badges
    setTimeout(() => {
        const fullNameInput = document.getElementById('fullName');
        if (fullNameInput) fullNameInput.value = data.name;
        if (typeof updateGeneratorPackages === 'function') {
            updateGeneratorPackages(data.strength);
        }
    }, 100);
}

// ---------- FUNGSI PEMBANTU ----------

function generateSummaryForNewName(data, result, kelebihan, kekurangan) {
  const strength = data.strength;
  const hanacaraka = data.hanacarakaTotal;
  const elemen = result.hanacaraka.dominantElement;
  const tugas = result.tugasHidup?.name || 'Sang Pencari Jati Diri';
  const rezeki = result.jalurRezeki?.name || 'Kreativitas & Pelayanan';
  
  const uniqueKelebihan = [...new Set(kelebihan.map(k => k.text))];
  const uniqueKekurangan = [...new Set(kekurangan.map(k => k.text))];
  
  const p1 = `Nama barumu "${data.name}" memiliki getaran ${hanacaraka} poin dengan dominasi elemen ${elemen}. Kekuatan mencapai ${strength}% (${data.strengthLabel}), menandakan fondasi energetik yang ${strength >= 60 ? 'kokoh dan mendukung perjalanan hidupmu' : 'perlu dioptimalkan untuk hasil maksimal'}.`;
  
  const p2 = `Misi utamamu hadir sebagai "${tugas}". Jalan kemakmuran mengarah pada "${rezeki}". Keduanya saling bertaut membentuk cetak biru takdir personalmu yang unik.`;
  
  const kelebihanText = uniqueKelebihan.length > 0 ? uniqueKelebihan.join(' ') : 'energi yang seimbang dan harmonis';
  const kekuranganText = uniqueKekurangan.length > 0 ? uniqueKekurangan.join(' ') : 'tidak ada yang signifikan';
  
  const p3 = `Kelebihan nama ini meliputi: ${kelebihanText}. Sementara area yang perlu diperkuat adalah: ${kekuranganText}.`;
  
  const p4 = `Gunakan nama ini dalam kehidupan profesional dan sosial. Ucapkan dengan penuh kesadaran karena nama adalah doa yang terus bergetar. Jaga keseimbangan antara ambisi dan istirahat agar energi tetap mengalir harmonis.`;
  
  return `<p style="margin-bottom:16px; text-align:justify;">${p1}</p>
          <p style="margin-bottom:16px; text-align:justify;">${p2}</p>
          <p style="margin-bottom:16px; text-align:justify;">${p3}</p>
          <p style="margin-bottom:0; text-align:justify;">${p4}</p>`;
}

function sharePurchasedName() {
    const data = window.purchasedNameData;
    if (!data) return;
    
    const shareText = ` AKU PUNYA NAMA BARU! \n\nNama Baru: ${data.name}\nKekuatan: ${data.strength}% (${data.strengthLabel})\nTugas Hidup: ${data.result?.tugasHidup?.name || '-'}\n\nCek punyamu di: ${window.location.origin}/pages/ramalan.html\n\n#OracleNusantara #NamaSelaras #CetakBiruDiriku`;
    
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
}

function analyzeAddedWord(word) {
  const syllablesData = window.positiveSyllablesData;
  
  if (syllablesData && syllablesData.syllables) {
    const wordData = syllablesData.syllables.find(s => s.text === word);
    if (wordData) {
      return { value: wordData.hanacaraka_value, element: wordData.element, effect: wordData.energy };
    }
  }
  
  let value = 0;
  try {
    if (typeof hanacarakaValue === 'function') {
      value = hanacarakaValue(word).total;
    } else {
      value = word.length * 5;
    }
  } catch(e) { value = word.length * 5; }
  
  let element = 'Tanah';
  let effect = 'memberikan stabilitas dan fondasi yang kokoh';
  
  if (value <= 20) { element = 'Api'; effect = 'memberikan energi kepemimpinan dan semangat yang membara'; }
  else if (value <= 40) { element = 'Air'; effect = 'memberikan ketenangan, kebijaksanaan, dan kemampuan beradaptasi'; }
  else if (value <= 60) { element = 'Kayu'; effect = 'memberikan pertumbuhan, kreativitas, dan visi ke depan'; }
  else if (value <= 80) { element = 'Logam'; effect = 'memberikan ketegasan, disiplin, dan kemampuan eksekusi'; }
  
  return { value, element, effect };
}

function generateLuckyNumbers(neptu, hanacaraka) {
    const n1 = (neptu * 7) % 100;
    const n2 = (hanacaraka * 3) % 100;
    const n3 = ((neptu + hanacaraka) * 5) % 100;
    const n4 = (neptu * hanacaraka) % 100;
    return [n1, n2, n3, n4].map(n => n < 10 ? '0' + n : '' + n);
}

// ---------- DOWNLOAD SERTIFIKAT PDF (PERBAIKAN FONT & DUPLIKASI) ----------
async function downloadPurchasedNamePDF() {
  console.log(' downloadPurchasedNamePDF called');
  
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
    const pageWidth = 210;
    const margin = 20;
    let yPos = 25;
    
    // Header
    pdf.setFontSize(22);
    pdf.setTextColor(212, 175, 55);
    pdf.text('Sertifikat Nama Selaras', pageWidth/2, yPos, { align: 'center' });
    yPos += 12;
    
    pdf.setFontSize(14);
    pdf.setTextColor(0, 0, 0);
    pdf.text('Oracle Nusantara', pageWidth/2, yPos, { align: 'center' });
    yPos += 8;
    
    pdf.setDrawColor(212, 175, 55);
    pdf.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 12;
    
    // Nama Baru
    pdf.setFontSize(18);
    pdf.text(` ${cleanTextForPDF(data.name)} `, pageWidth/2, yPos, { align: 'center' });
    yPos += 15;
    
    // Kekuatan
    pdf.setFontSize(12);
    pdf.text(`Kekuatan Nama: ${data.strength}% (${data.strengthLabel})`, margin, yPos);
    yPos += 8;
    pdf.text(`Nilai Hanacaraka: ${data.hanacarakaTotal}`, margin, yPos);
    yPos += 8;
    pdf.text(`Nama Asli: ${cleanTextForPDF(data.originalName)} (${data.originalStrength}%)`, margin, yPos);
    yPos += 12;
    
    // Tugas Hidup & Jalur Rezeki
    pdf.setFontSize(11);
    pdf.text(`Tugas Hidup: ${cleanTextForPDF(data.result?.tugasHidup?.name || '-')}`, margin, yPos);
    yPos += 7;
    pdf.text(`Jalur Rezeki: ${cleanTextForPDF(data.result?.jalurRezeki?.name || '-')}`, margin, yPos);
    yPos += 12;
    
    // Kelebihan
    const kelebihan = getTraitsForName(data.name, data.strength, null, null, 'kelebihan', 3);
    if (kelebihan.length > 0) {
      pdf.setFontSize(11);
      pdf.setTextColor(100, 200, 100);
      pdf.text('Kelebihan Nama:', margin, yPos);
      yPos += 6;
      pdf.setTextColor(0, 0, 0);
      kelebihan.forEach(k => {
        const lines = pdf.splitTextToSize(cleanTextForPDF(` ${k.text}`), 170);
        pdf.text(lines, margin, yPos);
        yPos += lines.length * 5;
      });
      yPos += 6;
    }
    
    // Saran Penggunaan
    pdf.setFontSize(10);
    pdf.setTextColor(80, 80, 80);
    pdf.text('Saran Penggunaan:', margin, yPos);
    yPos += 5;
    pdf.text(' Gunakan sebagai nama profesional di lingkungan kerja.', margin + 5, yPos);
    yPos += 5;
    pdf.text(' Perkenalkan diri dengan nama ini di lingkungan baru.', margin + 5, yPos);
    yPos += 5;
    pdf.text(' Tidak perlu mengubah dokumen legal.', margin + 5, yPos);
    yPos += 15;
    
    // Footer
    pdf.setFontSize(9);
    pdf.setTextColor(100, 100, 100);
    pdf.text('Dianalisis dengan Manuritas  oracle-nusantara.com', pageWidth/2, 280, { align: 'center' });
    pdf.text(' 2026 Oracle Nusantara  Diterbitkan oleh Doni Chandra Utama', pageWidth/2, 285, { align: 'center' });
    
    pdf.save(`Sertifikat-Nama-${data.name.replace(/\s/g, '-')}.pdf`);
    showSuccessToast(' Sertifikat PDF berhasil diunduh!');
    
  } catch(e) {
    console.error(' Error:', e);
    showErrorToast('Gagal mengunduh PDF: ' + e.message);
  }
}

// ---------- FUNGSI PEMBERSIH TEKS (PERBAIKAN - HAPUS "l" DARI REGEX) ----------
function cleanTextForPDF(text) {
  if (!text) return '';
  return String(text)
    .normalize('NFKC')
    .replace(/[<=]/g, '')  // HAPUS "l" dari regex!
    .replace(/[^\x20-\x7E\u00A0-\u00FF\u0100-\u017F\u1E00-\u1EFF\u2010-\u205F]/g, '')
    .replace(/\n\s*\n\s*\n/g, '\n\n')
    .trim();
}

// ---------- EXPOSE KE GLOBAL ----------
window.PACKAGE_CONFIG = PACKAGE_CONFIG;
window.getStrengthLabel = getStrengthLabel;
window.loadNameOptions = loadNameOptions;
window.purchaseSelectedOption = purchaseSelectedOption;
window.sharePurchasedName = sharePurchasedName;
window.analyzeAddedWord = analyzeAddedWord;
window.downloadPurchasedNamePDF = downloadPurchasedNamePDF;
window.cleanTextForPDF = cleanTextForPDF;

console.log(' manuritas-generator.js v5.0.0 loaded');