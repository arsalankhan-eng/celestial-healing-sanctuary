import { READINGS_DATA, HEALING_SESSIONS_DATA, DIGITAL_PRODUCTS_DATA, TESTIMONIALS_DATA, FAQ_DATA } from './data.js';
import { audioPlayer } from './audio.js';
import { initConstellations } from './constellations.js';
import { bookingManager } from './booking.js';
import { cartManager } from './cart.js';

document.addEventListener("DOMContentLoaded", () => {
  // Initialize background starlight constellations
  initConstellations();

  // Initialize booking & cart
  bookingManager.init();
  cartManager.init();

  // Render components
  renderReadings();
  renderHealingSessionSelector();
  renderDigitalProducts();
  renderTestimonials();
  renderFaq();
  initHeaderAndScroll();
  initFloatingAudioBar();
});

// Render Reading Packages
function renderReadings() {
  const container = document.getElementById("readings-grid");
  if (!container) return;

  container.innerHTML = READINGS_DATA.map(item => `
    <article class="reading-card" data-category="${item.category}">
      <div class="reading-image-wrap">
        <img src="${item.image}" alt="${item.title}" class="reading-img" loading="lazy" />
        <div class="reading-badge-pill">${item.badge}</div>
        <div class="reading-overlay">
          <span class="view-details">Celestial Alignment • ${item.duration}</span>
        </div>
      </div>
      <div class="reading-body">
        <div class="reading-meta-top">
          <div class="stars-rating">★★★★★ <span>${item.rating} (${item.reviewsCount})</span></div>
          <span class="reading-duration">⏱ ${item.duration}</span>
        </div>
        <h3 class="reading-title">${item.title}</h3>
        <p class="reading-sub">${item.subtitle}</p>
        
        <ul class="reading-features">
          ${item.features.map(f => `<li><span class="bullet">✦</span> ${f}</li>`).join("")}
        </ul>

        <div class="reading-footer">
          <div class="reading-price">
            <span class="currency-sym">$</span>
            <span class="amount">${item.price}</span>
            <span class="code">${item.currency}</span>
          </div>
          <div class="card-buttons">
            <button type="button" class="btn-book-reading mystic-btn-primary" data-id="${item.id}">
              Book Reading
            </button>
            <button type="button" class="btn-add-reading-cart mystic-btn-secondary" data-id="${item.id}" title="Add to Sacred Basket">
              + Bag
            </button>
          </div>
        </div>
      </div>
    </article>
  `).join("");

  // Event listeners
  container.querySelectorAll(".btn-book-reading").forEach(btn => {
    btn.addEventListener("click", () => {
      const found = READINGS_DATA.find(r => r.id === btn.dataset.id);
      if (found) bookingManager.openBookingModal(found, "reading");
    });
  });

  container.querySelectorAll(".btn-add-reading-cart").forEach(btn => {
    btn.addEventListener("click", () => {
      const found = READINGS_DATA.find(r => r.id === btn.dataset.id);
      if (found) cartManager.addItem(found);
    });
  });

  // Filter tabs for readings
  const tabs = document.querySelectorAll(".filter-pill");
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      const filter = tab.dataset.filter;
      const cards = container.querySelectorAll(".reading-card");
      cards.forEach(c => {
        if (filter === "all" || c.dataset.category === filter) {
          c.style.display = "flex";
        } else {
          c.style.display = "none";
        }
      });
    });
  });
}

// 1:1 Healing Session Switcher
function renderHealingSessionSelector() {
  const tabsWrapper = document.getElementById("healing-tabs-list");
  const detailsBox = document.getElementById("healing-selected-details");
  if (!tabsWrapper || !detailsBox) return;

  tabsWrapper.innerHTML = HEALING_SESSIONS_DATA.map((s, idx) => `
    <button type="button" class="healing-selector-btn ${idx === 0 ? 'active' : ''}" data-id="${s.id}">
      <div class="btn-header">
        <span class="hs-badge">${s.badge}</span>
        <span class="hs-price">$${s.price} ${s.currency}</span>
      </div>
      <h4 class="hs-title">${s.title}</h4>
      <span class="hs-duration">⏱ ${s.duration} • ${s.modality}</span>
    </button>
  `).join("");

  function updateDetails(sessionId) {
    const s = HEALING_SESSIONS_DATA.find(item => item.id === sessionId) || HEALING_SESSIONS_DATA[0];
    detailsBox.innerHTML = `
      <div class="portal-card-content">
        <div class="portal-badge-strip">
          <span class="sacred-pill">✨ ${s.badge}</span>
          <span class="sacred-pill">⚡ Private 1:1 Sanctuary</span>
        </div>
        <h3 class="portal-session-title">${s.title}</h3>
        <p class="portal-session-desc">${s.description}</p>
        
        <div class="portal-includes-box">
          <h4 class="inc-heading">Sacred Inclusions & Modalities:</h4>
          <ul class="portal-includes-list">
            ${s.includes.map(inc => `<li><span class="star-icon">✧</span> ${inc}</li>`).join("")}
          </ul>
        </div>

        <div class="portal-price-banner">
          <div>
            <span class="exchange-tag">Energetic Exchange</span>
            <div class="portal-price-val">$${s.price} <small>${s.currency} / ${s.duration}</small></div>
          </div>
          <button type="button" id="open-selected-booking-btn" class="mystic-btn-primary mystic-glow-btn">
            Reserve Date & Time
          </button>
        </div>
      </div>
    `;

    document.getElementById("open-selected-booking-btn")?.addEventListener("click", () => {
      bookingManager.openBookingModal(s, "healing");
    });
  }

  updateDetails(HEALING_SESSIONS_DATA[0].id);

  tabsWrapper.querySelectorAll(".healing-selector-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      tabsWrapper.querySelectorAll(".healing-selector-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      updateDetails(btn.dataset.id);
    });
  });
}

// Render Digital Products
function renderDigitalProducts() {
  const grid = document.getElementById("digital-products-grid");
  if (!grid) return;

  grid.innerHTML = DIGITAL_PRODUCTS_DATA.map(item => `
    <article class="digital-card">
      <div class="digital-img-wrap">
        <img src="${item.image}" alt="${item.title}" class="digital-thumb" loading="lazy" />
        <span class="digital-badge">${item.badge}</span>
        ${item.originalPrice ? `<span class="discount-tag">Save $${item.originalPrice - item.price} AUD</span>` : ''}
      </div>
      <div class="digital-info">
        <div class="digital-type-meta">
          <span>${item.type}</span>
          <span>${item.format}</span>
        </div>
        <h3 class="digital-title">${item.title}</h3>
        <p class="digital-desc">${item.description}</p>

        <ul class="digital-highlights">
          ${item.highlights.map(h => `<li><span class="check-mark">✓</span> ${h}</li>`).join("")}
        </ul>

        ${item.hasAudioPreview ? `
          <div class="audio-preview-box">
            <button type="button" class="audio-preview-btn mystic-btn-secondary" data-track="${item.previewTitle}">
              <span class="icon">▶</span> Preview 432Hz Audio
            </button>
            <div class="waveform-container">
              <span class="audio-waveform-bar"></span>
              <span class="audio-waveform-bar"></span>
              <span class="audio-waveform-bar"></span>
              <span class="audio-waveform-bar"></span>
              <span class="audio-waveform-bar"></span>
            </div>
          </div>
        ` : ''}

        <div class="digital-bottom-bar">
          <div class="digital-price">
            <span class="cur-price">$${item.price} <small>${item.currency}</small></span>
            ${item.originalPrice ? `<span class="orig-price">$${item.originalPrice}</span>` : ''}
          </div>
          <div class="digital-btn-group">
            <button type="button" class="btn-instant-buy mystic-btn-primary" data-id="${item.id}">
              Instant Access
            </button>
            <button type="button" class="btn-add-cart mystic-btn-secondary" data-id="${item.id}" title="Add to Bag">
              + Bag
            </button>
          </div>
        </div>
      </div>
    </article>
  `).join("");

  // Attach audio preview events
  grid.querySelectorAll(".audio-preview-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      audioPlayer.toggle(btn.dataset.track);
    });
  });

  // Attach cart and buy events
  grid.querySelectorAll(".btn-instant-buy").forEach(btn => {
    btn.addEventListener("click", () => {
      const found = DIGITAL_PRODUCTS_DATA.find(d => d.id === btn.dataset.id);
      if (found) bookingManager.openBookingModal(found, "digital");
    });
  });

  grid.querySelectorAll(".btn-add-cart").forEach(btn => {
    btn.addEventListener("click", () => {
      const found = DIGITAL_PRODUCTS_DATA.find(d => d.id === btn.dataset.id);
      if (found) cartManager.addItem(found);
    });
  });
}

// Testimonials
function renderTestimonials() {
  const wrap = document.getElementById("testimonials-grid");
  if (!wrap) return;

  wrap.innerHTML = TESTIMONIALS_DATA.map(t => `
    <div class="testimonial-card">
      <div class="stars-row">★★★★★</div>
      <blockquote class="quote-text">"${t.quote}"</blockquote>
      <div class="testimonial-author-row">
        <div class="author-avatar">
          <span>${t.author.charAt(0)}</span>
        </div>
        <div>
          <h4 class="author-name">${t.author}</h4>
          <span class="author-loc">${t.location} • <em>${t.service}</em></span>
        </div>
      </div>
    </div>
  `).join("");
}

// FAQ Accordion
function renderFaq() {
  const container = document.getElementById("faq-accordion");
  if (!container) return;

  container.innerHTML = FAQ_DATA.map((item, idx) => `
    <div class="faq-item ${idx === 0 ? 'open' : ''}">
      <button type="button" class="faq-question">
        <span>${item.q}</span>
        <span class="faq-toggle-icon">${idx === 0 ? '−' : '+'}</span>
      </button>
      <div class="faq-answer">
        <p>${item.a}</p>
      </div>
    </div>
  `).join("");

  container.querySelectorAll(".faq-question").forEach(qBtn => {
    qBtn.addEventListener("click", () => {
      const parent = qBtn.parentElement;
      const isOpen = parent.classList.contains("open");
      container.querySelectorAll(".faq-item").forEach(item => {
        item.classList.remove("open");
        const icon = item.querySelector(".faq-toggle-icon");
        if (icon) icon.textContent = "+";
      });
      if (!isOpen) {
        parent.classList.add("open");
        const icon = parent.querySelector(".faq-toggle-icon");
        if (icon) icon.textContent = "−";
      }
    });
  });
}

// Header & Smooth Scroll
function initHeaderAndScroll() {
  const header = document.getElementById("main-header");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 40) {
      header?.classList.add("scrolled");
    } else {
      header?.classList.remove("scrolled");
    }
  });

  // Mobile menu toggle
  const mobileToggle = document.getElementById("mobile-menu-toggle");
  const closeBtn = document.getElementById("close-mobile-nav");
  closeBtn?.addEventListener("click", () => {
    navMenu?.classList.remove("open");
  });
  const navMenu = document.getElementById("main-nav");
  mobileToggle?.addEventListener("click", () => {
    navMenu?.classList.toggle("open");
  });

  navMenu?.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("open");
    });
  });
}

// Floating Audio Bar
function initFloatingAudioBar() {
  const pauseBtn = document.getElementById("floating-pause-btn");
  pauseBtn?.addEventListener("click", () => {
    audioPlayer.stopDrone();
  });
}
