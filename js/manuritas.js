// ================== MANURITAS CORE ==================
// File: js/manuritas.js
// Versi: 2.0.0 - Final Clean (tanpa kelebihanData)
// Fungsi-fungsi inti untuk analisis Manuritas (Dr. Arkand Bodhana Zeshaprajna)

// ---------- 1. KONVERSI NAMA LATIN KE NILAI HANACARAKA ----------

/**
 * Tabel konversi huruf Latin ke Hanacaraka
 * Nilai dasar diambil dari hanacaraka-map.json
 */
const HANACARAKA_LATIN_MAP = {
    'a': 'ha', 'b': 'ba', 'c': 'ca', 'd': 'da', 'e': 'ha', 'f': 'pa',
    'g': 'ga', 'h': 'ha', 'i': 'ha', 'j': 'ja', 'k': 'ka', 'l': 'la',
    'm': 'ma', 'n': 'na', 'o': 'ha', 'p': 'pa', 'q': 'ka', 'r': 'ra',
    's': 'sa', 't': 'ta', 'u': 'wa', 'v': 'wa', 'w': 'wa', 'x': 'sa',
    'y': 'ya', 'z': 'sa'
};

const HANACARAKA_VALUES = {
    'ha': 1, 'na': 2, 'ca': 3, 'ra': 4, 'ka': 5,
    'da': 6, 'ta': 7, 'sa': 8, 'wa': 9, 'la': 10,
    'pa': 11, 'dha': 12, 'ja': 13, 'ya': 14, 'nya': 15,
    'ma': 16, 'ga': 17, 'ba': 18, 'tha': 19, 'nga': 20
};

const VOWEL_MODIFIERS = {
    'a': 0, 'i': 1, 'u': 2, 'e': 3, 'o': 4
};

/**
 * Menghitung nilai Hanacaraka dari sebuah nama
 * @param {string} name - Nama lengkap
 * @returns {object} - Total nilai, rincian per huruf, dan elemen dominan
 */
function hanacarakaValue(name) {
    if (!name) return { total: 0, details: [], dominantElement: 'Tanah' };
    
    const cleanName = name.toLowerCase().replace(/[^a-z]/g, '');
    let total = 0;
    const details = [];
    const elementCount = { Api: 0, Air: 0, Tanah: 0, Udara: 0, Logam: 0, Kayu: 0 };
    
    for (let char of cleanName) {
        const hanacaraka = HANACARAKA_LATIN_MAP[char] || 'ha';
        const baseValue = HANACARAKA_VALUES[hanacaraka] || 1;
        
        // Cek vokal untuk modifier (jika karakter adalah vokal)
        let modifier = 0;
        if (['a', 'i', 'u', 'e', 'o'].includes(char)) {
            modifier = VOWEL_MODIFIERS[char] || 0;
        }
        
        const charValue = baseValue + modifier;
        total += charValue;
        
        details.push({
            char: char,
            hanacaraka: hanacaraka,
            baseValue: baseValue,
            modifier: modifier,
            total: charValue
        });
        
        // Hitung elemen
        const element = getElementFromHanacaraka(hanacaraka);
        if (element && elementCount[element] !== undefined) {
            elementCount[element]++;
        }
    }
    
    // Tentukan elemen dominan
    let dominantElement = 'Tanah';
    let maxCount = 0;
    for (let e in elementCount) {
        if (elementCount[e] > maxCount) {
            maxCount = elementCount[e];
            dominantElement = e;
        }
    }
    
    return {
        total: total,
        details: details,
        elementCount: elementCount,
        dominantElement: dominantElement,
        rawName: cleanName
    };
}

/**
 * Mendapatkan elemen dari huruf Hanacaraka
 */
function getElementFromHanacaraka(h) {
    const elementMap = {
        'ha': 'Api', 'na': 'Air', 'ca': 'Api', 'ra': 'Api', 'ka': 'Tanah',
        'da': 'Air', 'ta': 'Tanah', 'sa': 'Udara', 'wa': 'Udara', 'la': 'Air',
        'pa': 'Api', 'dha': 'Tanah', 'ja': 'Api', 'ya': 'Air', 'nya': 'Udara',
        'ma': 'Tanah', 'ga': 'Api', 'ba': 'Air', 'tha': 'Tanah', 'nga': 'Udara'
    };
    return elementMap[h] || 'Tanah';
}

// ---------- 2. ANALISIS POLA NAMA ----------

/**
 * Menganalisis pola huruf dalam nama
 * @param {string} name - Nama yang akan dianalisis
 * @returns {object} - Objek berisi berbagai pola
 */
function analyzeNamePatterns(name) {
    if (!name) return { patterns: {} };
    
    const cleanName = name.toLowerCase().replace(/\s/g, '');
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
    
    // Cek pola spesifik
    const patterns = {
        vocal_a_dominant: vowels.a >= 3,
        vocal_i_dominant: vowels.i >= 3,
        vocal_u_dominant: vowels.u >= 2,
        vocal_e_dominant: vowels.e >= 3,
        vocal_o_dominant: vowels.o >= 2,
        consonant_r_dominant: (consonants['r'] || 0) >= 2,
        consonant_k_dominant: (consonants['k'] || 0) >= 2,
        consonant_s_dominant: (consonants['s'] || 0) >= 2,
        has_consonant_r: (consonants['r'] || 0) > 0,
        has_consonant_k: (consonants['k'] || 0) > 0,
        excess_a: vowels.a >= 4,
        excess_i: vowels.i >= 4,
        excess_k: (consonants['k'] || 0) >= 3,
        no_u: vowels.u === 0,
        no_r: (consonants['r'] || 0) === 0,
        no_s: (consonants['s'] || 0) === 0,
        ending_i: cleanName.endsWith('i'),
        ending_konsonan: !['a', 'i', 'u', 'e', 'o'].includes(cleanName.charAt(cleanName.length - 1)),
        too_short: cleanName.length <= 4,
        too_long: cleanName.length >= 20,
        double_vocal: /[aiueo]{2}/.test(cleanName)
    };
    
    return {
        name: cleanName,
        length: cleanName.length,
        vowels: vowels,
        consonants: consonants,
        totalVowels: totalVowels,
        totalConsonants: totalConsonants,
        patterns: patterns
    };
}

// ---------- 3. MENGHITUNG PERSENTASE KEKUATAN NAMA ----------

/**
 * Menghitung persentase kekuatan nama berdasarkan Manuritas
 * @param {number} hanacarakaTotal - Total nilai Hanacaraka
 * @param {number} neptu - Neptu Weton
 * @param {object} wukuData - Data Wuku
 * @returns {object} - Persentase, label, dan interpretasi
 */
function calculateNameStrength(hanacarakaTotal, neptu, wukuData) {
    // Formula Manuritas: (Hanacaraka + Neptu + Urip_Wuku) % 100
    const wukuUrip = wukuData?.urip || 5;
    const rawScore = (hanacarakaTotal + neptu + wukuUrip) % 100;
    const score = rawScore === 0 ? 100 : rawScore;
    
    let label = '';
    let interpretation = '';
    
    if (score >= 90) {
        label = 'SANGAT KUAT';
        interpretation = 'Nama ini selaras sempurna dengan weton dan wuku Anda. Getarannya sangat mendukung misi hidup Anda. Ini adalah nama dengan potensi luar biasa.';
    } else if (score >= 75) {
        label = 'KUAT';
        interpretation = 'Nama ini memiliki fondasi yang baik dan selaras dengan energi kelahiran Anda. Ada sedikit ruang untuk penyempurnaan, namun secara keseluruhan sudah sangat mendukung.';
    } else if (score >= 60) {
        label = 'CUKUP';
        interpretation = 'Nama ini cukup selaras, namun ada beberapa aspek yang bisa diperkuat. Pertimbangkan untuk menambahkan nama panggilan yang lebih selaras.';
    } else if (score >= 40) {
        label = 'KURANG';
        interpretation = 'Terdapat ketidakselarasan antara nama dan weton Anda. Ini bisa menyebabkan energi terhambat. Disarankan untuk mempertimbangkan nama panggilan baru.';
    } else {
        label = 'LEMAH';
        interpretation = 'Nama ini memiliki benturan energi dengan weton dan wuku Anda. Sangat disarankan untuk menggunakan nama panggilan yang lebih selaras untuk aktivitas penting.';
    }
    
    return {
        score: score,
        label: label,
        interpretation: interpretation,
        details: {
            hanacaraka: hanacarakaTotal,
            neptu: neptu,
            wukuUrip: wukuUrip
        }
    };
}

// ---------- 4. FUNGSI PEMILIHAN TEMPLATE ----------

/**
 * Memilih template Tugas Hidup berdasarkan total nilai
 */
function getTugasHidup(hanacarakaTotal, neptu, tugasHidupData) {
    if (!tugasHidupData || !tugasHidupData.templates) return null;
    
    const combined = (hanacarakaTotal + neptu) % 100;
    
    // Cari template yang range-nya mencakup combined
    const template = tugasHidupData.templates.find(t => 
        combined >= t.range[0] && combined <= t.range[1]
    );
    
    return template || tugasHidupData.templates[0];
}

/**
 * Memilih template Watak Asli vs. Topeng Sosial
 */
function getWatakAsli(name, hanacarakaTotal, watakData) {
    if (!watakData || !watakData.templates) return null;
    
    // Pilih template berdasarkan kondisi
    const template = watakData.templates.find(t => {
        if (t.condition.includes('total_value > 50')) {
            return hanacarakaTotal > 50;
        } else if (t.condition.includes('total_value < 40')) {
            return hanacarakaTotal < 40;
        }
        return false;
    });
    
    return template || watakData.templates[0];
}

/**
 * Memilih template Titik Luka Batin
 */
function getTitikLuka(hanacarakaTotal, neptu, titikLukaData) {
    if (!titikLukaData || !titikLukaData.templates) return null;
    
    const selisih = Math.abs(hanacarakaTotal - neptu);
    const ageIndex = Math.floor(selisih / 10) % titikLukaData.templates.length;
    
    return titikLukaData.templates[ageIndex] || titikLukaData.templates[0];
}

/**
 * Memilih template Jalur Rezeki
 */
function getJalurRezeki(hanacarakaTotal, neptu, name, jalurRezekiData) {
    // Hash kombinasi: nama + neptu + total untuk hasil unik
    const seed = (name || '').length + neptu + hanacarakaTotal;
    const index = seed % jalurRezekiData.templates.length;
    return jalurRezekiData.templates[index];
}

/**
 * Memilih template Kelebihan Nama (dari manuritas-traits.json)
 */
function getNameStrengths(patterns, traitsData) {
    if (!traitsData || !traitsData.templates) return [];
    
    const kelebihanTemplates = traitsData.templates.filter(t => t.type === 'kelebihan');
    const strengths = [];
    
    for (let key in patterns) {
        if (patterns[key] === true) {
            const matched = kelebihanTemplates.filter(t => 
                t.condition && t.condition.includes(key.replace('_dominant', ''))
            );
            strengths.push(...matched.slice(0, 2));
        }
    }
    
    return strengths.slice(0, 4);
}

/**
 * Memilih template Kekurangan Nama (dari manuritas-traits.json)
 */
function getNameWeaknesses(patterns, traitsData) {
    if (!traitsData || !traitsData.templates) return [];
    
    const kekuranganTemplates = traitsData.templates.filter(t => t.type === 'kekurangan');
    const weaknesses = [];
    
    for (let key in patterns) {
        if (patterns[key] === true) {
            const matched = kekuranganTemplates.filter(t => 
                t.condition && t.condition.includes(key)
            );
            weaknesses.push(...matched.slice(0, 2));
        }
    }
    
    return weaknesses.slice(0, 3);
}

/**
 * Memilih template Saran Penyempurnaan Nama
 */
function getSaranPenyempurnaan(patterns, weton, saranData) {
    if (!saranData || !saranData.templates) return [];
    
    const suggestions = [];
    
    if (patterns.no_u) {
        const matched = saranData.templates.filter(t => t.condition && t.condition.includes('kurang_unsur_air'));
        suggestions.push(...matched);
    }
    if (patterns.excess_a) {
        const matched = saranData.templates.filter(t => t.condition && t.condition.includes('kurang_unsur_tanah'));
        suggestions.push(...matched);
    }
    if (patterns.too_short) {
        const matched = saranData.templates.filter(t => t.condition && t.condition.includes('terlalu_pendek'));
        suggestions.push(...matched);
    }
    if (patterns.too_long) {
        const matched = saranData.templates.filter(t => t.condition && t.condition.includes('terlalu_panjang'));
        suggestions.push(...matched);
    }
    
    return suggestions.slice(0, 3);
}

/**
 * Memilih template Peta Energi (Fisik & Psikis)
 */
function getPetaEnergi(patterns, wukuName, petaEnergiData) {
    if (!petaEnergiData) return { physical: [], psychological: [] };
    
    const physical = [];
    const psychological = [];
    
    for (let key in patterns) {
        if (patterns[key] === true && key.includes('dominant')) {
            const physMatch = petaEnergiData.physical?.filter(p => 
                p.condition && p.condition.includes(key)
            );
            const psychMatch = petaEnergiData.psychological?.filter(p => 
                p.condition && p.condition.includes(key)
            );
            if (physMatch) physical.push(...physMatch.slice(0, 1));
            if (psychMatch) psychological.push(...psychMatch.slice(0, 1));
        }
    }
    
    return { physical, psychological };
}

/**
 * Memilih template Peringatan Dini Energetik (Extreme)
 */
function getExtremePatterns(hanacarakaTotal, patterns, extremeData) {
    if (!extremeData || !extremeData.templates) return [];
    
    const results = [];
    
    // Cek pola kecelakaan
    const accidentTemplate = extremeData.templates.find(t => 
        t.type === 'accident' && 
        ((hanacarakaTotal % 5 === 0 && t.level === 'Tinggi') || 
         (hanacarakaTotal % 5 !== 0 && t.level === 'Rendah'))
    );
    if (accidentTemplate) results.push(accidentTemplate);
    
    // Cek pola victim
    const victimTemplate = extremeData.templates.find(t => 
        t.type === 'victim' && 
        ((patterns.excess_a && !patterns.has_consonant_r && t.level === 'Tinggi') ||
         (patterns.excess_a && patterns.no_u && t.level === 'Sedang'))
    );
    if (victimTemplate) results.push(victimTemplate);
    
    // Cek pola despair
    const despairTemplate = extremeData.templates.find(t => 
        t.type === 'despair' && 
        ((hanacarakaTotal < 30 && t.level === 'Tinggi') ||
         (hanacarakaTotal >= 30 && t.level === 'Rendah'))
    );
    if (despairTemplate) results.push(despairTemplate);
    
    return results;
}

// ---------- 5. FUNGSI UTAMA MANURITAS ----------

/**
 * Fungsi utama untuk menghitung semua analisis Manuritas
 * @param {string} fullName - Nama lengkap
 * @param {object} weton - Objek weton { saptawara, pancawara, neptu }
 * @param {object} wuku - Objek wuku { name, urip, element, ... }
 * @param {object} data - Semua data JSON yang dibutuhkan
 * @returns {object} - Hasil analisis lengkap
 */
async function calculateManuritas(fullName, weton, wuku, data) {
    if (!fullName || !weton || !wuku) return null;
    
    // 1. Hitung nilai Hanacaraka
    const hanacarakaResult = hanacarakaValue(fullName);
    
    // 2. Analisis pola nama
    const patterns = analyzeNamePatterns(fullName);
    
    // 3. Hitung kekuatan nama
    const strength = calculateNameStrength(hanacarakaResult.total, weton.neptu, wuku);
    
    // 4. Pilih template dari data JSON
    const tugasHidup = data.tugasHidup ? getTugasHidup(hanacarakaResult.total, weton.neptu, data.tugasHidup) : null;
    const watak = data.watak ? getWatakAsli(fullName, hanacarakaResult.total, data.watak) : null;
    const titikLuka = data.titikLuka ? getTitikLuka(hanacarakaResult.total, weton.neptu, data.titikLuka) : null;
    const jalurRezeki = data.jalurRezeki ? getJalurRezeki(hanacarakaResult.total, data.jalurRezeki) : null;
    
    // Traits (kelebihan & kekurangan) dari manuritas-traits.json
    const kelebihan = data.kelebihan ? getNameStrengths(patterns.patterns, { templates: data.kelebihan }) : [];
    const kekurangan = data.kekurangan ? getNameWeaknesses(patterns.patterns, { templates: data.kekurangan }) : [];
    
    const saran = data.saran ? getSaranPenyempurnaan(patterns.patterns, weton, data.saran) : [];
    const petaEnergi = data.petaEnergi ? getPetaEnergi(patterns.patterns, wuku.name, data.petaEnergi) : { physical: [], psychological: [] };
    const extreme = data.extreme ? getExtremePatterns(hanacarakaResult.total, patterns.patterns, data.extreme) : [];
    
    return {
        // Data Dasar
        name: fullName,
        hanacaraka: {
            total: hanacarakaResult.total,
            details: hanacarakaResult.details,
            dominantElement: hanacarakaResult.dominantElement
        },
        patterns: patterns,
        
        // Analisis
        strength: strength,
        tugasHidup: tugasHidup,
        watak: watak,
        titikLuka: titikLuka,
        jalurRezeki: jalurRezeki,
        kelebihan: kelebihan,
        kekurangan: kekurangan,
        saran: saran,
        petaEnergi: petaEnergi,
        extreme: extreme,
        
        // Metadata
        weton: weton,
        wuku: wuku
    };
}

/**
 * Memuat semua data Manuritas dari JSON
 */
async function loadManuritasData() {
    try {
        const [
            tugasHidup,
            watak,
            titikLuka,
            jalurRezeki,
            saran,
            petaEnergi,
            extreme
        ] = await Promise.all([
            fetchJSON('../data/manuritas-tugas-hidup.json'),
            fetchJSON('../data/manuritas-watak.json'),
            fetchJSON('../data/manuritas-titik-luka.json'),
            fetchJSON('../data/manuritas-jalur-rezeki.json'),
            fetchJSON('../data/manuritas-saran-nama.json'),
            fetchJSON('../data/manuritas-peta-energi.json'),
            fetchJSON('../data/manuritas-extreme.json')
        ]);
        
        return {
            tugasHidup,
            watak,
            titikLuka,
            jalurRezeki,
            saran,
            petaEnergi,
            extreme
        };
    } catch (e) {
        console.error('Gagal load data Manuritas:', e);
        throw e;
    }
}

console.log('✅ manuritas.js v2.0.0 loaded');
