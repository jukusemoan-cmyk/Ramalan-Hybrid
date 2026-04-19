// ================== KALKULATOR UTAMA ==================
// File: js/calculator.js
// Fungsi perhitungan: Zodiak, Shio, Weton, Wuku, Numerologi, BaZi

// ---------- 1. ZODIAK BARAT ----------
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
    return 'Capricorn';
}

// ---------- 2. SHIO TIONGKOK ----------
function getShio(year) {
    const shioList = ['Tikus', 'Kerbau', 'Macan', 'Kelinci', 'Naga', 'Ular', 'Kuda', 'Kambing', 'Monyet', 'Ayam', 'Anjing', 'Babi'];
    const baseYear = 1900;
    let index = (year - baseYear) % 12;
    if (index < 0) index += 12;
    return shioList[index];
}

// ---------- 3. WETON & NEPTU ----------
const EPOCH_DATE = new Date(1900, 0, 1);
const SAPTAWARA_EPOCH = 'Soma';
const PANCAWARA_EPOCH = 'Paing';
const SAPTAWARA_LIST = ['Redite', 'Soma', 'Anggara', 'Buda', 'Wrespati', 'Sukra', 'Saniscara'];
const PANCAWARA_LIST = ['Umanis', 'Paing', 'Pon', 'Wage', 'Kliwon'];

function getWeton(date) {
    const inputDate = new Date(date);
    const diffTime = inputDate - EPOCH_DATE;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    const saptaIndex = (SAPTAWARA_LIST.indexOf(SAPTAWARA_EPOCH) + diffDays) % 7;
    const saptawara = SAPTAWARA_LIST[saptaIndex >= 0 ? saptaIndex : saptaIndex + 7];
    
    const pancaIndex = (PANCAWARA_LIST.indexOf(PANCAWARA_EPOCH) + diffDays) % 5;
    const pancawara = PANCAWARA_LIST[pancaIndex >= 0 ? pancaIndex : pancaIndex + 5];
    
    return { saptawara, pancawara, combo: `${saptawara} ${pancawara}` };
}

function calculateNeptu(saptawara, pancawara, saptawaraData, pancawaraData) {
    const sData = saptawaraData.find(s => s.name === saptawara);
    const pData = pancawaraData.find(p => p.name === pancawara);
    if (!sData || !pData) return 0;
    return sData.urip + pData.urip;
}

// ---------- 4. WUKU ----------
const WUKU_LIST = [
    'Sinta', 'Landep', 'Ukir', 'Kulantir', 'Tolu', 'Gumbreg', 'Wariga', 'Warigadean', 'Julungwangi', 'Sungsang',
    'Dunggulan', 'Kuningan', 'Langkir', 'Medangsia', 'Pujut', 'Pahang', 'Krulut', 'Merakih', 'Tambir', 'Medangkungan',
    'Matal', 'Uye', 'Menail', 'Prangbakat', 'Bala', 'Ugu', 'Wayang', 'Klawu', 'Dukut', 'Watugunung'
];
const WUKU_EPOCH_DATE = new Date(2000, 4, 21); // 21 Mei 2000 = Sinta

function getWuku(date) {
    const inputDate = new Date(date);
    const diffTime = inputDate - WUKU_EPOCH_DATE;
    let diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    let dayInCycle = diffDays % 210;
    if (dayInCycle < 0) dayInCycle += 210;
    const wukuIndex = Math.floor(dayInCycle / 7);
    const dayOfWuku = (dayInCycle % 7) + 1;
    return { name: WUKU_LIST[wukuIndex], index: wukuIndex + 1, day: dayOfWuku };
}

// ---------- 5. SASIH (PERKIRAAN) ----------
const SASIH_LIST = ['Kasa', 'Karo', 'Katiga', 'Kapat', 'Kalima', 'Kanem', 'Kapitu', 'Kawolu', 'Kasanga', 'Kadasa', 'Jyestha', 'Sadha'];
function getSasih(date) {
    const month = date.getMonth() + 1;
    const approxIndex = (month + 2) % 12;
    return { name: SASIH_LIST[approxIndex], index: approxIndex + 1 };
}

// ---------- 6. NUMEROLOGI ----------
const NUMEROLOGY_CHART = {
    'a':1,'b':2,'c':3,'d':4,'e':5,'f':6,'g':7,'h':8,'i':9,'j':1,'k':2,'l':3,'m':4,'n':5,'o':6,'p':7,'q':8,'r':9,
    's':1,'t':2,'u':3,'v':4,'w':5,'x':6,'y':7,'z':8
};
const VOWELS = ['a','i','u','e','o'];

function reduceToSingleDigit(num) {
    if (num === 11 || num === 22 || num === 33) return num;
    while (num > 9) num = num.toString().split('').reduce((s, d) => s + parseInt(d), 0);
    return num;
}
function calculateStringValue(str) {
    let total = 0;
    const clean = str.toLowerCase().replace(/[^a-z]/g, '');
    for (let c of clean) total += NUMEROLOGY_CHART[c] || 0;
    return total;
}
function calculateSoulUrge(fullName) {
    let total = 0;
    const clean = fullName.toLowerCase().replace(/[^a-z]/g, '');
    for (let c of clean) if (VOWELS.includes(c)) total += NUMEROLOGY_CHART[c] || 0;
    return reduceToSingleDigit(total);
}
function calculatePersonality(fullName) {
    let total = 0;
    const clean = fullName.toLowerCase().replace(/[^a-z]/g, '');
    for (let c of clean) if (!VOWELS.includes(c)) total += NUMEROLOGY_CHART[c] || 0;
    return reduceToSingleDigit(total);
}
function calculateDestiny(fullName) {
    return reduceToSingleDigit(calculateStringValue(fullName));
}
function calculateNumerology(fullName) {
    if (!fullName || fullName.trim() === '') return null;
    const soul = calculateSoulUrge(fullName);
    const pers = calculatePersonality(fullName);
    const dest = calculateDestiny(fullName);
    let power = '';
    if (dest === 1) power = 'The Leader';
    else if (dest === 2) power = 'The Diplomat';
    else if (dest === 3) power = 'The Communicator';
    else if (dest === 4) power = 'The Builder';
    else if (dest === 5) power = 'The Adventurer';
    else if (dest === 6) power = 'The Nurturer';
    else if (dest === 7) power = 'The Thinker';
    else if (dest === 8) power = 'The Executor';
    else if (dest === 9) power = 'The Humanitarian';
    else if (dest === 11) power = 'The Inspirer';
    else if (dest === 22) power = 'The Master Builder';
    else if (dest === 33) power = 'The Master Teacher';
    if (soul === 1) power += ' with a Pioneering Soul';
    else if (soul === 2) power += ' with a Gentle Heart';
    else if (soul === 3) power += ' with a Creative Spark';
    else if (soul === 4) power += ' with a Steadfast Core';
    else if (soul === 5) power += ' with a Free Spirit';
    else if (soul === 6) power += ' with a Nurturing Soul';
    else if (soul === 7) power += ' with a Mystical Mind';
    else if (soul === 8) power += ' with an Ambitious Drive';
    else if (soul === 9) power += ' with a Compassionate Heart';
    return { soul_urge: soul, personality: pers, destiny: dest, power_name: power };
}

// ---------- 7. BAZI (EMPAT PILAR) ----------
const SOLAR_TERMS_DATA = {
    "2020": { "li_chun": "02-04 17:03" }, "2021": { "li_chun": "02-03 23:00" }, "2022": { "li_chun": "02-04 04:51" },
    "2023": { "li_chun": "02-04 10:42" }, "2024": { "li_chun": "02-04 16:27" }, "2025": { "li_chun": "02-03 22:10" },
    "2026": { "li_chun": "02-04 04:02" }
};
const STEMS = [
    { id: 1, name: "Jia", element: "Kayu", polarity: "Yang" }, { id: 2, name: "Yi", element: "Kayu", polarity: "Yin" },
    { id: 3, name: "Bing", element: "Api", polarity: "Yang" }, { id: 4, name: "Ding", element: "Api", polarity: "Yin" },
    { id: 5, name: "Wu", element: "Tanah", polarity: "Yang" }, { id: 6, name: "Ji", element: "Tanah", polarity: "Yin" },
    { id: 7, name: "Geng", element: "Logam", polarity: "Yang" }, { id: 8, name: "Xin", element: "Logam", polarity: "Yin" },
    { id: 9, name: "Ren", element: "Air", polarity: "Yang" }, { id: 10, name: "Gui", element: "Air", polarity: "Yin" }
];
const BRANCHES = [
    { id: 1, name: "Zi", animal: "Tikus", element: "Air", polarity: "Yang" }, { id: 2, name: "Chou", animal: "Kerbau", element: "Tanah", polarity: "Yin" },
    { id: 3, name: "Yin", animal: "Macan", element: "Kayu", polarity: "Yang" }, { id: 4, name: "Mao", animal: "Kelinci", element: "Kayu", polarity: "Yin" },
    { id: 5, name: "Chen", animal: "Naga", element: "Tanah", polarity: "Yang" }, { id: 6, name: "Si", animal: "Ular", element: "Api", polarity: "Yin" },
    { id: 7, name: "Wu", animal: "Kuda", element: "Api", polarity: "Yang" }, { id: 8, name: "Wei", animal: "Kambing", element: "Tanah", polarity: "Yin" },
    { id: 9, name: "Shen", animal: "Monyet", element: "Logam", polarity: "Yang" }, { id: 10, name: "You", animal: "Ayam", element: "Logam", polarity: "Yin" },
    { id: 11, name: "Xu", animal: "Anjing", element: "Tanah", polarity: "Yang" }, { id: 12, name: "Hai", animal: "Babi", element: "Air", polarity: "Yin" }
];

function getBaZiYear(date) {
    const year = date.getFullYear();
    let liChunStr = SOLAR_TERMS_DATA[year]?.li_chun || `02-04 12:00`;
    const [liDate, liTime] = liChunStr.split(' ');
    const [lcMonth, lcDay] = liDate.split('-').map(Number);
    const [lcHour, lcMin] = liTime.split(':').map(Number);
    const liChun = new Date(year, lcMonth - 1, lcDay, lcHour, lcMin);
    return date < liChun ? year - 1 : year;
}
function getBaZiMonth(date) {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const ranges = [
        { start: [2,4], end: [3,5], m: 1 }, { start: [3,6], end: [4,4], m: 2 }, { start: [4,5], end: [5,5], m: 3 },
        { start: [5,6], end: [6,5], m: 4 }, { start: [6,6], end: [7,6], m: 5 }, { start: [7,7], end: [8,7], m: 6 },
        { start: [8,8], end: [9,7], m: 7 }, { start: [9,8], end: [10,7], m: 8 }, { start: [10,8], end: [11,6], m: 9 },
        { start: [11,7], end: [12,6], m: 10 }, { start: [12,7], end: [1,5], m: 11 }, { start: [1,6], end: [2,3], m: 12 }
    ];
    for (let r of ranges) {
        const [sM, sD] = r.start; const [eM, eD] = r.end;
        if ((month === sM && day >= sD) || (month === eM && day <= eD)) return r.m;
        if (sM === 12 && month === 1 && day <= eD) return r.m;
        if (sM === 12 && month === 12 && day >= sD) return r.m;
    }
    return ((month + 1) % 12) || 12;
}
function getHourBranch(hour) {
    const map = [{ s:23, e:24, b:1 },{ s:0, e:1, b:1 },{ s:1, e:3, b:2 },{ s:3, e:5, b:3 },{ s:5, e:7, b:4 },{ s:7, e:9, b:5 },
                { s:9, e:11, b:6 },{ s:11, e:13, b:7 },{ s:13, e:15, b:8 },{ s:15, e:17, b:9 },{ s:17, e:19, b:10 },
                { s:19, e:21, b:11 },{ s:21, e:23, b:12 }];
    for (let m of map) if (hour >= m.s && hour < m.e) return m.b;
    return 1;
}
function getYearStem(baziYear) { let i = (baziYear - 3) % 10; if (i <= 0) i += 10; return STEMS[i - 1]; }
function getYearBranch(baziYear) { let i = (baziYear - 3) % 12; if (i <= 0) i += 12; return BRANCHES[i - 1]; }
function getMonthStem(yearStemId, baziMonth) { let i = (yearStemId * 2 + baziMonth) % 10; if (i === 0) i = 10; return STEMS[i - 1]; }
function getMonthBranch(baziMonth) { let i = (baziMonth + 2) % 12; if (i === 0) i = 12; return BRANCHES[i - 1]; }
function getDayStemBranch(date) {
    const base = new Date(1900, 0, 31);
    const diff = Math.floor((date - base) / (1000 * 60 * 60 * 24));
    let s = (diff % 10) + 1; if (s <= 0) s += 10;
    let b = (diff % 12) + 1; if (b <= 0) b += 12;
    return { stem: STEMS[s - 1], branch: BRANCHES[b - 1] };
}
function getHourStem(dayStemId, hourBranchId) { let i = (dayStemId * 2 + hourBranchId - 2) % 10; if (i === 0) i = 10; return STEMS[i - 1]; }

function calculateBaZi(date, hour = 12) {
    const baziYear = getBaZiYear(date);
    const yearStem = getYearStem(baziYear);
    const yearBranch = getYearBranch(baziYear);
    const baziMonth = getBaZiMonth(date);
    const monthStem = getMonthStem(yearStem.id, baziMonth);
    const monthBranch = getMonthBranch(baziMonth);
    const dayStemBranch = getDayStemBranch(date);
    const hourBranchId = getHourBranch(hour);
    const hourBranch = BRANCHES[hourBranchId - 1];
    const hourStem = getHourStem(dayStemBranch.stem.id, hourBranchId);
    return {
        year: { stem: yearStem, branch: yearBranch, baziYear },
        month: { stem: monthStem, branch: monthBranch, baziMonth },
        day: { stem: dayStemBranch.stem, branch: dayStemBranch.branch },
        hour: { stem: hourStem, branch: hourBranch, shichen: hourBranchId },
        dayMaster: dayStemBranch.stem
    };
}

function getTenGod(dayMaster, targetStem) {
    const dm = dayMaster, ts = targetStem;
    const rel = {
        'Kayu': { kalahkan: 'Tanah', dikalahkan: 'Logam', hasilkan: 'Api', dihasilkan: 'Air' },
        'Api': { kalahkan: 'Logam', dikalahkan: 'Air', hasilkan: 'Tanah', dihasilkan: 'Kayu' },
        'Tanah': { kalahkan: 'Air', dikalahkan: 'Kayu', hasilkan: 'Logam', dihasilkan: 'Api' },
        'Logam': { kalahkan: 'Kayu', dikalahkan: 'Api', hasilkan: 'Air', dihasilkan: 'Tanah' },
        'Air': { kalahkan: 'Api', dikalahkan: 'Tanah', hasilkan: 'Kayu', dihasilkan: 'Logam' }
    };
    const samePol = dm.polarity === ts.polarity;
    if (dm.element === ts.element) return samePol ? 'friend' : 'rob_wealth';
    if (rel[dm.element].dikalahkan === ts.element) return samePol ? 'seven_killings' : 'direct_officer';
    if (rel[dm.element].kalahkan === ts.element) return samePol ? 'indirect_wealth' : 'direct_wealth';
    if (rel[dm.element].dihasilkan === ts.element) return samePol ? 'eating_god' : 'hurting_officer';
    if (rel[dm.element].hasilkan === ts.element) return samePol ? 'indirect_resource' : 'direct_resource';
    return 'unknown';
}

function analyzeBaZiChart(date, hour = 12) {
    const pillars = calculateBaZi(date, hour);
    const dm = pillars.dayMaster;
    return {
        pillars,
        dayMaster: dm,
        tenGods: {
            year: getTenGod(dm, pillars.year.stem),
            month: getTenGod(dm, pillars.month.stem),
            day: getTenGod(dm, pillars.day.stem),
            hour: getTenGod(dm, pillars.hour.stem)
        },
        summary: {
            year: `${pillars.year.stem.name} ${pillars.year.branch.name}`,
            month: `${pillars.month.stem.name} ${pillars.month.branch.name}`,
            day: `${pillars.day.stem.name} ${pillars.day.branch.name}`,
            hour: `${pillars.hour.stem.name} ${pillars.hour.branch.name}`
        }
    };
}

// ---------- 8. FUNGSI UTAMA (DIPANGGIL DARI HALAMAN) ----------
async function calculateAll(birthDateString, calendarData, wetonData) {
    const date = new Date(birthDateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    const zodiac = getZodiac(month, day);
    const shio = getShio(year);
    const weton = getWeton(date);
    const neptu = calculateNeptu(weton.saptawara, weton.pancawara, calendarData.saptawara, calendarData.pancawara);
    const wuku = getWuku(date);
    const sasih = getSasih(date);
    const wukuData = calendarData.wuku.find(w => w.name === wuku.name);
    const wetonChar = wetonData?.weton_characters?.find(w => w.combo === weton.combo);

    return {
        zodiac, shio,
        weton: { saptawara: weton.saptawara, pancawara: weton.pancawara, combo: weton.combo, neptu, character: wetonChar?.character || '' },
        wuku: { name: wuku.name, index: wuku.index, day: wuku.day, meaning: wukuData?.meaning || '', character: wukuData?.character || '', activity: wukuData?.activity || '', forbidden: wukuData?.forbidden_direction || '' },
        sasih: { name: sasih.name, index: sasih.index }
    };
}