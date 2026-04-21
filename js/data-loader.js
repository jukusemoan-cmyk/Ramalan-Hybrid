// ================== DATA LOADER ==================
// File: js/data-loader.js
// Versi: 2.0.0 - Final dengan Manuritas support
// Fungsi untuk memuat semua data JSON yang dibutuhkan

const DATA_PATHS = {
    calendar: '../data/bali-calendar.json',
    weton: '../data/bali-weton.json',
    numerology: '../data/numerology.json',
    zodiacShio: '../data/zodiac-shio.json',
    fortunes: (zodiac) => `../data/fortunes/${zodiac.toLowerCase()}.json`,
    // Manuritas data
    positiveSyllables: '../data/positive-syllables.json',
    manuritasTraits: '../data/manuritas-traits.json',
    manuritasExtreme: '../data/manuritas-extreme.json',
    // Data tambahan untuk analisis mendalam
    strengthsWeaknesses: '../data/strengths-weaknesses.json',
    obstaclesSolutions: '../data/obstacles-solutions.json',
    hiddenPotentials: '../data/hidden-potentials.json',
    spiritualAdvice: '../data/spiritual-advice.json',
    timingRecommendations: '../data/timing-recommendations.json'
};

/**
 * Fetch JSON dari path yang diberikan
 * @param {string} path - Path ke file JSON
 * @returns {Promise<object>} - Data JSON
 */
async function fetchJSON(path) {
    try {
        const res = await fetch(path);
        if (!res.ok) throw new Error(`HTTP ${res.status} - ${path}`);
        return await res.json();
    } catch (e) {
        console.error(`Gagal fetch ${path}:`, e);
        throw e;
    }
}

/**
 * Memuat semua data dasar (calendar, weton, numerology, zodiacShio)
 * @returns {Promise<object>} - Object berisi calendarData, wetonData, numerologyData, zodiacShioData
 */
async function loadAllData() {
    try {
        const [calendar, weton, numerology, zodiacShio] = await Promise.all([
            fetchJSON(DATA_PATHS.calendar),
            fetchJSON(DATA_PATHS.weton),
            fetchJSON(DATA_PATHS.numerology),
            fetchJSON(DATA_PATHS.zodiacShio)
        ]);
        return { calendar, weton, numerology, zodiacShio };
    } catch(e) {
        console.error('Gagal load data dasar:', e);
        throw e;
    }
}

/**
 * Memuat data ramalan untuk zodiak tertentu
 * @param {string} zodiac - Nama zodiak (contoh: 'Aries')
 * @returns {Promise<object|null>} - Data fortunes atau null jika gagal
 */
async function loadFortunes(zodiac) {
    try {
        return await fetchJSON(DATA_PATHS.fortunes(zodiac));
    } catch(e) {
        console.error(`Gagal load fortunes ${zodiac}:`, e);
        return null;
    }
}

/**
 * Memuat data zodiac dan shio
 * @returns {Promise<object|null>} - Data zodiac-shio atau null jika gagal
 */
async function loadZodiacShio() {
    try {
        return await fetchJSON(DATA_PATHS.zodiacShio);
    } catch(e) {
        console.error('Gagal load zodiac-shio:', e);
        return null;
    }
}

// ========== FUNGSI MANURITAS ==========

/**
 * Memuat data Positive Syllables untuk Generator Nama Selaras
 * @returns {Promise<object|null>} - Data positive-syllables atau null jika gagal
 */
async function loadPositiveSyllables() {
    try {
        return await fetchJSON(DATA_PATHS.positiveSyllables);
    } catch(e) {
        console.error('Gagal load positive-syllables:', e);
        return null;
    }
}

/**
 * Memuat data Manuritas Traits (Kelebihan & Kekurangan)
 * @returns {Promise<object|null>} - Data manuritas-traits atau null jika gagal
 */
async function loadManuritasTraits() {
    try {
        return await fetchJSON(DATA_PATHS.manuritasTraits);
    } catch(e) {
        console.error('Gagal load manuritas-traits:', e);
        return null;
    }
}

/**
 * Memuat data Manuritas Extreme (Peringatan Khusus)
 * @returns {Promise<object|null>} - Data manuritas-extreme atau null jika gagal
 */
async function loadManuritasExtreme() {
    try {
        return await fetchJSON(DATA_PATHS.manuritasExtreme);
    } catch(e) {
        console.error('Gagal load manuritas-extreme:', e);
        return null;
    }
}

// ========== FUNGSI ANALISIS MENDALAM ==========

/**
 * Memuat data Strengths & Weaknesses untuk analisis kepribadian
 * @returns {Promise<object|null>}
 */
async function loadStrengthsWeaknesses() {
    try {
        return await fetchJSON(DATA_PATHS.strengthsWeaknesses);
    } catch(e) {
        console.error('Gagal load strengths-weaknesses:', e);
        return null;
    }
}

/**
 * Memuat data Obstacles & Solutions
 * @returns {Promise<object|null>}
 */
async function loadObstaclesSolutions() {
    try {
        return await fetchJSON(DATA_PATHS.obstaclesSolutions);
    } catch(e) {
        console.error('Gagal load obstacles-solutions:', e);
        return null;
    }
}

/**
 * Memuat data Hidden Potentials
 * @returns {Promise<object|null>}
 */
async function loadHiddenPotentials() {
    try {
        return await fetchJSON(DATA_PATHS.hiddenPotentials);
    } catch(e) {
        console.error('Gagal load hidden-potentials:', e);
        return null;
    }
}

/**
 * Memuat data Spiritual Advice
 * @returns {Promise<object|null>}
 */
async function loadSpiritualAdvice() {
    try {
        return await fetchJSON(DATA_PATHS.spiritualAdvice);
    } catch(e) {
        console.error('Gagal load spiritual-advice:', e);
        return null;
    }
}

/**
 * Memuat data Timing Recommendations
 * @returns {Promise<object|null>}
 */
async function loadTimingRecommendations() {
    try {
        return await fetchJSON(DATA_PATHS.timingRecommendations);
    } catch(e) {
        console.error('Gagal load timing-recommendations:', e);
        return null;
    }
}

/**
 * Memuat SEMUA data Manuritas sekaligus
 * @returns {Promise<object>} - Object berisi semua data Manuritas
 */
async function loadAllManuritasData() {
    try {
        const [
            positiveSyllables,
            manuritasTraits,
            manuritasExtreme
        ] = await Promise.all([
            loadPositiveSyllables(),
            loadManuritasTraits(),
            loadManuritasExtreme()
        ]);
        
        return {
            positiveSyllables,
            manuritasTraits,
            manuritasExtreme
        };
    } catch(e) {
        console.error('Gagal load data Manuritas:', e);
        throw e;
    }
}

/**
 * Memuat SEMUA data analisis mendalam sekaligus
 * @returns {Promise<object>}
 */
async function loadAllAnalysisData() {
    try {
        const [
            strengths,
            obstacles,
            potentials,
            spiritual,
            timing
        ] = await Promise.all([
            loadStrengthsWeaknesses(),
            loadObstaclesSolutions(),
            loadHiddenPotentials(),
            loadSpiritualAdvice(),
            loadTimingRecommendations()
        ]);
        
        return {
            strengths,
            obstacles,
            potentials,
            spiritual,
            timing
        };
    } catch(e) {
        console.error('Gagal load data analisis:', e);
        return {
            strengths: null,
            obstacles: null,
            potentials: null,
            spiritual: null,
            timing: null
        };
    }
}

console.log('✅ data-loader.js v2.0.0 loaded');
