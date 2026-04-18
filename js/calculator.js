/**
 * Kalkulator Primbon Hybrid
 * Menghitung Zodiak, Shio, Weton, Neptu, Wuku, Sasih
 * berdasarkan tanggal lahir Masehi.
 */

// ---------- 1. KONVERSI ZODIAK BARAT ----------
function getZodiac(month, day) {
    const zodiacs = [
        { name: 'Capricorn', start: [12, 22], end: [1, 19] },
        { name: 'Aquarius', start: [1, 20], end: [2, 18] },
        { name: 'Pisces', start: [2, 19], end: [3, 20] },
        { name: 'Aries', start: [3, 21], end: [4, 19] },
        { name: 'Taurus', start: [4, 20], end: [5, 20] },
        { name: 'Gemini', start: [5, 21], end: [6, 20] },
        { name: 'Cancer', start: [6, 21], end: [7, 22] },
        { name: 'Leo', start: [7, 23], end: [8, 22] },
        { name: 'Virgo', start: [8, 23], end: [9, 22] },
        { name: 'Libra', start: [9, 23], end: [10, 22] },
        { name: 'Scorpio', start: [10, 23], end: [11, 21] },
        { name: 'Sagittarius', start: [11, 22], end: [12, 21] }
    ];

    for (let z of zodiacs) {
        const [sMonth, sDay] = z.start;
        const [eMonth, eDay] = z.end;
        if ((month === sMonth && day >= sDay) || (month === eMonth && day <= eDay)) {
            return z.name;
        }
    }
    return 'Capricorn'; // fallback untuk 22 Des - 31 Des
}

// ---------- 2. KONVERSI SHIO TIONGKOK ----------
function getShio(year) {
    const shioList = [
        'Tikus', 'Kerbau', 'Macan', 'Kelinci', 'Naga', 'Ular',
        'Kuda', 'Kambing', 'Monyet', 'Ayam', 'Anjing', 'Babi'
    ];
    const baseYear = 1900; // Tahun Tikus
    let index = (year - baseYear) % 12;
    if (index < 0) index += 12;
    return shioList[index];
}

// ---------- 3. KONVERSI HARI KE SAPTAWARA & PANCAWARA (WETON) ----------
// Menggunakan referensi epoch: 1 Januari 1900 adalah Senin Paing (Soma Paing)
// Nilai ini umum digunakan dalam perhitungan weton online.

const EPOCH_DATE = new Date(1900, 0, 1); // 1 Jan 1900
const SAPTAWARA_EPOCH = 'Soma'; // Senin
const PANCAWARA_EPOCH = 'Paing';

const SAPTAWARA_LIST = ['Redite', 'Soma', 'Anggara', 'Buda', 'Wrespati', 'Sukra', 'Saniscara'];
const PANCAWARA_LIST = ['Umanis', 'Paing', 'Pon', 'Wage', 'Kliwon'];

function getWeton(date) {
    const inputDate = new Date(date);
    // Hitung selisih hari dari epoch
    const diffTime = inputDate - EPOCH_DATE;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    // Indeks Saptawara
    const saptaIndex = (SAPTAWARA_LIST.indexOf(SAPTAWARA_EPOCH) + diffDays) % 7;
    const saptawara = SAPTAWARA_LIST[saptaIndex >= 0 ? saptaIndex : saptaIndex + 7];
    
    // Indeks Pancawara
    const pancaIndex = (PANCAWARA_LIST.indexOf(PANCAWARA_EPOCH) + diffDays) % 5;
    const pancawara = PANCAWARA_LIST[pancaIndex >= 0 ? pancaIndex : pancaIndex + 5];
    
    return { saptawara, pancawara, combo: `${saptawara} ${pancawara}` };
}

// ---------- 4. MENGHITUNG NEPTU (URIP) ----------
// Membutuhkan data Urip dari JSON. Fungsi ini akan dipanggil setelah data di-fetch.
function calculateNeptu(saptawara, pancawara, saptawaraData, pancawaraData) {
    const sData = saptawaraData.find(s => s.name === saptawara);
    const pData = pancawaraData.find(p => p.name === pancawara);
    if (!sData || !pData) return 0;
    return sData.urip + pData.urip;
}

// ---------- 5. KONVERSI WUKU (SIKLUS 210 HARI) ----------
// Referensi: 1 Januari 1900 adalah Wuku Sinta (hari pertama siklus)
// Siklus Wuku: 30 wuku x 7 hari = 210 hari.

const WUKU_LIST = [
    'Sinta', 'Landep', 'Ukir', 'Kulantir', 'Tolu', 'Gumbreg',
    'Wariga', 'Warigadean', 'Julungwangi', 'Sungsang', 'Dunggulan', 'Kuningan',
    'Langkir', 'Medangsia', 'Pujut', 'Pahang', 'Krulut', 'Merakih',
    'Tambir', 'Medangkungan', 'Matal', 'Uye', 'Menail', 'Prangbakat',
    'Bala', 'Ugu', 'Wayang', 'Klawu', 'Dukut', 'Watugunung'
];

const WUKU_EPOCH_DATE = new Date(1900, 0, 1); // 1 Jan 1900 = Sinta

function getWuku(date) {
    const inputDate = new Date(date);
    const diffTime = inputDate - WUKU_EPOCH_DATE;
    let diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    // Normalisasi ke rentang 0-209
    const dayInCycle = diffDays % 210;
    const wukuIndex = Math.floor(dayInCycle / 7); // 0-29
    const dayOfWuku = (dayInCycle % 7) + 1; // 1-7
    
    return {
        name: WUKU_LIST[wukuIndex],
        index: wukuIndex + 1, // 1-30
        day: dayOfWuku
    };
}

// ---------- 6. KONVERSI SASIH (BULAN BALI) ----------
// Sasih dihitung berdasarkan siklus bulan (29.5 hari). Untuk mempermudah, 
// kita gunakan pendekatan kalender lunar sederhana dengan referensi Tilem.
// Namun, untuk akurasi tinggi diperlukan perhitungan astronomis.
// Di sini kita gunakan pendekatan perkiraan berbasis jumlah hari sejak epoch Sasih.

// Referensi: Sasih Kasa (1) dimulai sekitar Maret/April.
// Kita gunakan pendekatan statis untuk demo.

const SASIH_LIST = [
    'Kasa', 'Karo', 'Katiga', 'Kapat', 'Kalima', 'Kanem',
    'Kapitu', 'Kawolu', 'Kasanga', 'Kadasa', 'Jyestha', 'Sadha'
];

function getSasih(date) {
    // Pendekatan sederhana: gunakan bulan Masehi sebagai dasar.
    // Karena Sasih tidak bisa dihitung hanya dari tanggal Masehi tanpa data astronomi,
    // kita akan mengembalikan perkiraan berdasarkan bulan Masehi untuk keperluan demo.
    // Untuk produksi, sebaiknya gunakan library atau API kalender Bali.
    const month = date.getMonth() + 1; // 1-12
    // Mapping kasar (tidak akurat, hanya placeholder)
    const approxIndex = (month + 2) % 12;
    return {
        name: SASIH_LIST[approxIndex],
        index: approxIndex + 1
    };
}

// Untuk penggunaan yang lebih akurat, fungsi getSasih bisa diambil dari data JSON statis
// atau menggunakan algoritma yang lebih kompleks.

// ---------- 7. FUNGSI UTAMA UNTUK DIPANGGIL DARI MAIN.JS ----------
async function calculateAll(birthDateString, calendarData, wetonData) {
    const date = new Date(birthDateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    // Zodiak & Shio
    const zodiac = getZodiac(month, day);
    const shio = getShio(year);

    // Weton & Neptu
    const weton = getWeton(date);
    const neptu = calculateNeptu(
        weton.saptawara, weton.pancawara,
        calendarData.saptawara, calendarData.pancawara
    );

    // Wuku
    const wuku = getWuku(date);
    
    // Sasih (placeholder)
    const sasih = getSasih(date);

    // Cari data lengkap Wuku dari JSON
    const wukuData = calendarData.wuku.find(w => w.name === wuku.name);
    
    // Cari karakter weton dari JSON (opsional)
    const wetonChar = wetonData?.weton_characters.find(w => w.combo === weton.combo);

    return {
        zodiac,
        shio,
        weton: {
            saptawara: weton.saptawara,
            pancawara: weton.pancawara,
            combo: weton.combo,
            neptu,
            character: wetonChar?.character || 'Data karakter tidak tersedia.'
        },
        wuku: {
            name: wuku.name,
            index: wuku.index,
            day: wuku.day,
            meaning: wukuData?.meaning || '',
            character: wukuData?.character || '',
            activity: wukuData?.activity || '',
            forbidden: wukuData?.forbidden_direction || ''
        },
        sasih: {
            name: sasih.name,
            index: sasih.index
        }
    };
}
