// ================== DATA LOADER ==================
// File: js/data-loader.js
// Fungsi untuk memuat semua data JSON yang dibutuhkan

const DATA_PATHS = {
    calendar: '../data/bali-calendar.json',
    weton: '../data/bali-weton.json',
    numerology: '../data/numerology.json',
    zodiacShio: '../data/zodiac-shio.json',
    fortunes: (zodiac) => `../data/fortunes/${zodiac.toLowerCase()}.json`
};

/**
 * Fetch JSON dari path yang diberikan
 * @param {string} path - Path ke file JSON
 * @returns {Promise<object>} - Data JSON
 */
async function fetchJSON(path) {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`HTTP ${res.status} - ${path}`);
    return await res.json();
}

/**
 * Memuat semua data dasar (calendar, weton, numerology)
 * @returns {Promise<object>} - Object berisi calendarData, wetonData, numerologyData
 */
async function loadAllData() {
    try {
        const [calendar, weton, numerology] = await Promise.all([
            fetchJSON(DATA_PATHS.calendar),
            fetchJSON(DATA_PATHS.weton),
            fetchJSON(DATA_PATHS.numerology)
        ]);
        return { calendar, weton, numerology };
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