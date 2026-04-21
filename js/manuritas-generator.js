// ================== MANURITAS GENERATOR ==================
// File: js/manuritas-generator.js
// Versi: 3.0.0 - Final dengan Traits Integration
// Deskripsi: Generator Nama Selaras + Evaluasi Traits (Kelebihan/Kekurangan)

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
    if (score >= 90) return { label: 'SANGAT KUAT', stars: 'ðŸŒŸðŸŒŸðŸŒŸðŸŒŸðŸŒŸ', class: 'sangat-kuat' };
    if (score >= 75) return { label: 'KUAT', stars: 'ðŸŒŸðŸŒŸðŸŒŸðŸŒŸ', class: 'kuat' };
    if (score >= 60) return { label: 'CUKUP', stars: 'ðŸŒŸðŸŒŸðŸŒŸ', class: 'cukup' };
    if (score >= 40) return { label: 'KURANG', stars: 'ðŸŒŸðŸŒŸ', class: 'kurang' };
    return { label: 'LEMAH', stars: 'ðŸŒŸ', class: 'lemah' };
}

// ---------- EVALUASI KONDISI NAMA (UNTUK TRAITS) ----------

/**
 * Menghitung semua variabel kondisi dari sebuah nama
 * Digunakan untuk mencocokkan dengan template di manuritas-traits.json
 * @param {string} name - Nama yang akan dievaluasi
 * @param {number} strengthScore - Persentase kekuatan nama
 * @param {object} weton - Data weton (opsional)
 * @param {object} wuku - Data wuku (opsional)
 * @returns {object} - Objek berisi semua kondisi
 */
function evaluateNameConditions(name, strengthScore, weton = null, wuku = null) {
    const cleanName = name.toLowerCase().replace(/\s/g, '');
    const hanacarakaResult = hanacarakaValue(name);
    const totalValue = hanacarakaResult.total;
    
    // Hitung vokal dan konsonan
    const vowels = { a: 0, i: 0, u: 0, e: 0, o: 0 };
    const consonants = {};
    let totalVowels = 0;
    let totalConsonants = 0;
    
    for (let char of cleanName) {
        if (['a', 'i', 'u', 'e', 'o'].includes(char)) {
            vowels[char]++;
            totalVowels++;
        } else {
            consonants[char] = (consonants[char] || 0) + 1;
            totalConsonants++;
        }
    }
    
    const totalLetters = cleanName.length;
    const vowelRatio = totalVowels / totalLetters;
    const consonantRatio = totalConsonants / totalLetters;
    
    // Hitung jumlah kata
    const wordCount = name.trim().split(/\s+/).length;
    
    // Elemen nama
    const nameElement = hanacarakaResult.dominantElement || 'Tanah';
    
    // Elemen weton dan wuku (jika ada)
    const wetonElement = weton?.element || null;
    const wukuElement = wuku?.element || null;
    
    // Neptu
    const neptu = weton?.neptu || 0;
    
    // Nama Wuku
    const wukuName = wuku?.name || '';
    
    // Cek pola spesifik
    const hasDoubleLetter = /(.)\1/.test(cleanName);
    const hasUniqueLetter = /[fqvxz]/.test(cleanName);
    const startsWithVowel = /^[aiueo]/.test(cleanName);
    const endsWithVowel = /[aiueo]$/.test(cleanName);
    const hasDoubleVowel = /[aiueo]{2}/.test(cleanName);
    
    // Cek suku kata spesifik
    const containsMa = /ma/.test(cleanName);
    const containsRa = /ra/.test(cleanName);
    const containsKa = /ka/.test(cleanName);
    const containsSa = /sa/.test(cleanName);
    const containsWa = /wa/.test(cleanName);
    const containsJa = /ja/.test(cleanName);
    const containsYa = /ya/.test(cleanName);
    const containsGa = /ga/.test(cleanName);
    const containsBa = /ba/.test(cleanName);
    const containsNga = /nga|ng/.test(cleanName);
    const containsDha = /dha/.test(cleanName);
    const containsTha = /tha/.test(cleanName);
    
    // Kondisi yang dikembalikan
    return {
        // Strength
        strength_score: strengthScore,
        
        // Pola Vokal
        pattern_vocal_a: vowels.a >= 3,
        pattern_excess_a: vowels.a >= 4,
        pattern_vocal_i: vowels.i >= 3,
        pattern_excess_i: vowels.i >= 4,
        pattern_vocal_u: vowels.u >= 2,
        pattern_excess_u: vowels.u >= 3,
        pattern_vocal_e: vowels.e >= 3,
        pattern_excess_e: vowels.e >= 4,
        pattern_vocal_o: vowels.o >= 2,
        pattern_excess_o: vowels.o >= 3,
        
        // Dominasi
        pattern_vocal_dominant: vowelRatio > 0.6,
        pattern_consonant_dominant: consonantRatio > 0.7,
        pattern_balance: vowelRatio >= 0.4 && vowelRatio <= 0.6,
        
        // Nilai Hanacaraka
        value_very_low: totalValue < 30,
        value_low: totalValue >= 30 && totalValue < 50,
        value_balanced: totalValue >= 50 && totalValue < 80,
        value_high: totalValue >= 80 && totalValue < 100,
        value_very_high: totalValue >= 100,
        
        // Panjang Nama
        length_short: totalLetters < 8,
        length_ideal: totalLetters >= 8 && totalLetters <= 15,
        length_long: totalLetters > 15 && totalLetters <= 25,
        length_very_long: totalLetters > 25,
        
        // Jumlah Kata
        word_count_1: wordCount === 1,
        word_count_2: wordCount === 2,
        word_count_3: wordCount === 3,
        word_count_many: wordCount > 3,
        
        // Elemen
        element_harmony: (nameElement === wetonElement),
        element_conflict: isElementConflict(nameElement, wetonElement),
        element_strengthen: isElementStrengthen(nameElement, wetonElement),
        element_weaken: isElementWeaken(nameElement, wetonElement),
        
        // Posisi Huruf
        start_vocal: startsWithVowel,
        start_consonant: !startsWithVowel,
        end_vocal: endsWithVowel,
        end_consonant: !endsWithVowel,
        
        // Huruf Spesial
        double_letter: hasDoubleLetter,
        unique_letter: hasUniqueLetter,
        
        // Weton
        weton_neptu_tinggi: neptu >= 13,
        weton_neptu_rendah: neptu <= 8,
        weton_neptu_seimbang: neptu >= 9 && neptu <= 12,
        
        // Wuku
        wuku_spiritual: ['Sungsang', 'Dungulan', 'Kuningan'].includes(wukuName),
        wuku_konflik: ['Watugunung', 'Klawu', 'Dukut'].includes(wukuName),
        wuku_stabil: ['Sinta', 'Landep', 'Ukir'].includes(wukuName),
        
        // Sinkronisasi
        sinkron_nama_weton: (nameElement === wetonElement),
        konflik_nama_weton: isElementConflict(nameElement, wetonElement),
        sinkron_nama_wuku: (nameElement === wukuElement),
        
        // Pola Tambahan
        pattern_has_r: (consonants['r'] || 0) > 0,
        pattern_has_k: (consonants['k'] || 0) > 0,
        pattern_has_s: (consonants['s'] || 0) > 0,
        pattern_no_r: (consonants['r'] || 0) === 0,
        pattern_no_s: (consonants['s'] || 0) === 0,
        pattern_no_u: vowels.u === 0,
        pattern_ending_i: cleanName.endsWith('i'),
        pattern_ending_konsonan: !endsWithVowel,
        pattern_double_vocal: hasDoubleVowel,
        
        // Suku Kata Spesifik
        name_contains_ma: containsMa,
        name_contains_ra: containsRa,
        name_contains_ka: containsKa,
        name_contains_sa: containsSa,
        name_contains_wa: containsWa,
        name_contains_ja: containsJa,
        name_contains_ya: containsYa,
        name_contains_ga: containsGa,
        name_contains_ba: containsBa,
        name_contains_nga: containsNga,
        name_contains_dha: containsDha,
        name_contains_tha: containsTha,
        
        // Default fallback
        default: false
    };
}

/**
 * Cek apakah dua elemen bertentangan
 */
function isElementConflict(element1, element2) {
    if (!element1 || !element2) return false;
    const conflicts = {
        'Api': 'Air',
        'Air': 'Api',
        'Tanah': 'Kayu',
        'Kayu': 'Tanah',
        'Logam': 'Api',
        'Udara': 'Tanah'
    };
    return conflicts[element1] === element2;
}

/**
 * Cek apakah elemen pertama memperkuat elemen kedua
 */
function isElementStrengthen(element1, element2) {
    if (!element1 || !element2) return false;
    const strengthens = {
        'Api': 'Tanah',
        'Tanah': 'Logam',
        'Logam': 'Air',
        'Air': 'Kayu',
        'Kayu': 'Api'
    };
    return strengthens[element1] === element2;
}

/**
 * Cek apakah elemen pertama melemahkan elemen kedua
 */
function isElementWeaken(element1, element2) {
    if (!element1 || !element2) return false;
    const weakens = {
        'Api': 'Logam',
        'Logam': 'Kayu',
        'Kayu': 'Tanah',
        'Tanah': 'Air',
        'Air': 'Api'
    };
    return weakens[element1] === element2;
}

/**
 * Evaluasi string condition
 * @param {string} conditionStr - String kondisi (contoh: "strength_score >= 60 && pattern_vocal_a === true")
 * @param {object} conditions - Objek kondisi dari evaluateNameConditions()
 * @returns {boolean} - Hasil evaluasi
 */
function evaluateCondition(conditionStr, conditions) {
    if (!conditionStr || conditionStr === 'default === true') {
        return false;
    }
    
    try {
        // Buat function dari string condition
        const keys = Object.keys(conditions);
        const values = keys.map(k => conditions[k]);
        
        // Gunakan Function constructor untuk evaluasi aman
        const func = new Function(...keys, `return ${conditionStr};`);
        return func(...values);
    } catch (e) {
        console.error('Gagal evaluasi kondisi:', conditionStr, e);
        return false;
    }
}

// ---------- TRAITS EVALUATION ----------

/**
 * Mendapatkan template traits (kelebihan/kekurangan) yang sesuai dengan kondisi nama
 * @param {string} name - Nama yang akan dievaluasi
 * @param {number} strengthScore - Persentase kekuatan
 * @param {object} weton - Data weton
 * @param {object} wuku - Data wuku
 * @param {string} filterType - 'kelebihan' atau 'kekurangan' (opsional)
 * @param {number} limit - Jumlah maksimal yang dikembalikan (default 2)
 * @returns {array} - Array template yang cocok
 */
function getTraitsForName(name, strengthScore, weton = null, wuku = null, filterType = null, limit = 2) {
    const traitsData = window.manuritasTraitsData;
    if (!traitsData || !traitsData.templates) {
        return [];
    }
    
    const conditions = evaluateNameConditions(name, strengthScore, weton, wuku);
    const templates = traitsData.templates;
    
    // Filter template yang cocok
    const matched = templates.filter(t => {
        // Filter by type jika ditentukan
        if (filterType && t.type !== filterType) return false;
        
        // Evaluasi kondisi
        return evaluateCondition(t.condition, conditions);
    });
    
    // Urutkan berdasarkan prioritas (1 tertinggi)
    matched.sort((a, b) => (a.priority || 3) - (b.priority || 3));
    
    // Jika tidak ada yang cocok, gunakan fallback
    if (matched.length === 0) {
        const fallbackType = filterType || 'kelebihan';
        const fallback = templates.find(t => 
            t.type === fallbackType && t.condition === 'default === true'
        );
        return fallback ? [fallback] : [];
    }
    
    return matched.slice(0, limit);
}

/**
 * Render traits menjadi HTML
 * @param {array} traits - Array template traits
 * @param {string} title - Judul section
 * @param {string} icon - Ikon Font Awesome
 * @param {string} color - Warna judul
 * @returns {string} - HTML string
 */
function renderTraitsHTML(traits, title, icon = 'check-circle', color = '#64C864') {
    if (!traits || traits.length === 0) {
        return '';
    }
    
    let html = `
        <div style="margin-top: 20px;">
            <h4 style="color: ${color}; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
                <i class="fas fa-${icon}"></i> ${title}
            </h4>
    `;
    
    traits.forEach(t => {
        html += `<p style="margin-bottom: 8px; color: #B0B0C0;">â€¢ ${t.text}</p>`;
    });
    
    html += `</div>`;
    
    return html;
}

// ---------- GENERATE OPSI NAMA ----------

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
    
    // Jika target tinggi (â‰¥85), tambahkan kombinasi 2 kata
    if (targetMin >= 85) {
        for (let i = 0; i < Math.min(uniqueWords.length, 10); i++) {
            for (let j = i + 1; j < Math.min(uniqueWords.length, 10); j++) {
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
    
    // Kembalikan hanya 1 opsi terbaik
    return validOptions.length > 0 ? validOptions[0] : null;
}

// ---------- LOAD OPSI NAMA ----------

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
            window.location.href = 'pricing.html';
        }
        return;
    }
    
    // Potong token
    const newBalance = currentBalance - config.tokenCost;
    localStorage.setItem('tokenBalance', newBalance);
    if (typeof updateTokenDisplay === 'function') updateTokenDisplay();
    if (typeof showSuccessToast === 'function') {
        showSuccessToast(`âœ… ${config.tokenCost} Token digunakan. Sisa ${newBalance} Token.`);
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

// ---------- TAMPILKAN OPSI NAMA ----------

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
    const hanacarakaDiff = option.hanacarakaTotal - (window.pendingPurchaseData?.originalHanacaraka || 0);
    
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
                    <h3 style="color: #D4AF37; font-size: 1.8rem; margin-bottom: 8px;">âœ¨ ${option.name} âœ¨</h3>
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

// Di manuritas-generator.js, ganti purchaseSelectedName:
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

// Fungsi fetchJSON untuk manuritas-generator
async function fetchJSON(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return await res.json();
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
    const value = hanacarakaValue(word).total;
    
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

// ---------- DOWNLOAD PDF SERTIFIKAT ----------

async function downloadPremiumPDF() {
  if (!ramalanPremiumUnlocked) {
    showErrorToast('Buka Ramalan Lengkap terlebih dahulu.');
    return;
  }
  
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF('p', 'mm', 'a4');
  const userName = elements.userName.value.trim() || 'Sang Pencari';
  const pageWidth = 210;
  const margin = 20;
  const maxWidth = pageWidth - 2 * margin;
  
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(22);
  pdf.setTextColor(212, 175, 55);
  pdf.text('Oracle Nusantara', pageWidth/2, 25, { align: 'center' });
  
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(12);
  pdf.setTextColor(0, 0, 0);
  pdf.text(`Cetak Biru Diri - ${userName}`, pageWidth/2, 35, { align: 'center' });
  
  pdf.setDrawColor(212, 175, 55);
  pdf.line(margin, 40, pageWidth - margin, 40);
  
  let yPos = 50;
  pdf.setFontSize(10);
  
  const content = document.getElementById('premiumDetailBox');
  const sections = content.querySelectorAll('.analysis-section-card, h4, p');
  
  sections.forEach(el => {
    if (el.tagName === 'H4') {
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(212, 175, 55);
    } else {
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(0, 0, 0);
    }
    
    const text = el.innerText || '';
    const lines = pdf.splitTextToSize(text, maxWidth);
    
    lines.forEach(line => {
      if (yPos > 270) {
        pdf.addPage();
        yPos = 20;
      }
      pdf.text(line, margin, yPos);
      yPos += 5;
    });
    yPos += 3;
  });
  
  pdf.setFontSize(8);
  pdf.setTextColor(80, 80, 80);
  pdf.text('© 2026 Oracle Nusantara • Diterbitkan oleh Chandra Prasetya', pageWidth/2, 285, { align: 'center' });
  
  pdf.save(`Oracle-Nusantara-Premium-${userName}.pdf`);
  showSuccessToast(' PDF Premium berhasil diunduh!');
}

// ---------- UPDATE TOKEN DISPLAY ----------

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

// ---------- HIDE SILVER PACKAGE IF NEEDED ----------

/**
 * Sembunyikan paket Silver jika kekuatan nama asli â‰¥ 60%
 * Dipanggil dari ramalan.html setelah Manuritas Premium di-unlock
 * @param {number} originalStrength - Persentase kekuatan nama asli
 */
function hideSilverPackageIfNeeded(originalStrength) {
    const silverPackage = document.getElementById('packageSilver');
    const silverInfo = document.getElementById('silverHiddenInfo');
    
    if (originalStrength >= 60) {
        if (silverPackage) silverPackage.classList.add('hidden');
        if (silverInfo) silverInfo.classList.remove('hidden');
    } else {
        if (silverPackage) silverPackage.classList.remove('hidden');
        if (silverInfo) silverInfo.classList.add('hidden');
    }
}

// ---------- EXPOSE KE GLOBAL ----------

window.PACKAGE_CONFIG = PACKAGE_CONFIG;
window.getStrengthLabel = getStrengthLabel;
window.loadNameOptions = loadNameOptions;
window.purchaseSelectedName = purchaseSelectedName;
window.updateTokenDisplay = updateTokenDisplay;
window.downloadPurchasedNamePDF = downloadPurchasedNamePDF;
window.evaluateNameConditions = evaluateNameConditions;
window.getTraitsForName = getTraitsForName;
window.hideSilverPackageIfNeeded = hideSilverPackageIfNeeded;

console.log('âœ… manuritas-generator.js v3.0.0 loaded');
