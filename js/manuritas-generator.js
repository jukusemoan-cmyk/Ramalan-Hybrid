/**
 * MANURITAS GENERATOR - Generator Nama Selaras v4.0 GRATIS
 * - Generator nama langsung tampil TANPA potong token
 * - Saat nama dipilih, tampilkan PERBANDINGAN nama asli vs nama baru
 * - Token hanya sebagai opsi dukungan sukarela
 * 
 * DEPENDENCIES: manuritas.js (harus di-load sebelum file ini)
 */

'use strict';

// ========== KONSTANTA PAKET ==========
const PACKAGE_CONFIG = {
  silver: {
    name: 'SILVER',
    icon: '🥈',
    tokenCost: 0, // GRATIS
    targetMin: 60,
    targetMax: 74,
    description: 'Target 60-74%',
    optionsCount: 3,
    free: true
  },
  gold: {
    name: 'GOLD',
    icon: '🥇',
    tokenCost: 0, // GRATIS
    targetMin: 75,
    targetMax: 89,
    description: 'Target 75-89%',
    optionsCount: 3,
    free: true
  },
  platinum: {
    name: 'PLATINUM',
    icon: '💎',
    tokenCost: 0, // GRATIS
    targetMin: 90,
    targetMax: 100,
    description: 'Target 90-100%',
    optionsCount: 3,
    free: true
  }
};

// ========== STATE ==========
let positiveSyllablesData = null;
let originalManuritasResult = null; // Simpan hasil analisis nama asli

// ========== ALIAS FUNGSI DARI manuritas.js ==========
function getHanacarakaTotal(name) {
  const result = hanacarakaValue(name);
  return result ? result.total : 0;
}

function getDominantElement(name) {
  const result = hanacarakaValue(name);
  return result ? result.dominantElement : 'Tanah';
}

// ========== LOAD DATA SYLLABLES ==========
async function loadPositiveSyllables() {
  if (positiveSyllablesData) return positiveSyllablesData;
  
  try {
    const response = await fetch('../data/positive-syllables.json');
    if (response.ok) {
      positiveSyllablesData = await response.json();
      console.log('✅ Positive syllables loaded:', positiveSyllablesData.syllables?.length || 0, 'entries');
      return positiveSyllablesData;
    }
  } catch(e) {
    console.warn('⚠️ Gagal load positive-syllables.json');
  }
  
  if (window.positiveSyllablesData) {
    positiveSyllablesData = window.positiveSyllablesData;
    return positiveSyllablesData;
  }
  
  return null;
}

// ========== DETERMINE ELEMENT FROM SYLLABLES ==========
function determineElementFromSyllables(name, syllables) {
  if (!name || !syllables) return getDominantElement(name);
  
  const elementCount = { 'Api': 0, 'Air': 0, 'Tanah': 0, 'Kayu': 0, 'Logam': 0, 'Udara': 0 };
  const cleanName = name.toLowerCase().replace(/[^a-z]/g, '');
  
  for (let s of syllables) {
    if (cleanName.includes(s.text.toLowerCase())) {
      if (elementCount.hasOwnProperty(s.element)) {
        elementCount[s.element] += (s.hanacaraka_value || 1);
      }
    }
  }
  
  let maxElement = getDominantElement(name);
  let maxValue = 0;
  for (let [element, value] of Object.entries(elementCount)) {
    if (value > maxValue) {
      maxValue = value;
      maxElement = element;
    }
  }
  
  return maxElement;
}

// ========== CALCULATE GENERATOR NAME STRENGTH ==========
function calculateGeneratorNameStrength(name, syllables, wetonNeptu = 10) {
  const hanacarakaTotal = getHanacarakaTotal(name);
  const cleanName = name.toLowerCase().replace(/[^a-z]/g, '');
  let positiveCount = 0;
  
  for (let s of syllables) {
    if (cleanName.includes(s.text.toLowerCase())) {
      positiveCount += s.hanacaraka_value || 1;
    }
  }
  
  const hanacarakaScore = Math.min(100, (hanacarakaTotal / 60) * 100);
  const syllableScore = Math.min(100, (positiveCount / 50) * 100);
  const wetonScore = Math.min(100, (wetonNeptu / 18) * 100);
  
  return Math.round((hanacarakaScore * 0.3) + (syllableScore * 0.4) + (wetonScore * 0.3));
}

// ========== GENERATE NAMES ==========
function generateNames(targetMin, targetMax, count, baseName, syllables, wetonNeptu = 10) {
  if (!syllables || syllables.length === 0) return [];
  
  const generatedNames = [];
  const maxAttempts = 500;
  let attempts = 0;
  
  const basePrefix = baseName.split(' ')[0] || baseName;
  
  const kataTradisional = syllables.filter(s => s.type === 'kata_tradisional');
  const namaModern = syllables.filter(s => s.type === 'nama_modern');
  const sukuKata = syllables.filter(s => s.type === 'suku_kata');
  const tokohInspiratif = syllables.filter(s => s.type === 'tokoh_inspiratif');
  
  while (generatedNames.length < count && attempts < maxAttempts) {
    attempts++;
    
    let candidateName = '';
    const strategy = Math.floor(Math.random() * 4);
    
    switch(strategy) {
      case 0:
        const tradisional = kataTradisional[Math.floor(Math.random() * kataTradisional.length)];
        if (tradisional && tradisional.text !== basePrefix) {
          candidateName = basePrefix + ' ' + tradisional.text;
        }
        break;
      case 1:
        const modern = namaModern[Math.floor(Math.random() * namaModern.length)];
        if (modern && modern.text !== basePrefix) {
          candidateName = modern.text;
        }
        break;
      case 2:
        const sk1 = sukuKata[Math.floor(Math.random() * sukuKata.length)];
        const sk2 = sukuKata[Math.floor(Math.random() * sukuKata.length)];
        if (sk1 && sk2 && sk1.text !== sk2.text) {
          candidateName = sk1.text + ' ' + sk2.text;
        }
        break;
      case 3:
        const tokoh = tokohInspiratif[Math.floor(Math.random() * tokohInspiratif.length)];
        if (tokoh) {
          candidateName = tokoh.text.replace(/_/g, ' ');
        }
        break;
    }
    
    if (!candidateName || candidateName.trim().length < 3) continue;
    
    const strength = calculateGeneratorNameStrength(candidateName, syllables, wetonNeptu);
    
    if (strength >= targetMin && strength <= targetMax + 5) {
      if (!generatedNames.find(n => n.text === candidateName)) {
        const element = determineElementFromSyllables(candidateName, syllables);
        const hanacarakaVal = getHanacarakaTotal(candidateName);
        
        generatedNames.push({
          text: candidateName,
          strength: strength,
          element: element,
          hanacaraka_value: hanacarakaVal,
          label: strength >= 90 ? 'SANGAT KUAT' : 
                 strength >= 75 ? 'KUAT' : 
                 strength >= 60 ? 'CUKUP' : 'KURANG'
        });
      }
    }
  }
  
  generatedNames.sort((a, b) => b.strength - a.strength);
  return generatedNames.slice(0, count);
}

// ========== RENDER OPSI NAMA ==========
function renderNameOptions(generatedNames, packageType) {
  const container = document.getElementById('nameOptionsContainer');
  if (!container) return;
  
  if (!generatedNames || generatedNames.length === 0) {
    container.innerHTML = `
      <div style="background: rgba(15,15,20,0.8); border-radius: 16px; padding: 24px; text-align: center; border: 1px solid rgba(212,175,55,0.2);">
        <p style="color: #D4AF37;">⚠️ Tidak dapat menghasilkan nama untuk target ini. Coba paket lain.</p>
      </div>`;
    return;
  }
  
  const colorMap = {
    'Api': '#FF6B6B', 'Air': '#4ECDC4', 'Tanah': '#C7B198',
    'Kayu': '#96C93D', 'Logam': '#9B59B6', 'Udara': '#BDC3C7'
  };
  
  const packageIcons = { 'silver': '🥈', 'gold': '🥇', 'platinum': '💎' };
  const packageNames = { 'silver': 'SILVER', 'gold': 'GOLD', 'platinum': 'PLATINUM' };
  
  let html = `
    <div style="margin-top: 32px;">
      <h4 style="text-align: center; color: #D4AF37; margin-bottom: 8px;">
        <i class="fas fa-list"></i> Opsi Nama Selaras - Paket ${packageIcons[packageType] || ''} ${packageNames[packageType] || packageType.toUpperCase()}
      </h4>
      <p style="text-align: center; color: #64C864; font-size: 0.85rem; margin-bottom: 20px;">
        <i class="fas fa-gift"></i> GRATIS! Pilih salah satu nama untuk melihat perbandingan.
      </p>`;
  
  generatedNames.forEach((name, index) => {
    const elementColor = colorMap[name.element] || '#D4AF37';
    const safeName = name.text.replace(/'/g, "\\'");
    
    html += `
      <div class="name-option-card" style="
        background: rgba(15,15,20,0.9);
        border: 2px solid rgba(212,175,55,0.3);
        border-left: 5px solid ${elementColor};
        border-radius: 16px;
        padding: 24px;
        margin-bottom: 16px;
        transition: all 0.3s;
        cursor: pointer;
      " onmouseover="this.style.borderColor='#D4AF37'; this.style.transform='translateX(4px)'" 
         onmouseout="this.style.borderColor='rgba(212,175,55,0.3)'; this.style.transform='translateX(0)'"
         onclick="window.activateAndCompare('${safeName}', ${name.strength}, '${packageType}', '${name.element}', ${name.hanacaraka_value})">
        
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
          <div style="flex: 1; min-width: 200px;">
            <h5 style="margin: 0 0 10px 0; font-size: 1.4rem; color: #F3E5AB; font-family: 'Cormorant Garamond', serif; letter-spacing: 0.5px;">
              ${name.text}
            </h5>
            <div style="display: flex; flex-wrap: wrap; gap: 8px;">
              <span style="background: rgba(100,200,100,0.2); color: #64C864; padding: 4px 12px; border-radius: 12px; font-size: 0.85rem; font-weight: 600;">
                <i class="fas fa-star"></i> ${name.strength}% ${name.label}
              </span>
              <span style="background: rgba(212,175,55,0.2); color: ${elementColor}; padding: 4px 12px; border-radius: 12px; font-size: 0.85rem; font-weight: 500;">
                <i class="fas fa-fire"></i> ${name.element}
              </span>
              <span style="background: rgba(160,160,176,0.15); color: #A0A0B0; padding: 4px 12px; border-radius: 12px; font-size: 0.85rem;">
                <i class="fas fa-hashtag"></i> Nilai: ${name.hanacaraka_value}
              </span>
            </div>
          </div>
          <div style="text-align: center;">
            <div style="
              background: linear-gradient(135deg, #64C864, #4CAF50);
              border: none;
              color: #FFFFFF;
              padding: 12px 24px;
              border-radius: 25px;
              font-weight: 700;
              font-size: 0.9rem;
              box-shadow: 0 4px 15px rgba(100,200,100,0.3);
              pointer-events: none;
            ">
              <i class="fas fa-balance-scale"></i> BANDINGKAN
            </div>
          </div>
        </div>
      </div>`;
  });
  
  html += `
    <div style="text-align: center; margin-top: 20px; padding: 16px; background: rgba(100,200,100,0.08); border-radius: 12px; border: 1px solid rgba(100,200,100,0.2);">
      <p style="color: #64C864; font-size: 0.9rem; margin: 0;">
        <i class="fas fa-info-circle"></i> Klik salah satu nama di atas untuk <strong>membandingkan</strong> dengan nama asli Anda.
      </p>
    </div>`;
  
  html += `</div>`;
  container.innerHTML = html;
  
  setTimeout(() => {
    container.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 100);
}

// ========== FUNGSI UTAMA: loadNameOptions (GRATIS - TANPA TOKEN) ==========
async function loadNameOptions(packageType) {
  console.log('🔵 loadNameOptions GRATIS dipanggil:', packageType);
  
  if (!['silver', 'gold', 'platinum'].includes(packageType)) {
    showErrorToast('Paket tidak valid.');
    return;
  }
  
  const pkg = PACKAGE_CONFIG[packageType];
  
  // GRATIS - langsung proses tanpa cek token
  if (typeof showLoading === 'function') showLoading(true);
  
  try {
    const data = await loadPositiveSyllables();
    if (!data || !data.syllables) throw new Error('Data syllables tidak tersedia');
    
    const fullName = document.getElementById('fullName')?.value?.trim() || 'Bintang';
    const baseName = fullName.split(' ')[0];
    const wetonNeptu = window.currentUserData?.weton?.neptu || 10;
    
    const names = generateNames(pkg.targetMin, pkg.targetMax, pkg.optionsCount, baseName, data.syllables, wetonNeptu);
    
    if (names.length === 0) {
      showErrorToast('Tidak dapat menghasilkan nama untuk target ini. Coba paket lain.');
      return;
    }
    
    renderNameOptions(names, packageType);
    
    if (typeof showSuccessToast === 'function') {
      showSuccessToast(`✅ ${names.length} opsi nama GRATIS dari Paket ${pkg.name} siap! Klik untuk membandingkan.`);
    }
  } catch(e) {
    console.error('❌ Error:', e);
    showErrorToast('Gagal: ' + e.message);
  } finally {
    if (typeof showLoading === 'function') showLoading(false);
  }
}

// ========== FUNGSI PERBANDINGAN: activateAndCompare ==========
async function activateAndCompare(selectedName, newStrength, packageType, newElement, newHanacaraka) {
  console.log('🔵 activateAndCompare:', selectedName);
  
  const fullNameInput = document.getElementById('fullName');
  const originalName = fullNameInput?.value?.trim() || 'Nama Asli';
  
  // Simpan nama asli untuk perbandingan
  if (!originalManuritasResult && window.currentManuritasResult) {
    originalManuritasResult = window.currentManuritasResult;
  }
  
  // Update input dengan nama baru
  if (fullNameInput) {
    fullNameInput.value = selectedName;
    fullNameInput.style.border = '3px solid #64C864';
    fullNameInput.style.boxShadow = '0 0 20px rgba(100,200,100,0.4)';
    setTimeout(() => {
      fullNameInput.style.border = '';
      fullNameInput.style.boxShadow = '';
    }, 2500);
  }
  
  // Tampilkan modal perbandingan
  showComparisonModal(originalName, selectedName, originalManuritasResult, newStrength, newElement, newHanacaraka, packageType);
}

// ========== MODAL PERBANDINGAN ==========
function showComparisonModal(originalName, newName, originalResult, newStrength, newElement, newHanacaraka, packageType) {
  // Hapus modal lama jika ada
  const oldModal = document.getElementById('comparisonModal');
  if (oldModal) oldModal.remove();
  
  const originalStrength = originalResult?.strength?.score || 0;
  const originalLabel = originalResult?.strength?.label || '-';
  const originalElement = originalResult?.hanacaraka?.dominantElement || '-';
  const originalHanacaraka = originalResult?.hanacaraka?.total || 0;
  const originalTugas = originalResult?.tugasHidup?.name || '-';
  const originalRezeki = originalResult?.jalurRezeki?.name || '-';
  
  const newLabel = newStrength >= 90 ? 'SANGAT KUAT' : newStrength >= 75 ? 'KUAT' : newStrength >= 60 ? 'CUKUP' : 'KURANG';
  
  const improvement = newStrength - originalStrength;
  const improvementText = improvement > 0 ? `+${improvement}%` : improvement === 0 ? '0%' : `${improvement}%`;
  const improvementColor = improvement > 0 ? '#64C864' : improvement < 0 ? '#FF8A8A' : '#D4AF37';
  
  const colorMap = {
    'Api': '#FF6B6B', 'Air': '#4ECDC4', 'Tanah': '#C7B198',
    'Kayu': '#96C93D', 'Logam': '#9B59B6', 'Udara': '#BDC3C7'
  };
  
  // Buat overlay
  const overlay = document.createElement('div');
  overlay.id = 'comparisonModal';
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.9);
    z-index: 99999;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    overflow-y: auto;
  `;
  
  // Buat modal
  const modal = document.createElement('div');
  modal.style.cssText = `
    background: linear-gradient(180deg, #1A1A2E, #0A0A0C);
    border: 2px solid #D4AF37;
    border-radius: 24px;
    padding: 32px;
    max-width: 700px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 20px 60px rgba(0,0,0,0.8);
  `;
  
  modal.innerHTML = `
    <div style="text-align: center; margin-bottom: 24px;">
      <h2 style="color:#F3E5AB; margin-bottom: 4px;">
        <i class="fas fa-balance-scale"></i> Perbandingan Nama
      </h2>
      <p style="color:#A0A0B0; font-size:0.9rem;">Paket ${packageType.toUpperCase()} • GRATIS</p>
    </div>
    
    <!-- TABEL PERBANDINGAN -->
    <div style="display:grid; grid-template-columns:1fr auto 1fr; gap:0; margin-bottom: 24px; background:rgba(15,15,20,0.6); border-radius:16px; overflow:hidden; border:1px solid rgba(212,175,55,0.2);">
      
      <!-- HEADER -->
      <div style="padding:16px;text-align:center;background:rgba(212,175,55,0.1);">
        <p style="color:#F3E5AB;font-weight:700;margin:0;">📜 NAMA ASLI</p>
        <p style="color:#D4AF37;font-size:1.1rem;margin:4px 0 0 0;">${originalName}</p>
      </div>
      <div style="padding:16px;text-align:center;background:rgba(100,200,100,0.1);display:flex;align-items:center;justify-content:center;">
        <p style="color:#64C864;font-weight:700;margin:0;font-size:1.5rem;">VS</p>
      </div>
      <div style="padding:16px;text-align:center;background:rgba(100,200,100,0.1);">
        <p style="color:#64C864;font-weight:700;margin:0;">✨ NAMA BARU</p>
        <p style="color:#64C864;font-size:1.1rem;margin:4px 0 0 0;">${newName}</p>
      </div>
      
      <!-- KEKUATAN -->
      <div style="padding:12px 16px;border-top:1px solid rgba(212,175,55,0.1);text-align:center;">
        <p style="color:#A0A0B0;font-size:0.8rem;margin:0;">Kekuatan</p>
        <p style="color:#D4AF37;font-weight:700;font-size:1.3rem;margin:4px 0 0 0;">${originalStrength}%</p>
        <p style="color:#A0A0B0;font-size:0.75rem;margin:0;">${originalLabel}</p>
      </div>
      <div style="padding:12px 16px;border-top:1px solid rgba(212,175,55,0.1);text-align:center;display:flex;align-items:center;justify-content:center;">
        <p style="color:${improvementColor};font-weight:700;font-size:1.5rem;margin:0;">${improvementText}</p>
      </div>
      <div style="padding:12px 16px;border-top:1px solid rgba(212,175,55,0.1);text-align:center;">
        <p style="color:#A0A0B0;font-size:0.8rem;margin:0;">Kekuatan</p>
        <p style="color:#64C864;font-weight:700;font-size:1.3rem;margin:4px 0 0 0;">${newStrength}%</p>
        <p style="color:#64C864;font-size:0.75rem;margin:0;">${newLabel}</p>
      </div>
      
      <!-- ELEMEN -->
      <div style="padding:12px 16px;border-top:1px solid rgba(212,175,55,0.1);text-align:center;">
        <p style="color:#A0A0B0;font-size:0.8rem;margin:0;">Elemen</p>
        <p style="color:${colorMap[originalElement] || '#D4AF37'};font-weight:600;margin:4px 0 0 0;">${originalElement}</p>
      </div>
      <div style="padding:12px 16px;border-top:1px solid rgba(212,175,55,0.1);"></div>
      <div style="padding:12px 16px;border-top:1px solid rgba(212,175,55,0.1);text-align:center;">
        <p style="color:#A0A0B0;font-size:0.8rem;margin:0;">Elemen</p>
        <p style="color:${colorMap[newElement] || '#64C864'};font-weight:600;margin:4px 0 0 0;">${newElement}</p>
      </div>
      
      <!-- NILAI HANACARAKA -->
      <div style="padding:12px 16px;border-top:1px solid rgba(212,175,55,0.1);text-align:center;">
        <p style="color:#A0A0B0;font-size:0.8rem;margin:0;">Nilai Hanacaraka</p>
        <p style="color:#F3E5AB;font-weight:600;margin:4px 0 0 0;">${originalHanacaraka}</p>
      </div>
      <div style="padding:12px 16px;border-top:1px solid rgba(212,175,55,0.1);"></div>
      <div style="padding:12px 16px;border-top:1px solid rgba(212,175,55,0.1);text-align:center;">
        <p style="color:#A0A0B0;font-size:0.8rem;margin:0;">Nilai Hanacaraka</p>
        <p style="color:#F3E5AB;font-weight:600;margin:4px 0 0 0;">${newHanacaraka}</p>
      </div>
      
      <!-- TUGAS HIDUP -->
      <div style="padding:12px 16px;border-top:1px solid rgba(212,175,55,0.1);text-align:center;">
        <p style="color:#A0A0B0;font-size:0.8rem;margin:0;">Tugas Hidup</p>
        <p style="color:#F3E5AB;font-size:0.85rem;margin:4px 0 0 0;">${originalTugas}</p>
      </div>
      <div style="padding:12px 16px;border-top:1px solid rgba(212,175,55,0.1);"></div>
      <div style="padding:12px 16px;border-top:1px solid rgba(212,175,55,0.1);text-align:center;">
        <p style="color:#A0A0B0;font-size:0.8rem;margin:0;">Jalur Rezeki</p>
        <p style="color:#F3E5AB;font-size:0.85rem;margin:4px 0 0 0;">${originalRezeki}</p>
      </div>
    </div>
    
    <!-- REKOMENDASI -->
    <div style="background:rgba(100,200,100,0.08);border-radius:12px;padding:16px;margin-bottom:20px;border:1px solid rgba(100,200,100,0.2);">
      <p style="color:#64C864;margin-bottom:8px;"><i class="fas fa-star"></i> <strong>Rekomendasi:</strong></p>
      <p style="color:#B0B0C0;font-size:0.9rem;margin:0;">
        ${improvement > 10 ? '✨ Nama baru memberikan peningkatan signifikan! Sangat direkomendasikan untuk digunakan.' : 
          improvement > 0 ? '👍 Nama baru memberikan peningkatan yang baik. Layak dipertimbangkan.' : 
          'Kedua nama memiliki kekuatan yang seimbang. Pilih yang paling nyaman di hati.'}
      </p>
    </div>
    
    <!-- TOMBOL -->
    <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
      <button id="keepNewNameBtn" style="
        background: linear-gradient(135deg, #64C864, #4CAF50);
        border: none;
        color: #FFFFFF;
        padding: 14px 28px;
        border-radius: 30px;
        font-weight: 700;
        cursor: pointer;
        font-size: 1rem;
        transition: all 0.3s;
        box-shadow: 0 4px 15px rgba(100,200,100,0.3);
      ">
        <i class="fas fa-check-circle"></i> GUNAKAN NAMA BARU & LIHAT HASIL
      </button>
      <button id="keepOriginalBtn" style="
        background: transparent;
        border: 2px solid #D4AF37;
        color: #D4AF37;
        padding: 14px 28px;
        border-radius: 30px;
        font-weight: 600;
        cursor: pointer;
        font-size: 1rem;
        transition: all 0.3s;
      ">
        <i class="fas fa-undo"></i> Tetap Nama Asli
      </button>
    </div>
    
    <p style="text-align:center;margin-top:16px;font-size:0.8rem;color:#606070;">
      <i class="fas fa-heart"></i> Suka fitur ini? <a href="dukung.html" style="color:#D4AF37;">Dukung kami</a> untuk fitur lebih banyak!
    </p>
  `;
  
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  
  // Event listeners
  document.getElementById('keepNewNameBtn').onclick = () => {
    document.body.removeChild(overlay);
    
    // Trigger analisis ulang dengan nama baru
    const analyzeBtn = document.getElementById('analyzeBtn');
    if (analyzeBtn) {
      analyzeBtn.click();
      setTimeout(() => {
        if (typeof showSuccessToast === 'function') {
          showSuccessToast('✅ Nama baru diaktifkan! Hasil analisis sudah diperbarui.');
        }
      }, 1000);
    }
  };
  
  document.getElementById('keepOriginalBtn').onclick = () => {
    // Kembalikan nama asli
    if (fullNameInput) {
      fullNameInput.value = originalName;
    }
    document.body.removeChild(overlay);
    if (typeof showSuccessToast === 'function') {
      showSuccessToast('↩️ Nama asli dipertahankan.');
    }
  };
  
  // Close on overlay click
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      if (fullNameInput) fullNameInput.value = originalName;
      document.body.removeChild(overlay);
    }
  });
}

// ========== FUNGSI updateGeneratorPackages ==========
function updateGeneratorPackages(originalStrength) {
  const silverPackage = document.getElementById('packageSilver') || document.querySelector('.package-silver');
  const goldPackage = document.querySelector('.package-gold');
  const platinumPackage = document.querySelector('.package-platinum');
  const container = document.getElementById('nameOptionsContainer');
  
  const show = (el) => { if (el) { el.classList.remove('hidden'); el.style.display = 'flex'; } };
  const hide = (el) => { if (el) { el.classList.add('hidden'); el.style.display = 'none'; } };
  
  const strengthDisplay = document.getElementById('currentStrengthDisplay');
  if (strengthDisplay) {
    const label = originalStrength >= 90 ? 'SANGAT KUAT' : originalStrength >= 75 ? 'KUAT' : originalStrength >= 60 ? 'CUKUP' : originalStrength >= 40 ? 'KURANG' : 'LEMAH';
    strengthDisplay.textContent = `${originalStrength}% (${label})`;
  }
  
  if (originalStrength >= 90) {
    hide(silverPackage); hide(goldPackage); hide(platinumPackage);
    if (container) container.innerHTML = `
      <div style="background:rgba(100,200,100,0.08);border-radius:16px;padding:24px;text-align:center;border:2px solid #64C864;margin-top:20px;">
        <p style="color:#64C864;font-size:2rem;">🏆</p>
        <p style="color:#64C864;font-weight:700;font-size:1.1rem;">Nama Anda SANGAT KUAT!</p>
        <p style="color:#A0A0B0;margin-top:8px;">Nama Anda sudah optimal. Tidak perlu generator.</p>
      </div>`;
  } else if (originalStrength >= 75) {
    hide(silverPackage); hide(goldPackage); show(platinumPackage);
    if (container) container.innerHTML = `
      <div style="text-align:center;padding:16px;color:#A0A0B0;">
        <p>💎 <strong>GRATIS!</strong> Pilih Platinum untuk mencapai SANGAT KUAT (90-100%)</p>
      </div>`;
  } else if (originalStrength >= 60) {
    hide(silverPackage); show(goldPackage); show(platinumPackage);
    if (container) container.innerHTML = `
      <div style="text-align:center;padding:16px;color:#A0A0B0;">
        <p>🥇💎 <strong>GRATIS!</strong> Pilih Gold atau Platinum untuk peningkatan</p>
      </div>`;
  } else {
    show(silverPackage); show(goldPackage); show(platinumPackage);
    if (container) container.innerHTML = `
      <div style="text-align:center;padding:16px;color:#A0A0B0;">
        <p>🥈🥇💎 <strong>GRATIS!</strong> Pilih paket untuk tingkatkan nama</p>
      </div>`;
  }
}

// ========== FALLBACK: activateName ==========
function activateName(name) {
  const fullNameInput = document.getElementById('fullName');
  if (!fullNameInput) return;
  
  fullNameInput.value = name;
  fullNameInput.style.border = '2px solid #64C864';
  setTimeout(() => { fullNameInput.style.border = ''; }, 2000);
  
  if (typeof showSuccessToast === 'function') {
    showSuccessToast(`✅ Nama "${name}" diaktifkan!`);
  }
}

// ========== HELPER TOAST ==========
function showErrorToast(msg) {
  if (typeof window.showErrorToast === 'function') window.showErrorToast(msg);
  else alert('❌ ' + msg);
}

// ========== EXPOSE GLOBAL ==========
window.loadNameOptions = loadNameOptions;
window.updateGeneratorPackages = updateGeneratorPackages;
window.activateAndCompare = activateAndCompare;
window.activateName = activateName;
window.loadPositiveSyllables = loadPositiveSyllables;
window.PACKAGE_CONFIG = PACKAGE_CONFIG;
window.generateNames = generateNames;
window.renderNameOptions = renderNameOptions;
window.showComparisonModal = showComparisonModal;

// ========== PRE-LOAD ==========
document.addEventListener('DOMContentLoaded', async () => {
  console.log('🔵 manuritas-generator.js v4.0 GRATIS');
  try {
    await loadPositiveSyllables();
    console.log('✅ Syllables ready');
  } catch(e) {
    console.warn('⚠️ Pre-load failed:', e);
  }
});

console.log('✅ manuritas-generator.js v4.0 GRATIS loaded - Generator GRATIS + Perbandingan');
