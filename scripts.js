/**
 * AGENCY CREATIVE & DIGITAL SOLUTIONS
 * Interactive Engine & Space Theme Controls
 */

document.addEventListener('DOMContentLoaded', () => {
  initStarsCanvas();
  initNavbar();
  initServiceFilter();
  initPricingCalculator();
  initOnboardingWizard();
  initSopAccordion();
});

/* ==========================================================================
   1. DYNAMIC COSMIC STARS CANVAS
   ========================================================================== */
function initStarsCanvas() {
  const canvas = document.getElementById('starsCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const starsCount = Math.floor((width * height) / 3800);
  const stars = [];

  for (let i = 0; i < starsCount; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.4 + 0.3,
      alpha: Math.random() * 0.8 + 0.2,
      speed: Math.random() * 0.015 + 0.005,
      direction: Math.random() > 0.5 ? 1 : -1,
    });
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    stars.forEach((star) => {
      star.alpha += star.speed * star.direction;
      if (star.alpha > 0.95 || star.alpha < 0.15) {
        star.direction *= -1;
      }

      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
      ctx.shadowBlur = star.radius > 1 ? 6 : 0;
      ctx.shadowColor = '#8b5cf6';
      ctx.fill();
    });

    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   2. NAVBAR & NAVIGATION
   ========================================================================== */
function initNavbar() {
  const header = document.querySelector('.site-header');
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');
  const links = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }

    // Scrollspy
    const sections = document.querySelectorAll('section[id]');
    let current = '';
    sections.forEach((sec) => {
      const top = sec.offsetTop - 120;
      if (window.scrollY >= top) {
        current = sec.getAttribute('id');
      }
    });

    links.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('show');
    });

    links.forEach((l) => {
      l.addEventListener('click', () => navLinks.classList.remove('show'));
    });
  }
}

/* ==========================================================================
   3. SERVICE FILTER TABS
   ========================================================================== */
function initServiceFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.pricing-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      cards.forEach((card) => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.4s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   4. INTERACTIVE PRICING CALCULATOR & SIMULATOR
   ========================================================================== */
const PRICING_DATA = {
  social: {
    orbit: { name: 'Paket Orbit (Starter)', price: 349000, type: 'Retainer / Bln' },
    galaxy: { name: 'Paket Galaxy (Growth)', price: 649000, type: 'Retainer / Bln' },
    supernova: { name: 'Paket Supernova (Enterprise)', price: 1249000, type: 'Retainer / Bln' },
  },
  video: {
    comet: { name: 'Paket Comet (3 Video)', price: 259000, type: 'Project' },
    meteor: { name: 'Paket Meteor (6 Video)', price: 489000, type: 'Project' },
    nebula: { name: 'Paket Nebula (12 Video)', price: 979000, type: 'Project' },
    cosmos: { name: 'Paket Cosmos (Shooting Magelang)', price: 325000, type: 'Per Video (Avg)' },
  },
  web: {
    asteroid: { name: 'Paket Asteroid (Landing Page)', price: 489000, type: 'Per Tahun' },
    pulsar: { name: 'Paket Pulsar (Company Profile)', price: 949000, type: 'Per Tahun' },
    quasar: { name: 'Paket Quasar (E-Commerce/Katalog)', price: 1169000, type: 'Per Tahun' },
  },
  bundling: {
    apollo: { name: 'Paket Apollo "Go Digital" (Web + Medsos)', price: 1999000, type: 'Project Terpadu' },
  },
  addons: {
    express: { name: 'Express Priority Turnaround', price: 150000 },
    story: { name: 'Extra 5 Story Instagram', price: 75000 },
    post: { name: 'Add-on 3 Desain Single Post', price: 105000 },
  },
};

const ADMIN_WA_NUMBER = '6285885171335';
const ADMIN_PHONE_DISPLAY = '0858-8517-1335';

function formatRupiah(num) {
  return 'Rp' + num.toLocaleString('id-ID');
}

function initPricingCalculator() {
  const selectSocial = document.getElementById('calc-social');
  const selectVideo = document.getElementById('calc-video');
  const selectWeb = document.getElementById('calc-web');
  const selectBundling = document.getElementById('calc-bundling');
  const addonCheckboxes = document.querySelectorAll('.calc-addon-check');

  const summaryItems = document.getElementById('summary-items');
  const totalDisplay = document.getElementById('calc-total');
  const dpDisplay = document.getElementById('calc-dp');
  const btnWaOrder = document.getElementById('btn-wa-order');

  if (!selectSocial || !totalDisplay) return;

  function recalculate() {
    let items = [];
    let grandTotal = 0;
    let projectTotal = 0;

    // Social
    const sVal = selectSocial.value;
    if (sVal && PRICING_DATA.social[sVal]) {
      const item = PRICING_DATA.social[sVal];
      items.push(item);
      grandTotal += item.price;
    }

    // Video
    const vVal = selectVideo.value;
    if (vVal && PRICING_DATA.video[vVal]) {
      const item = PRICING_DATA.video[vVal];
      items.push(item);
      grandTotal += item.price;
      projectTotal += item.price;
    }

    // Web
    const wVal = selectWeb.value;
    if (wVal && PRICING_DATA.web[wVal]) {
      const item = PRICING_DATA.web[wVal];
      items.push(item);
      grandTotal += item.price;
      projectTotal += item.price;
    }

    // Bundling
    const bVal = selectBundling.value;
    if (bVal && PRICING_DATA.bundling[bVal]) {
      const item = PRICING_DATA.bundling[bVal];
      items.push(item);
      grandTotal += item.price;
      projectTotal += item.price;
    }

    // Addons
    addonCheckboxes.forEach((chk) => {
      if (chk.checked && PRICING_DATA.addons[chk.value]) {
        const item = PRICING_DATA.addons[chk.value];
        items.push({ name: `[Add-on] ${item.name}`, price: item.price });
        grandTotal += item.price;
      }
    });

    // Render items list
    if (items.length === 0) {
      summaryItems.innerHTML = `<div class="summary-item"><span class="summary-item-name" style="color: #64748b; font-style: italic;">Belum ada paket yang dipilih. Silakan pilih kombinasi di sebelah kiri.</span><span class="summary-item-price">-</span></div>`;
      totalDisplay.textContent = 'Rp0';
      dpDisplay.textContent = 'Rp0';
    } else {
      summaryItems.innerHTML = items
        .map(
          (it) => `
        <div class="summary-item">
          <span class="summary-item-name">${it.name}</span>
          <span class="summary-item-price">${formatRupiah(it.price)}</span>
        </div>
      `
        )
        .join('');

      totalDisplay.textContent = formatRupiah(grandTotal);

      // DP 50% untuk Project-Based
      const dp50 = Math.round(projectTotal * 0.5);
      dpDisplay.textContent = formatRupiah(dp50);
    }

    // Update WA Order Button Link
    if (btnWaOrder) {
      let waMessage = `*🪐 ESTIMASI ORDER & SIMULASI INVESTASI*%0A*Agency Creative & Digital Solutions*%0A━━━━━━━━━━━━━━━━━━━━━%0A`;
      waMessage += `Halo Admin, saya ingin memesan & konsultasi paket layanan digital berikut:%0A%0A`;
      waMessage += `*📦 RINCIAN PAKET TERPILIH:*%0A`;
      if (items.length > 0) {
        items.forEach((it, idx) => {
          waMessage += `${idx + 1}. *${it.name}* — ${formatRupiah(it.price)}%0A`;
        });
        waMessage += `%0A*💰 REKAPITULASI BIAYA:*%0A`;
        waMessage += `• *Total Investasi:* ${formatRupiah(grandTotal)}%0A`;
        waMessage += `• *Simulasi DP 50% (Project-Based):* ${formatRupiah(Math.round(projectTotal * 0.5))}%0A`;
        waMessage += `━━━━━━━━━━━━━━━━━━━━━%0A`;
        waMessage += `ℹ️ _SOP Pembayaran: Retainer 100% Upfront, Project-Based DP 50% di awal._%0A`;
        waMessage += `Mohon info ketersediaan slot pengerjaan dan invoice resmi. Terima kasih! 🚀`;
      } else {
        waMessage += `_Belum ada paket khusus dipilih._%0A%0ASaya ingin konsultasi mengenai pilihan paket dan layanan digital yang paling sesuai untuk brand saya.`;
      }
      btnWaOrder.href = `https://wa.me/${ADMIN_WA_NUMBER}?text=${waMessage}`;
    }
  }

  [selectSocial, selectVideo, selectWeb, selectBundling].forEach((el) => {
    el.addEventListener('change', recalculate);
  });

  addonCheckboxes.forEach((chk) => {
    chk.addEventListener('change', recalculate);
  });

  // Function to programmatically pick package from cards
  window.selectPackageFromCard = function (category, packageKey) {
    if (category === 'social' && selectSocial) selectSocial.value = packageKey;
    if (category === 'video' && selectVideo) selectVideo.value = packageKey;
    if (category === 'web' && selectWeb) selectWeb.value = packageKey;
    if (category === 'bundling' && selectBundling) selectBundling.value = packageKey;

    recalculate();

    const calcSection = document.getElementById('kalkulator');
    if (calcSection) {
      calcSection.scrollIntoView({ behavior: 'smooth' });
      showToast(`Paket ${packageKey.toUpperCase()} dimasukkan ke kalkulator! ✨`);
    }
  };

  recalculate();
}

/* ==========================================================================
   5. MULTI-STEP CLIENT ONBOARDING WIZARD (SECTION II OF PROFILE.DOCX)
   ========================================================================== */
function initOnboardingWizard() {
  let currentStep = 1;
  const totalSteps = 4;

  const stepIndicators = document.querySelectorAll('.step-indicator');
  const stepContents = document.querySelectorAll('.wizard-step-content');
  const btnPrev = document.getElementById('wizard-prev');
  const btnNext = document.getElementById('wizard-next');
  const btnWaSubmit = document.getElementById('wizard-submit-wa');
  const btnDownloadTxt = document.getElementById('wizard-download-txt');

  if (!btnNext) return;

  // Tone picker logic
  const tonePills = document.querySelectorAll('.tone-pill');
  tonePills.forEach((pill) => {
    pill.addEventListener('click', () => {
      tonePills.forEach((p) => p.classList.remove('selected'));
      pill.classList.add('selected');
      const radio = pill.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;
    });
  });

  function updateWizardUI() {
    // Step indicators
    stepIndicators.forEach((ind, idx) => {
      const stepNum = idx + 1;
      ind.classList.remove('active', 'completed');
      if (stepNum === currentStep) {
        ind.classList.add('active');
      } else if (stepNum < currentStep) {
        ind.classList.add('completed');
      }
    });

    // Step contents
    stepContents.forEach((cnt, idx) => {
      if (idx + 1 === currentStep) {
        cnt.classList.add('active');
      } else {
        cnt.classList.remove('active');
      }
    });

    // Buttons visibility
    if (btnPrev) {
      btnPrev.style.visibility = currentStep === 1 ? 'hidden' : 'visible';
    }

    if (currentStep === totalSteps) {
      btnNext.style.display = 'none';
      if (btnWaSubmit) btnWaSubmit.style.display = 'inline-flex';
      if (btnDownloadTxt) btnDownloadTxt.style.display = 'inline-flex';
      renderReviewSummary();
    } else {
      btnNext.style.display = 'inline-flex';
      if (btnWaSubmit) btnWaSubmit.style.display = 'none';
      if (btnDownloadTxt) btnDownloadTxt.style.display = 'none';
    }
  }

  btnNext.addEventListener('click', () => {
    if (validateCurrentStep(currentStep)) {
      if (currentStep < totalSteps) {
        currentStep++;
        updateWizardUI();
      }
    }
  });

  if (btnPrev) {
    btnPrev.addEventListener('click', () => {
      if (currentStep > 1) {
        currentStep--;
        updateWizardUI();
      }
    });
  }

  function validateCurrentStep(step) {
    if (step === 1) {
      const brandName = document.getElementById('ob-brand-name')?.value.trim();
      if (!brandName) {
        showToast('⚠️ Mohon isi Nama Merek / Usaha terlebih dahulu.');
        document.getElementById('ob-brand-name')?.focus();
        return false;
      }
    }
    return true;
  }

  function collectFormData() {
    const brandName = document.getElementById('ob-brand-name')?.value.trim() || '-';
    const slogan = document.getElementById('ob-slogan')?.value.trim() || '-';
    const desc = document.getElementById('ob-desc')?.value.trim() || '-';
    const audience = document.getElementById('ob-audience')?.value.trim() || '-';

    const logoType = document.getElementById('ob-logo-type')?.value || '-';
    const hexColors = document.getElementById('ob-colors')?.value.trim() || '-';
    const font = document.getElementById('ob-font')?.value.trim() || '-';
    const gdriveLink = document.getElementById('ob-gdrive')?.value.trim() || '-';

    const socialAccount = document.getElementById('ob-social')?.value.trim() || '-';
    const domain = document.getElementById('ob-domain')?.value.trim() || '-';
    const waAdmin = document.getElementById('ob-wa')?.value.trim() || '-';
    const catalogNotes = document.getElementById('ob-catalog')?.value.trim() || '-';

    const visualRef = document.getElementById('ob-ref')?.value.trim() || '-';
    const selectedToneEl = document.querySelector('input[name="tone-voice"]:checked');
    const tone = selectedToneEl ? selectedToneEl.value : 'Santai / Gaul';

    return {
      brandName,
      slogan,
      desc,
      audience,
      logoType,
      hexColors,
      font,
      gdriveLink,
      socialAccount,
      domain,
      waAdmin,
      catalogNotes,
      visualRef,
      tone,
    };
  }

  function buildWhatsAppTemplateText(data) {
    return `*🚀 FORMULIR ONBOARDING KLIEN RESMI*
*Agency Creative & Digital Solutions*
━━━━━━━━━━━━━━━━━━━━━
Halo Admin, saya telah melengkapi data pendaftaran proyek kreatif dengan rincian berikut:

📌 *I. PROFIL & IDENTITAS BISNIS*
• *Nama Merek/Usaha:* ${data.brandName}
• *Slogan / Tagline:* ${data.slogan}
• *Deskripsi Usaha:* ${data.desc}
• *Target Audiens:* ${data.audience}

🎨 *II. ASET VISUAL MEREK*
• *Format Logo:* ${data.logoType}
• *Panduan Warna Hex:* ${data.hexColors}
• *Tipografi / Font:* ${data.font}
• *Link Folder GDrive:* ${data.gdriveLink}

🔐 *III. KREDENSIAL & KEBUTUHAN WEB*
• *Akun Media Sosial:* ${data.socialAccount}
• *Pilihan Domain Web:* ${data.domain}
• *Kontak Admin WA:* ${data.waAdmin}
• *Katalog Produk:* ${data.catalogNotes}

🎙️ *IV. REFERENSI & KOMUNIKASI*
• *Referensi Visual:* ${data.visualRef}
• *Tone of Voice:* ${data.tone}

━━━━━━━━━━━━━━━━━━━━━
🕒 _Disubmit otomatis melalui Portal Onboarding Web Agency._
Mohon verifikasi kelengkapan berkas untuk penjadwalan timeline kerja sesuai SOP 3x24 Jam. Terima kasih! ✨`;
  }

  function renderReviewSummary() {
    const data = collectFormData();
    const container = document.getElementById('ob-review-box');
    if (!container) return;

    const templateText = buildWhatsAppTemplateText(data);
    const now = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

    container.innerHTML = `
      <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 1.5rem; margin-bottom: 1.5rem;">
        <h5 style="color: #67e8f9; margin-bottom: 0.8rem; font-size: 1.05rem; display: flex; align-items: center; gap: 8px;">
          <span>📋</span> Ringkasan Data Client Onboarding
        </h5>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.8rem; font-size: 0.86rem;">
          <div><strong style="color: #94a3b8;">Nama Brand:</strong> <span style="color:#fff;">${data.brandName}</span></div>
          <div><strong style="color: #94a3b8;">Slogan:</strong> <span style="color:#fff;">${data.slogan}</span></div>
          <div><strong style="color: #94a3b8;">Target Audiens:</strong> <span style="color:#fff;">${data.audience}</span></div>
          <div><strong style="color: #94a3b8;">Warna Hex:</strong> <span style="color:#fff;">${data.hexColors}</span></div>
          <div><strong style="color: #94a3b8;">Aset Google Drive:</strong> <span style="color:#fff;">${data.gdriveLink}</span></div>
          <div><strong style="color: #94a3b8;">Domain Request:</strong> <span style="color:#fff;">${data.domain}</span></div>
          <div><strong style="color: #94a3b8;">Admin WA Klien:</strong> <span style="color:#fff;">${data.waAdmin}</span></div>
          <div><strong style="color: #94a3b8;">Tone of Voice:</strong> <span style="color:#fcd34d;">${data.tone}</span></div>
        </div>
      </div>

      <!-- Live WhatsApp Message Mockup Preview Box -->
      <div class="wa-mockup-wrapper">
        <div class="wa-mockup-header">
          <div class="wa-mockup-user">
            <div class="wa-avatar">🪐</div>
            <div class="wa-user-info">
              <span class="wa-user-name">Admin Agency (0858-8517-1335)</span>
              <span class="wa-user-status">Online • Siap Menerima Data Onboarding</span>
            </div>
          </div>
          <button id="btn-copy-wa" type="button" class="btn btn-secondary btn-sm" style="font-size: 0.78rem;">
            📋 Salin Teks
          </button>
        </div>

        <div class="wa-bubble-incoming" id="wa-preview-text">${templateText.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
        <div class="wa-bubble-time">${now} • Terkirim otomatis ke 0858-8517-1335</div>
      </div>
    `;

    // Copy to clipboard listener
    const btnCopy = document.getElementById('btn-copy-wa');
    if (btnCopy) {
      btnCopy.addEventListener('click', () => {
        navigator.clipboard.writeText(templateText).then(() => {
          showToast('Template teks WhatsApp berhasil disalin ke clipboard! 📋');
        }).catch(() => {
          showToast('Gagal menyalin otomatis. Silakan pilih teks secara manual.');
        });
      });
    }
  }

  // WA Submit button
  if (btnWaSubmit) {
    btnWaSubmit.addEventListener('click', () => {
      const data = collectFormData();
      const rawText = buildWhatsAppTemplateText(data);
      const encodedText = encodeURIComponent(rawText);

      window.open(`https://wa.me/${ADMIN_WA_NUMBER}?text=${encodedText}`, '_blank');
      showToast('Formulir Onboarding berhasil dikirim ke WhatsApp Admin (0858-8517-1335)! 🚀');
    });
  }

  // Download TXT
  if (btnDownloadTxt) {
    btnDownloadTxt.addEventListener('click', () => {
      const data = collectFormData();
      const content = `CLIENT ONBOARDING FORM
AGENCY CREATIVE & DIGITAL SOLUTIONS
==========================================

I. PROFIL & IDENTITAS BISNIS
Nama Merek / Usaha : ${data.brandName}
Slogan / Tagline   : ${data.slogan}
Deskripsi Usaha    : ${data.desc}
Target Audiens     : ${data.audience}

II. ASET VISUAL MEREK
Format Logo        : ${data.logoType}
Kode Warna (Hex)   : ${data.hexColors}
Tipografi / Font   : ${data.font}
Link Folder GDrive : ${data.gdriveLink}

III. KREDENSIAL & WEB
Akun Media Sosial  : ${data.socialAccount}
Pilihan Domain Web : ${data.domain}
Kontak Admin WA    : ${data.waAdmin}
Katalog Produk     : ${data.catalogNotes}

IV. GAYA KOMUNIKASI
Referensi Visual   : ${data.visualRef}
Tone of Voice      : ${data.tone}

==========================================
Dicetak pada: ${new Date().toLocaleString('id-ID')}
Standar Operasional Prosedur Agency Creative & Digital Solutions.
`;
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Onboarding_${data.brandName.replace(/\s+/g, '_')}.txt`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('Ringkasan berkas Onboarding berhasil diunduh! 📄');
    });
  }

  updateWizardUI();
}

/* ==========================================================================
   6. SOP ACCORDION (SECTION III OF PROFILE.DOCX)
   ========================================================================== */
function initSopAccordion() {
  const items = document.querySelectorAll('.sop-item');

  items.forEach((item) => {
    const trigger = item.querySelector('.sop-trigger');
    if (!trigger) return;

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all others
      items.forEach((i) => i.classList.remove('open'));

      if (!isOpen) {
        item.classList.add('open');
      }
    });
  });

  // Open the first one by default
  if (items.length > 0) {
    items[0].classList.add('open');
  }
}

/* ==========================================================================
   7. TOAST NOTIFICATION UTILITY
   ========================================================================== */
function showToast(message) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>✨</span><span>${message}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
