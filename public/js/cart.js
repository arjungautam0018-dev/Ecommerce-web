// ============================================================
// UTILITIES
// ============================================================

function showToast(message, type = "success") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = "toast";

  const icon =
    type === "success"
      ? `<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>`
      : `<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>`;

  toast.innerHTML = `
    <div class="toast-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke-width="2">${icon}</svg>
    </div>
    <span>${message}</span>
  `;

  container.appendChild(toast);
  setTimeout(() => toast.classList.add("show"), 50);
  setTimeout(() => {
    toast.classList.remove("show");
    toast.classList.add("hide");
    setTimeout(() => toast.remove(), 500);
  }, 3500);
}

function showPopup(message, type = "info") {
  const popup = document.getElementById("popup");
  const msg = document.getElementById("popup-message");
  if (!popup || !msg) return;

  msg.textContent = message;
  popup.classList.remove("success", "error", "info");
  popup.classList.add("show", type);

  if (type === "success") {
    setTimeout(() => popup.classList.remove("show"), 1500);
  }
}

function closePopup() {
  document.getElementById("popup")?.classList.remove("show");
}

// ============================================================
// NAV
// ============================================================

window.toggleMenu = function () {
  const menu = document.querySelector(".quickies");
  if (menu) menu.classList.toggle("show");
};

function setupMenuClose() {
  document.addEventListener("click", (e) => {
    const menu = document.querySelector(".quickies");
    const hamburger = document.querySelector(".hamburger");
    if (!menu || !hamburger) return;
    if (!hamburger.contains(e.target) && !menu.contains(e.target)) {
      menu.classList.remove("show");
    }
  });
}

// ============================================================
// THEME
// ============================================================

function setupThemeToggle() {
  const themeButton = document.querySelector(".theme-toggle");
  if (!themeButton) return;

  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("theme-dark");
  }

  themeButton.addEventListener("click", (e) => {
    e.preventDefault();
    document.body.classList.toggle("theme-dark");
    localStorage.setItem(
      "theme",
      document.body.classList.contains("theme-dark") ? "dark" : "light"
    );
  });
}

// ============================================================
// API LAYER — DB-READY
// ============================================================

const API = {
  /**
   * GET /api/cart
   * Returns the full cart for the logged-in user.
   */
  async getCart() {
    const res = await fetch("/api/cart");
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      if (res.status === 401) handleUnauthorized(err);
      throw new Error(err.message || "Failed to fetch cart");
    }
    return res.json(); // { cart: { items: [...] } }
  },

  /**
   * PATCH /api/cart/item/:itemId/quantity
   * Body: { quantity }
   */
  async updateQuantity(itemId, quantity) {
    const res = await fetch(`/api/cart/item/${itemId}/quantity`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      if (res.status === 401) handleUnauthorized(err);
      throw new Error(err.message || "Failed to update quantity");
    }
    return res.json();
  },

  /**
   * DELETE /api/cart/item/:itemId
   */
  async removeItem(itemId) {
    const res = await fetch(`/api/cart/item/${itemId}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      if (res.status === 401) handleUnauthorized(err);
      throw new Error(err.message || "Failed to remove item");
    }
    return res.json();
  },
};

// ============================================================
// 401 HANDLER
// ============================================================

function handleUnauthorized(data) {
  if (!data?.redirectUrl) return;
  showToast(data.message || "Please log in to continue.", "error");
  setTimeout(() => {
    window.location.href = data.redirectUrl;
  }, data.redirectIn ?? 5000);
}

// ============================================================
// STATE
// ============================================================

let cartItems = [];         // fetched from DB — array of item objects
let selectedIds = new Set(); // Set of item._id strings

// ============================================================
// SUMMARY RENDERER
// ============================================================

function renderSummary() {
  const itemsContainer = document.querySelector(".checkout-items");
  if (!itemsContainer) return;

  itemsContainer.innerHTML = "";
  let subtotal = 0;

  selectedIds.forEach((id) => {
    const item = cartItems.find((i) => String(i._id) === id);
    if (!item) return;

    const total = item.price * item.quantity;
    subtotal += total;

    itemsContainer.insertAdjacentHTML("beforeend", `
      <div class="checkout-item">
        <img src="${item.img}">
        <h4>${item.title}</h4>
        <p class="checkout-line-price">रू.${total.toLocaleString()}</p>
      </div>
    `);
  });

  const tax   = Math.round(subtotal * 0.13);
  const total = subtotal + tax;

  const subEl   = document.getElementById("subtotal");
  const taxEl   = document.getElementById("tax");
  const totalEl = document.getElementById("total");

  if (subEl)   subEl.textContent   = `Rs.${subtotal.toLocaleString()}`;
  if (taxEl)   taxEl.textContent   = `Rs.${tax.toLocaleString()}`;
  if (totalEl) totalEl.textContent = `Rs.${total.toLocaleString()}`;
}

// ============================================================
// CART RENDERER
// ============================================================

function renderCart() {
  const container = document.querySelector(".cart-products");
  if (!container) return;

  // Clean up selectedIds — remove any that no longer exist in cart
  const validIds = new Set(cartItems.map((i) => String(i._id)));
  selectedIds.forEach((id) => {
    if (!validIds.has(id)) selectedIds.delete(id);
  });

  container.innerHTML = "";

  if (!cartItems.length) {
    container.innerHTML = `<div class="cart-empty">Your cart is empty.</div>`;
    renderSummary();
    updateCheckoutButton();
    return;
  }

  cartItems.forEach((item) => {
    const id         = String(item._id);
    const isSelected = selectedIds.has(id);
    const card       = document.createElement("div");

    card.className    = `cart-product ${isSelected ? "selected" : ""}`;
    card.dataset.id   = id;

    card.innerHTML = 
    `<div class="cart-product-top">
<div class="details-product">
<label class="item-check">
<input type="checkbox" class="item-checkbox" ${isSelected ? "checked" : ""}>
</label>
<div class="img-product"><img src="${item.img}" alt="${item.title}"></div>
<div class="details">
<h3>${item.title}</h3>
<div class="details-price-row">
<p class="cart-price-each">रू.${item.price.toLocaleString()} /piece</p>
<div class="details-row-actions">
<div class="first-btn">
 
<div class="quantity">
<button type="button" class="decrease">-</button>
<span class="quantity-value">${item.quantity}</span>
<button type="button" class="increase">+</button>
</div>
<div class="wish-del">
<button type="button" class="cart-wishlist-btn">
<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>
</button>
<button type="button" class="delete-product">
<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
</button>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
 
<div class="cart-item-side">
 
<h3 class="cart-line-total">
  ${item.quantity} × रू.${item.price.toLocaleString()} = रू.${(item.price * item.quantity).toLocaleString()}
</h3></div>
</div>
    `;

    container.appendChild(card);
  });

  updateCheckoutButton();
  bindCartEvents();
  renderSummary();
}

function updateCheckoutButton() {
  const checkoutBtn = document.getElementById("proceed-checkout");
  if (!checkoutBtn) return;
  const empty = cartItems.length === 0;
  checkoutBtn.disabled      = empty;
  checkoutBtn.style.opacity = empty ? "0.5" : "1";
  checkoutBtn.style.cursor  = empty ? "not-allowed" : "pointer";
}

// ============================================================
// CART EVENT BINDINGS
// ============================================================

function bindCartEvents() {
  document.querySelectorAll(".cart-product").forEach((card) => {
    const id = card.dataset.id;

    // ── Checkbox ──
    card.querySelector(".item-checkbox")?.addEventListener("change", (e) => {
      if (e.target.checked) selectedIds.add(id);
      else selectedIds.delete(id);
      card.classList.toggle("selected", e.target.checked);
      renderSummary();
    });

    // ── Card click (select toggle) ──
    card.addEventListener("click", (e) => {
      if (
        e.target.closest("button") ||
        e.target.closest(".item-check") ||
        e.target.closest(".cart-item-side")
      ) return;

      const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
      const cb = card.querySelector(".item-checkbox");

      if (isDesktop && cb) {
        cb.checked = !cb.checked;
        cb.dispatchEvent(new Event("change"));
        return;
      }

      if (!isDesktop) {
        if (selectedIds.has(id)) {
          selectedIds.delete(id);
          card.classList.remove("selected");
        } else {
          selectedIds.add(id);
          card.classList.add("selected");
        }
        if (cb) cb.checked = selectedIds.has(id);
        renderSummary();
      }
    });

    // ── Increase quantity ──
    card.querySelector(".increase")?.addEventListener("click", async (e) => {
      e.stopPropagation();
      const item = cartItems.find((i) => String(i._id) === id);
      if (!item) return;

      try {
        const data = await API.updateQuantity(id, item.quantity + 1);
        cartItems = data.cart.items;
        renderCart();
      } catch (err) {
        showToast(err.message, "error");
      }
    });

    // ── Decrease quantity ──
    card.querySelector(".decrease")?.addEventListener("click", async (e) => {
      e.stopPropagation();
      const item = cartItems.find((i) => String(i._id) === id);
      if (!item || item.quantity <= 1) return;

      try {
        const data = await API.updateQuantity(id, item.quantity - 1);
        cartItems = data.cart.items;
        renderCart();
      } catch (err) {
        showToast(err.message, "error");
      }
    });

    // ── Delete item ──
    card.querySelector(".delete-product")?.addEventListener("click", async (e) => {
      e.stopPropagation();
      const item = cartItems.find((i) => String(i._id) === id);
      if (!item) return;

      try {
        const data = await API.removeItem(id);
        cartItems = data.cart.items;
        selectedIds.delete(id);
        renderCart();
        showToast(`${item.title} removed from cart`);
      } catch (err) {
        showToast(err.message, "error");
      }
    });
  });
}

// ============================================================
// CHECKOUT
// ============================================================

function setupCheckout() {
  const checkoutBtn = document.getElementById("proceed-checkout");
  if (!checkoutBtn) return;

  checkoutBtn.addEventListener("click", () => {
    if (cartItems.length === 0) {
      showPopup("Your cart is empty!");
      return;
    }
    if (selectedIds.size === 0) {
      showPopup("Please select at least one product!");
      return;
    }
    // Pass selected IDs to checkout page
    const params = new URLSearchParams();
    selectedIds.forEach((id) => params.append("items", id));
    window.location.href = `/serve/checkout?${params.toString()}`;
  });
}

// ============================================================
// INIT
// ============================================================

document.addEventListener("DOMContentLoaded", async () => {
  setupMenuClose();
  setupThemeToggle();
  setupCheckout();

  try {
    const data = await API.getCart();
    cartItems = data.cart?.items || [];
  } catch (err) {
    // handleUnauthorized already called inside API if 401
    cartItems = [];
  }

  renderCart();
});