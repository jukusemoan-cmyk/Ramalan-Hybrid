/**
 * MANURITAS GENERATOR - Generator Nama Selaras v3.1 FINAL
 * Menggunakan positive-syllables.json (308 entri) sebagai sumber data
 * Memanfaatkan fungsi dari manuritas.js (hanacarakaValue, getElementFromHanacaraka, dll)
 * 
 * DEPENDENCIES: manuritas.js (harus di-load sebelum file ini)
 */

'use strict';

// ========== KONSTANTA PAKET ==========
const PACKAGE_CONFIG = {
  silver: {
    name: 'SILVER',
    icon: '🥈',
    tokenCost: 50,
    targetMin: 60,
    targetMax: 74,
    description: 'Target 60-74%',
    optionsCount: 3
  },
  gold: {
    name: 'GOLD',
    icon: '🥇',
    tokenCost: 100,
    targetMin: 75,
    targetMax: 89,
    description: 'Target 75-89%',
    optionsCount: 3
  },
  platinum: {
    name: 'PLATINUM',
    icon: '💎',
    tokenCost: 150,
    targetMin: 90,
    targetMax: 100,
    description: 'Target 90-100%',
    optionsCount: 3
  }
};

// ========== STATE ==========
let positiveSyllablesData = null;

// ========== ALIAS FUNGSI DARI manuritas.js ==========
// Fungsi-fungsi ini sudah ada di manuritas.js, kita bungkus ulang untuk kemudahan
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

// ========== MENENTUKAN ELEMEN DOMINAN DARI NAMA (pakai syllables) ==========
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

// ========== MENGHITUNG KEKUATAN NAMA (versi generator) ==========
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

// ========== GENERATE NAMA BARU ==========
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
      <h4 style="text-align: center; color: #D4AF37; margin-bottom: 20px;">
        <i class="fas fa-list"></i> Opsi Nama Selaras - Paket ${packageIcons[packageType] || ''} ${packageNames[packageType] || packageType.toUpperCase()}
      </h4>`;
  
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
      " onmouseover="this.style.borderColor='#D4AF37'; this.style.transform='translateX(4px)'" 
         onmouseout="this.style.borderColor='rgba(212,175,55,0.3)'; this.style.transform='translateX(0)'">
        
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
          <button 
            onclick="window.activateSelectedName('${safeName}', ${name.strength}, '${packageType}')"
            style="
              background: linear-gradient(135deg, #64C864, #4CAF50);
              border: none;
              color: #FFFFFF;
              padding: 12px 24px;
              border-radius: 25px;
              font-weight: 700;
              cursor: pointer;
              white-space: nowrap;
              transition: all 0.3s;
              font-size: 0.9rem;
              box-shadow: 0 4px 15px rgba(100,200,100,0.3);
            "
            onmouseover="this.style.transform='scale(1.05)'; this.style.boxShadow='0 6px 20px rgba(100,200,100,0.5)'"
            onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 4px 15px rgba(100,200,100,0.3)'"
          >
            <i class="fas fa-check-circle"></i> AKTIFKAN
          </button>
        </div>
      </div>`;
  });
  
  html += `
    <div style="text-align: center; margin-top: 20px; padding: 16px; background: rgba(100,200,100,0.08); border-radius: 12px; border: 1px solid rgba(100,200,100,0.2);">
      <p style="color: #64C864; font-size: 0.9rem; margin-bottom: 4px;">
        <i class="fas fa-info-circle"></i> Klik <strong>"AKTIFKAN"</strong> untuk memilih nama baru.
      </p>
      <p style="color: #A0A0B0; font-size: 0.85rem; margin: 0;">
        Lalu klik <strong>"ANALISIS NAMA"</strong> untuk melihat hasil selengkapnya.
      </p>
    </div>`;
  
  html += `</div>`;
  container.innerHTML = html;
  
  setTimeout(() => {
    container.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 100);
}

// ========== FUNGSI UTAMA: loadNameOptions ==========
async function loadNameOptions(packageType) {
  console.log('🔵 loadNameOptions dipanggil:', packageType);
  
  if (!['silver', 'gold', 'platinum'].includes(packageType)) {
    showErrorToast('Paket tidak valid.');
    return;
  }
  
  const pkg = PACKAGE_CONFIG[packageType];
  const tokenBalance = parseInt(localStorage.getItem('tokenBalance') || '0');
  
  if (tokenBalance < pkg.tokenCost) {
    showInsufficientTokenModal(pkg.tokenCost, tokenBalance);
    return;
  }
  
  const confirmed = await showConfirmDialog(
    'Konfirmasi Pembelian',
    `Anda akan menggunakan <strong>${pkg.tokenCost} Token</strong> untuk ${pkg.optionsCount} opsi nama dari Paket ${pkg.icon} ${pkg.name}.<br><br>Target: ${pkg.targetMin}-${pkg.targetMax}%<br>Sisa Token: ${tokenBalance}`
  );
  
  if (!confirmed) return;
  
  const newBalance = tokenBalance - pkg.tokenCost;
  localStorage.setItem('tokenBalance', newBalance);
  if (typeof updateTokenDisplay === 'function') updateTokenDisplay();
  if (typeof showLoading === 'function') showLoading(true);
  
  try {
    const data = await loadPositiveSyllables();
    if (!data || !data.syllables) throw new Error('Data syllables tidak tersedia');
    
    const fullName = document.getElementById('fullName')?.value?.trim() || 'Bintang';
    const baseName = fullName.split(' ')[0];
    const wetonNeptu = window.currentUserData?.weton?.neptu || 10;
    
    const names = generateNames(pkg.targetMin, pkg.targetMax, pkg.optionsCount, baseName, data.syllables, wetonNeptu);
    
    if (names.length === 0) {
      localStorage.setItem('tokenBalance', tokenBalance);
      if (typeof updateTokenDisplay === 'function') updateTokenDisplay();
      showErrorToast('Tidak dapat menghasilkan nama. Token dikembalikan.');
      return;
    }
    
    renderNameOptions(names, packageType);
    if (typeof showSuccessToast === 'function') {
      showSuccessToast(`✅ ${names.length} opsi nama dari Paket ${pkg.name} siap!`);
    }
  } catch(e) {
    console.error('❌ Error:', e);
    localStorage.setItem('tokenBalance', tokenBalance);
    if (typeof updateTokenDisplay === 'function') updateTokenDisplay();
    showErrorToast('Gagal: ' + e.message);
  } finally {
    if (typeof showLoading === 'function') showLoading(false);
  }
}

// ========== MODAL KONFIRMASI ==========
function showConfirmDialog(title, message) {
  return new Promise((resolve) => {
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);z-index:99999;display:flex;align-items:center;justify-content:center;';
    
    const modal = document.createElement('div');
    modal.style.cssText = 'background:#1A1A2E;border:2px solid #D4AF37;border-radius:20px;padding:32px;max-width:450px;width:90%;text-align:center;';
    modal.innerHTML = `
      <h3 style="color:#D4AF37;margin-bottom:16px;"><i class="fas fa-coins"></i> ${title}</h3>
      <p style="color:#B0B0C0;margin-bottom:24px;line-height:1.6;">${message}</p>
      <div style="display:flex;gap:12px;justify-content:center;">
        <button id="modalCancel" style="background:transparent;border:1px solid #666;color:#A0A0B0;padding:10px 24px;border-radius:25px;cursor:pointer;">Batal</button>
        <button id="modalOk" style="background:linear-gradient(135deg,#D4AF37,#F3E5AB);border:none;color:#0A0A0C;padding:10px 24px;border-radius:25px;font-weight:700;cursor:pointer;">Lanjutkan</button>
      </div>`;
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    document.getElementById('modalOk').onclick = () => { document.body.removeChild(overlay); resolve(true); };
    document.getElementById('modalCancel').onclick = () => { document.body.removeChild(overlay); resolve(false); };
    overlay.addEventListener('click', (e) => { if (e.target === overlay) { document.body.removeChild(overlay); resolve(false); } });
  });
}

// ========== MODAL TOKEN TIDAK CUKUP ==========
function showInsufficientTokenModal(required, current) {
  const overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);z-index:99999;display:flex;align-items:center;justify-content:center;';
  
  const modal = document.createElement('div');
  modal.style.cssText = 'background:#1A1A2E;border:2px solid #FF8A8A;border-radius:20px;padding:32px;max-width:450px;width:90%;text-align:center;';
  modal.innerHTML = `
    <p style="font-size:3rem;margin-bottom:12px;">😔</p>
    <h3 style="color:#FF8A8A;margin-bottom:16px;">Token Tidak Cukup</h3>
    <p style="color:#B0B0C0;margin-bottom:8px;">Dibutuhkan: <strong style="color:#D4AF37;">${required} Token</strong></p>
    <p style="color:#B0B0C0;margin-bottom:24px;">Sisa: <strong>${current} Token</strong></p>
    <div style="display:flex;gap:12px;justify-content:center;">
      <button id="insufCancel" style="background:transparent;border:1px solid #666;color:#A0A0B0;padding:10px 24px;border-radius:25px;cursor:pointer;">Nanti</button>
      <button id="insufDukung" style="background:linear-gradient(135deg,#FF6B6B,#FFB8B8);border:none;color:#0A0A0C;padding:10px 24px;border-radius:25px;font-weight:700;cursor:pointer;"><i class="fas fa-heart"></i> Ke Dukung</button>
    </div>`;
  
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  
  document.getElementById('insufCancel').onclick = () => document.body.removeChild(overlay);
  document.getElementById('insufDukung').onclick = () => { window.location.href = 'dukung.html'; };
  overlay.addEventListener('click', (e) => { if (e.target === overlay) document.body.removeChild(overlay); });
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
    if (container) container.innerHTML = `<div style="background:rgba(100,200,100,0.08);border-radius:16px;padding:24px;text-align:center;border:2px solid #64C864;margin-top:20px;"><p style="color:#64C864;font-size:1.5rem;">🏆</p><p style="color:#64C864;font-weight:700;">Nama Anda SANGAT KUAT!</p><p style="color:#A0A0B0;">Tidak perlu generator. Nama sudah optimal.</p></div>`;
  } else if (originalStrength >= 75) {
    hide(silverPackage); hide(goldPackage); show(platinumPackage);
    if (container) container.innerHTML = `<div style="text-align:center;padding:16px;color:#A0A0B0;"><p>💎 Pilih Platinum untuk SANGAT KUAT (90-100%)</p></div>`;
  } else if (originalStrength >= 60) {
    hide(silverPackage); show(goldPackage); show(platinumPackage);
    if (container) container.innerHTML = `<div style="text-align:center;padding:16px;color:#A0A0B0;"><p>🥇💎 Pilih Gold atau Platinum</p></div>`;
  } else {
    show(silverPackage); show(goldPackage); show(platinumPackage);
    if (container) container.innerHTML = `<div style="text-align:center;padding:16px;color:#A0A0B0;"><p>🥈🥇💎 Pilih paket untuk tingkatkan nama</p></div>`;
  }
}

// ========== FUNGSI AKTIVASI NAMA ==========
function activateSelectedName(selectedName, strength, packageType) {
  const fullNameInput = document.getElementById('fullName');
  if (!fullNameInput) return;
  
  fullNameInput.value = selectedName;
  localStorage.setItem('activatedName', selectedName);
  localStorage.setItem('activatedNameStrength', strength);
  localStorage.setItem('activatedNamePackage', packageType);
  
  fullNameInput.style.border = '3px solid #64C864';
  fullNameInput.style.boxShadow = '0 0 20px rgba(100,200,100,0.4)';
  fullNameInput.style.transition = 'all 0.3s';
  
  setTimeout(() => {
    fullNameInput.style.border = '';
    fullNameInput.style.boxShadow = '';
  }, 2500);
  
  if (typeof showSuccessToast === 'function') {
    showSuccessToast(`✅ "${selectedName}" diaktifkan! Klik "ANALISIS NAMA" untuk hasil baru.`);
  } else if (typeof window.showSuccessToast === 'function') {
    window.showSuccessToast(`✅ "${selectedName}" diaktifkan!`);
  }
  
  const analyzeBtn = document.getElementById('analyzeBtn') || document.getElementById('revealBtn');
  if (analyzeBtn) {
    setTimeout(() => analyzeBtn.scrollIntoView({ behavior: 'smooth', block: 'center' }), 400);
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
  
  const btn = document.getElementById('analyzeBtn') || document.getElementById('revealBtn');
  if (btn) setTimeout(() => btn.scrollIntoView({ behavior: 'smooth' }), 300);
}

// ========== HELPER TOAST ==========
function showErrorToast(msg) {
  if (typeof window.showErrorToast === 'function') window.showErrorToast(msg);
  else alert('❌ ' + msg);
}

// ========== EXPOSE GLOBAL ==========
window.loadNameOptions = loadNameOptions;
window.updateGeneratorPackages = updateGeneratorPackages;
window.activateSelectedName = activateSelectedName;
window.activateName = activateName;
window.loadPositiveSyllables = loadPositiveSyllables;
window.PACKAGE_CONFIG = PACKAGE_CONFIG;
window.generateNames = generateNames;
window.renderNameOptions = renderNameOptions;

// ========== PRE-LOAD ==========
document.addEventListener('DOMContentLoaded', async () => {
  console.log('🔵 manuritas-generator.js v3.1 FINAL');
  try {
    await loadPositiveSyllables();
    console.log('✅ Syllables ready');
  } catch(e) {
    console.warn('⚠️ Pre-load failed:', e);
  }
});

console.log('✅ manuritas-generator.js v3.1 FINAL loaded');