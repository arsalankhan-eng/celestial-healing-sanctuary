import { bookingManager } from './booking.js';

class CartManager {
  constructor() {
    this.items = [];
    this.isOpen = false;
  }

  init() {
    this.attachCartEvents();
    this.renderCart();
  }

  addItem(item) {
    const existing = this.items.find(i => i.id === item.id);
    if (existing) {
      existing.quantity = (existing.quantity || 1) + 1;
    } else {
      this.items.push({ ...item, quantity: 1 });
    }
    this.showToast(`✨ ${item.title} added to your sacred basket`);
    this.renderCart();
    this.openCart();
  }

  removeItem(id) {
    this.items = this.items.filter(i => i.id !== id);
    this.renderCart();
  }

  openCart() {
    this.isOpen = true;
    const drawer = document.getElementById("cart-drawer");
    const overlay = document.getElementById("cart-overlay");
    if (drawer) drawer.classList.add("open");
    if (overlay) overlay.classList.add("open");
  }

  closeCart() {
    this.isOpen = false;
    const drawer = document.getElementById("cart-drawer");
    const overlay = document.getElementById("cart-overlay");
    if (drawer) drawer.classList.remove("open");
    if (overlay) overlay.classList.remove("open");
  }

  getTotal() {
    return this.items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
  }

  renderCart() {
    const countBadge = document.querySelectorAll(".cart-count-badge");
    const totalCount = this.items.reduce((sum, i) => sum + (i.quantity || 1), 0);
    countBadge.forEach(b => {
      b.textContent = totalCount;
      b.style.display = totalCount > 0 ? "inline-flex" : "none";
    });

    const itemsContainer = document.getElementById("cart-items-list");
    const totalEl = document.getElementById("cart-total-amount");
    const checkoutBtn = document.getElementById("cart-checkout-btn");

    if (totalEl) totalEl.textContent = `$${this.getTotal()} AUD`;

    if (!itemsContainer) return;

    if (this.items.length === 0) {
      itemsContainer.innerHTML = `
        <div class="empty-cart-state">
          <span class="empty-icon">🌙</span>
          <p class="empty-text">Your sacred basket is currently resting in stillness.</p>
          <button type="button" class="mystic-btn-secondary browse-btn" onclick="document.getElementById('cart-drawer').classList.remove('open'); document.getElementById('cart-overlay').classList.remove('open');">Explore Offerings</button>
        </div>
      `;
      if (checkoutBtn) checkoutBtn.disabled = true;
      return;
    }

    if (checkoutBtn) checkoutBtn.disabled = false;

    itemsContainer.innerHTML = this.items.map(item => `
      <div class="cart-item-card">
        <div class="cart-item-thumb">
          <img src="${item.image || '/images/crystal-set.jpg'}" alt="${item.title}" />
        </div>
        <div class="cart-item-details">
          <div class="cart-item-header">
            <h4 class="cart-item-name">${item.title}</h4>
            <button type="button" class="cart-remove-btn" data-id="${item.id}" title="Remove">✕</button>
          </div>
          <span class="cart-item-sub">${item.duration || item.format || "Instant Access"}</span>
          <div class="cart-item-footer">
            <span class="cart-item-qty">Qty: ${item.quantity || 1}</span>
            <span class="cart-item-price">$${item.price * (item.quantity || 1)} AUD</span>
          </div>
        </div>
      </div>
    `).join("");

    itemsContainer.querySelectorAll(".cart-remove-btn").forEach(btn => {
      btn.addEventListener("click", () => this.removeItem(btn.dataset.id));
    });
  }

  showToast(message) {
    let toast = document.getElementById("mystic-toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "mystic-toast";
      toast.className = "mystic-toast";
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add("visible");
    setTimeout(() => toast.classList.remove("visible"), 3200);
  }

  attachCartEvents() {
    const openBtns = document.querySelectorAll(".open-cart-trigger");
    const closeBtn = document.getElementById("close-cart-btn");
    const overlay = document.getElementById("cart-overlay");
    const checkoutBtn = document.getElementById("cart-checkout-btn");

    openBtns.forEach(b => b.addEventListener("click", () => this.openCart()));
    closeBtn?.addEventListener("click", () => this.closeCart());
    overlay?.addEventListener("click", () => this.closeCart());

    checkoutBtn?.addEventListener("click", () => {
      if (this.items.length === 0) return;
      this.closeCart();
      // Open checkout modal with primary cart item or combined bundle
      const primaryItem = {
        title: this.items.length === 1 ? this.items[0].title : `Sacred Bundle (${this.items.length} Offerings)`,
        price: this.getTotal(),
        currency: "AUD",
        badge: "Sacred Cart Checkout",
        description: this.items.map(i => `${i.title} (x${i.quantity})`).join(", "),
        duration: "Digital / Multi-Session",
        isCartCheckout: true
      };
      bookingManager.openBookingModal(primaryItem, "cart");
    });
  }
}

export const cartManager = new CartManager();
