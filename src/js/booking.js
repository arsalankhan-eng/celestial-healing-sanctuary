import { HEALING_SESSIONS_DATA, READINGS_DATA, DIGITAL_PRODUCTS_DATA } from './data.js';

class BookingManager {
  constructor() {
    this.selectedSession = HEALING_SESSIONS_DATA[0];
    this.selectedDate = this.getDefaultDate();
    this.selectedSlot = "11:00 AM (AEST)";
    this.step = 1;
    this.activeModal = null;
    this.bookingState = {};
    this.appliedDiscount = 0;
  }

  getDefaultDate() {
    const d = new Date();
    d.setDate(d.getDate() + 2); // default 2 days ahead
    return d.toISOString().split("T")[0];
  }

  init() {
    this.renderOnPageScheduler();
    this.attachModalListeners();
  }

  renderOnPageScheduler() {
    const dateStrip = document.getElementById("scheduler-date-strip");
    const slotGrid = document.getElementById("scheduler-slots-grid");
    if (!dateStrip || !slotGrid) return;

    // Generate next 7 dates
    dateStrip.innerHTML = "";
    const today = new Date();
    for (let i = 1; i <= 7; i++) {
      const current = new Date();
      current.setDate(today.getDate() + i);
      const iso = current.toISOString().split("T")[0];
      const dayName = current.toLocaleDateString("en-US", { weekday: "short" });
      const dayNum = current.getDate();
      const month = current.toLocaleDateString("en-US", { month: "short" });

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `scheduler-date-card ${iso === this.selectedDate ? "active" : ""}`;
      btn.dataset.date = iso;
      btn.innerHTML = `
        <span class="sched-day">${dayName}</span>
        <span class="sched-num">${dayNum}</span>
        <span class="sched-month">${month}</span>
      `;
      btn.addEventListener("click", () => {
        document.querySelectorAll(".scheduler-date-card").forEach(el => el.classList.remove("active"));
        btn.classList.add("active");
        this.selectedDate = iso;
        this.renderTimeSlots();
      });
      dateStrip.appendChild(btn);
    }

    this.renderTimeSlots();
  }

  renderTimeSlots() {
    const slotGrid = document.getElementById("scheduler-slots-grid");
    if (!slotGrid) return;

    const slots = [
      { time: "09:30 AM (AEST)", spots: "1 spot left" },
      { time: "11:00 AM (AEST)", spots: "Available" },
      { time: "01:30 PM (AEST)", spots: "Available" },
      { time: "03:30 PM (AEST)", spots: "Popular" },
      { time: "05:00 PM (AEST)", spots: "1 spot left" },
      { time: "06:30 PM (AEST)", spots: "Evening slot" }
    ];

    slotGrid.innerHTML = "";
    slots.forEach(s => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `slot-btn ${s.time === this.selectedSlot ? "active" : ""}`;
      btn.innerHTML = `
        <span class="slot-time">${s.time}</span>
        <span class="slot-badge">${s.spots}</span>
      `;
      btn.addEventListener("click", () => {
        document.querySelectorAll(".slot-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.selectedSlot = s.time;
      });
      slotGrid.appendChild(btn);
    });
  }

  openBookingModal(serviceItem, forcedType = "healing") {
    this.selectedSession = serviceItem;
    this.step = 1;
    this.appliedDiscount = 0;

    const modal = document.getElementById("booking-checkout-modal");
    if (!modal) return;

    this.renderModalStep(1);
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  closeModal() {
    const modal = document.getElementById("booking-checkout-modal");
    if (modal) {
      modal.classList.remove("open");
      document.body.style.overflow = "";
    }
  }

  renderModalStep(stepNum) {
    this.step = stepNum;
    const body = document.getElementById("modal-step-body");
    const indicator = document.getElementById("modal-steps-indicator");
    if (!body) return;

    if (indicator) {
      indicator.querySelectorAll(".step-dot").forEach((d, idx) => {
        d.classList.toggle("active", idx + 1 <= stepNum);
      });
    }

    const item = this.selectedSession;
    const isDigital = !!item.format || !!item.type;
    const price = item.price;
    const finalPrice = Math.max(0, price - this.appliedDiscount);

    if (stepNum === 1) {
      // Step 1: Review & Schedule Confirmation
      body.innerHTML = `
        <div class="modal-service-summary">
          <div class="summary-left">
            <span class="summary-tag">${item.badge || "Sacred Offering"}</span>
            <h3 class="summary-title">${item.title}</h3>
            <p class="summary-desc">${item.description || item.subtitle || "Complete intuitive session & spiritual realignment."}</p>
            <div class="summary-meta">
              <span>⏱ ${item.duration || item.format || "Instant Access"}</span>
              <span>🌌 ${item.modality || "Virtual Zoom / Audio File"}</span>
            </div>
          </div>
          <div class="summary-price-box">
            <span class="price-label">Session Exchange</span>
            <span class="price-val">$${price} <small>${item.currency}</small></span>
          </div>
        </div>

        ${!isDigital ? `
          <div class="modal-schedule-select">
            <h4 class="field-label">Confirm Date & Chosen Time Slot</h4>
            <div class="input-grid">
              <div class="form-group">
                <label>Date of Healing Session</label>
                <input type="date" id="modal-date-input" value="${this.selectedDate}" class="mystic-input" />
              </div>
              <div class="form-group">
                <label>Available Energy Portal Time</label>
                <select id="modal-time-select" class="mystic-input">
                  <option value="09:30 AM (AEST)">09:30 AM (AEST) • Morning Prana</option>
                  <option value="11:00 AM (AEST)" selected>11:00 AM (AEST) • High Sun Clarity</option>
                  <option value="01:30 PM (AEST)">01:30 PM (AEST) • Midday Integration</option>
                  <option value="03:30 PM (AEST)">03:30 PM (AEST) • Afternoon Harmonic</option>
                  <option value="05:00 PM (AEST)">05:00 PM (AEST) • Twilight Healing</option>
                  <option value="06:30 PM (AEST)">06:30 PM (AEST) • Moonrise Cord Cutting</option>
                </select>
              </div>
            </div>
          </div>
        ` : `
          <div class="modal-digital-notice">
            <div class="digital-notice-icon">✨</div>
            <div>
              <strong>Instant Digital Delivery Access</strong>
              <p>Upon payment confirmation, your sacred audio files and digital guides will be unlocked immediately with lifetime backup streaming.</p>
            </div>
          </div>
        `}

        <div class="modal-actions">
          <button type="button" class="mystic-btn-secondary close-modal-btn">Cancel</button>
          <button type="button" id="btn-to-step-2" class="mystic-btn-primary">
            <span>Continue to Intake & Details</span>
            <span class="arrow">→</span>
          </button>
        </div>
      `;

      document.getElementById("btn-to-step-2")?.addEventListener("click", () => {
        const dateInput = document.getElementById("modal-date-input");
        const timeInput = document.getElementById("modal-time-select");
        if (dateInput) this.selectedDate = dateInput.value;
        if (timeInput) this.selectedSlot = timeInput.value;
        this.renderModalStep(2);
      });
    } else if (stepNum === 2) {
      // Step 2: Intake & Client Info
      body.innerHTML = `
        <div class="step-header">
          <h3 class="step-title">Sacred Intake & Contact Information</h3>
          <p class="step-subtitle">Your energetic field is held in total confidentiality. Share your intentions for this container.</p>
        </div>

        <form id="intake-form" class="modal-form-grid">
          <div class="form-group">
            <label>Full Sacred Name *</label>
            <input type="text" id="intake-name" required placeholder="e.g. Selena Moon" class="mystic-input" value="Selena Moon" />
          </div>
          <div class="form-group">
            <label>Email for Zoom & Confirmation *</label>
            <input type="email" id="intake-email" required placeholder="selena@sanctuary.com" class="mystic-input" value="selena.celestial@example.com" />
          </div>
          <div class="form-group">
            <label>Phone / WhatsApp Number</label>
            <input type="tel" id="intake-phone" placeholder="+61 400 123 456" class="mystic-input" value="+61 412 889 203" />
          </div>
          <div class="form-group">
            <label>Astrological Sun / Moon / Rising (Optional)</label>
            <input type="text" id="intake-zodiac" placeholder="e.g. Scorpio Sun, Pisces Moon, Cancer Rising" class="mystic-input" value="Pisces Sun, Scorpio Moon" />
          </div>
          <div class="form-group full-width">
            <label>Primary Healing Intention or Question *</label>
            <textarea id="intake-intention" rows="3" class="mystic-input" placeholder="What heavy energy, cord, or question are you ready to surrender and heal?">Release energetic cords with past relationship, clear heart chakra heaviness, and step into grounded sovereign abundance.</textarea>
          </div>
        </form>

        <div class="modal-actions">
          <button type="button" id="btn-back-to-1" class="mystic-btn-secondary">← Back</button>
          <button type="button" id="btn-to-step-3" class="mystic-btn-primary">
            <span>Proceed to Sacred Exchange</span>
            <span class="arrow">→</span>
          </button>
        </div>
      `;

      document.getElementById("btn-back-to-1")?.addEventListener("click", () => this.renderModalStep(1));
      document.getElementById("btn-to-step-3")?.addEventListener("click", () => {
        const name = document.getElementById("intake-name").value;
        const email = document.getElementById("intake-email").value;
        if (!name || !email) {
          alert("Please enter your name and email to proceed.");
          return;
        }
        this.bookingState.name = name;
        this.bookingState.email = email;
        this.bookingState.intention = document.getElementById("intake-intention").value;
        this.renderModalStep(3);
      });
    } else if (stepNum === 3) {
      // Step 3: Payment Gateway Checkout
      body.innerHTML = `
        <div class="payment-checkout-container">
          <div class="payment-left">
            <h3 class="step-title">Select Sacred Payment Method</h3>
            <p class="step-subtitle">256-Bit SSL Encrypted Spiritual Transaction</p>

            <div class="payment-method-selector">
              <button type="button" class="pay-tab active" data-tab="card">
                <span>💳 Credit / Debit Card</span>
              </button>
              <button type="button" class="pay-tab" data-tab="apple">
                <span>🍎 Apple Pay</span>
              </button>
              <button type="button" class="pay-tab" data-tab="paypal">
                <span>🅿️ PayPal</span>
              </button>
            </div>

            <div id="card-fields" class="card-form-box">
              <div class="form-group">
                <label>Cardholder Name</label>
                <input type="text" id="card-name" value="${this.bookingState.name || 'Selena Moon'}" class="mystic-input" />
              </div>
              <div class="form-group">
                <label>Card Number</label>
                <div class="card-input-wrapper">
                  <input type="text" id="card-num" value="•••• •••• •••• 4242" class="mystic-input" />
                  <span class="card-brand">VISA / MASTERCARD</span>
                </div>
              </div>
              <div class="input-grid">
                <div class="form-group">
                  <label>Expiry Date</label>
                  <input type="text" id="card-exp" value="08 / 28" class="mystic-input" />
                </div>
                <div class="form-group">
                  <label>CVC / CVV</label>
                  <input type="text" id="card-cvc" value="888" class="mystic-input" />
                </div>
              </div>
            </div>

            <div id="quick-pay-fields" class="quick-pay-box" style="display: none;">
              <div class="quick-pay-hero">
                <span class="quick-pay-icon">✨</span>
                <p>One-touch biometric authorization active. Click Complete Reservation below to authenticate.</p>
              </div>
            </div>

            <div class="promo-box">
              <input type="text" id="promo-code" placeholder="Enter coupon code (try: SOLSTICE)" class="mystic-input promo-input" />
              <button type="button" id="apply-promo-btn" class="mystic-btn-secondary">Apply</button>
            </div>
            <div id="promo-status" class="promo-status"></div>
          </div>

          <div class="payment-right-summary">
            <div class="receipt-card">
              <div class="receipt-header">
                <span class="receipt-logo">CELESTIA SANCTUARY</span>
                <span class="receipt-seal">★ VERIFIED</span>
              </div>
              <div class="receipt-item-title">${item.title}</div>
              <div class="receipt-item-schedule">
                ${!isDigital ? `📅 ${this.selectedDate} at ${this.selectedSlot}` : `⚡ Instant Digital Download Library`}
              </div>

              <div class="receipt-divider"></div>

              <div class="receipt-row">
                <span>Subtotal</span>
                <span>$${price} ${item.currency}</span>
              </div>
              ${this.appliedDiscount > 0 ? `
                <div class="receipt-row discount-row">
                  <span>Solstice Grace (-$${this.appliedDiscount})</span>
                  <span>-$${this.appliedDiscount} AUD</span>
                </div>
              ` : ''}
              <div class="receipt-row">
                <span>Sacred Alignment Tax (Included)</span>
                <span>$0.00</span>
              </div>
              <div class="receipt-divider"></div>
              <div class="receipt-row total-row">
                <span>Total Due</span>
                <span class="total-amount">$${finalPrice} ${item.currency}</span>
              </div>

              <div class="guarantee-badge">
                🛡️ 100% Energetic Integrity Guarantee
              </div>
            </div>
          </div>
        </div>

        <div class="modal-actions">
          <button type="button" id="btn-back-to-2" class="mystic-btn-secondary">← Back</button>
          <button type="button" id="btn-complete-payment" class="mystic-btn-primary mystic-glow-btn">
            <span class="lock-icon">🔒</span>
            <span>Confirm & Complete Booking ($${finalPrice} ${item.currency})</span>
          </button>
        </div>
      `;

      // Tab switcher
      const tabs = body.querySelectorAll(".pay-tab");
      tabs.forEach(tab => {
        tab.addEventListener("click", () => {
          tabs.forEach(t => t.classList.remove("active"));
          tab.classList.add("active");
          const mode = tab.dataset.tab;
          const cardBox = document.getElementById("card-fields");
          const quickBox = document.getElementById("quick-pay-fields");
          if (mode === "card") {
            cardBox.style.display = "block";
            quickBox.style.display = "none";
          } else {
            cardBox.style.display = "none";
            quickBox.style.display = "block";
          }
        });
      });

      // Promo code handler
      document.getElementById("apply-promo-btn")?.addEventListener("click", () => {
        const code = document.getElementById("promo-code").value.trim().toUpperCase();
        const status = document.getElementById("promo-status");
        if (code === "SOLSTICE" || code === "HEALING" || code === "MAGIC") {
          this.appliedDiscount = 20;
          status.innerHTML = `<span class="success-text">✨ Sacred blessing applied! $20 AUD deducted.</span>`;
          setTimeout(() => this.renderModalStep(3), 600);
        } else {
          status.innerHTML = `<span class="error-text">Sacred code not recognized. Use code SOLSTICE for $20 off.</span>`;
        }
      });

      document.getElementById("btn-back-to-2")?.addEventListener("click", () => this.renderModalStep(2));
      document.getElementById("btn-complete-payment")?.addEventListener("click", () => {
        const payBtn = document.getElementById("btn-complete-payment");
        payBtn.disabled = true;
        payBtn.innerHTML = `<span>⏳ Channeling Sacred Payment...</span>`;
        setTimeout(() => {
          this.renderModalStep(4);
        }, 1200);
      });
    } else if (stepNum === 4) {
      // Step 4: Confirmation & Instant Receipt
      const orderId = "CS-" + Math.floor(100000 + Math.random() * 900000);
      body.innerHTML = `
        <div class="confirmation-container">
          <div class="celestial-sparkle-ring">
            <span class="sparkle-icon">✨</span>
          </div>
          <h2 class="confirm-title">Your Sacred Space is Reserved</h2>
          <p class="confirm-subtitle">We have illuminated your intention in the sanctuary registry. A confirmation email has been dispatched to <strong>${this.bookingState.email || 'your email'}</strong>.</p>

          <div class="confirm-card">
            <div class="confirm-grid">
              <div class="confirm-item">
                <span class="c-label">Order Reference</span>
                <span class="c-val">${orderId}</span>
              </div>
              <div class="confirm-item">
                <span class="c-label">Sacred Offering</span>
                <span class="c-val">${item.title}</span>
              </div>
              <div class="confirm-item">
                <span class="c-label">Session Portal Time</span>
                <span class="c-val">${!isDigital ? `${this.selectedDate} • ${this.selectedSlot}` : `Instant Lifetime Access`}</span>
              </div>
              <div class="confirm-item">
                <span class="c-label">Total Exchanged</span>
                <span class="c-val">$${finalPrice} ${item.currency} (Paid)</span>
              </div>
            </div>

            <div class="confirm-deliverables">
              ${!isDigital ? `
                <div class="deliverable-row">
                  <div class="del-icon">🎥</div>
                  <div class="del-info">
                    <strong>Private Zoom Portal Link</strong>
                    <span>https://us02web.zoom.us/j/${orderId.replace(/\D/g, '')}</span>
                  </div>
                  <button type="button" class="del-action-btn" onclick="navigator.clipboard.writeText('https://us02web.zoom.us/j/${orderId.replace(/\D/g, '')}'); alert('Copied Zoom link to clipboard!');">Copy Link</button>
                </div>
                <div class="deliverable-row">
                  <div class="del-icon">📅</div>
                  <div class="del-info">
                    <strong>Sync to Sacred Calendar</strong>
                    <span>Apple Calendar / Google Calendar / Outlook (.ics)</span>
                  </div>
                  <button type="button" class="del-action-btn" id="download-ics-btn">Download .ICS</button>
                </div>
              ` : `
                <div class="deliverable-row">
                  <div class="del-icon">📥</div>
                  <div class="del-info">
                    <strong>High-Res Audio & PDF Vault Files</strong>
                    <span>Direct Lossless Master Downloads (Uncompressed)</span>
                  </div>
                  <button type="button" class="del-action-btn" onclick="alert('Digital files successfully initialized! Downloading your sacred package now.');">Download All</button>
                </div>
              `}
              <div class="deliverable-row">
                <div class="del-icon">📜</div>
                <div class="del-info">
                  <strong>Sacred Session Preparation PDF</strong>
                  <span>Pre-session hydration, altar setup & intention guide</span>
                </div>
                <button type="button" class="del-action-btn" onclick="alert('Downloading Sanctuary Session Preparation Guide (PDF)...');">Download PDF</button>
              </div>
            </div>
          </div>

          <div class="modal-actions center-actions">
            <button type="button" class="mystic-btn-primary close-modal-btn">Return to Sanctuary</button>
          </div>
        </div>
      `;

      document.getElementById("download-ics-btn")?.addEventListener("click", () => {
        this.downloadICS(item, this.selectedDate, this.selectedSlot);
      });
    }

    // Attach close button listeners
    body.querySelectorAll(".close-modal-btn").forEach(btn => {
      btn.addEventListener("click", () => this.closeModal());
    });
  }

  downloadICS(item, dateStr, timeStr) {
    const icsData = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Celestia Sanctuary//Healing Session//EN
BEGIN:VEVENT
SUMMARY:${item.title} with Celestia Sanctuary
DESCRIPTION:Sacred 1:1 Healing Session. Intention: Reconnection and restoration.
DTSTART:${dateStr.replace(/-/g, "")}T090000Z
DTEND:${dateStr.replace(/-/g, "")}T103000Z
LOCATION:Virtual Zoom Sanctuary
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsData], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Celestia-Healing-Session.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  attachModalListeners() {
    const modal = document.getElementById("booking-checkout-modal");
    const closeBtn = document.getElementById("modal-close-x");
    const backdrop = document.getElementById("modal-backdrop");

    closeBtn?.addEventListener("click", () => this.closeModal());
    backdrop?.addEventListener("click", () => this.closeModal());

    // Direct booking button on page
    const directBookBtn = document.getElementById("book-chosen-slot-btn");
    directBookBtn?.addEventListener("click", () => {
      const activeServiceId = document.querySelector(".healing-selector-btn.active")?.dataset.id || "heal-reiki-cord";
      const matched = HEALING_SESSIONS_DATA.find(s => s.id === activeServiceId) || HEALING_SESSIONS_DATA[0];
      this.openBookingModal(matched);
    });
  }
}

export const bookingManager = new BookingManager();
