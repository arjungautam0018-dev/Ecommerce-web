function showToast(message) {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = "toast";

  toast.innerHTML = `
    <div class="toast-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
      </svg>
    </div>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  // show animation
  setTimeout(() => toast.classList.add("show"), 50);

  // stay longer (3.5s)
  setTimeout(() => {
    toast.classList.remove("show");
    toast.classList.add("hide");

    setTimeout(() => toast.remove(), 500);
  }, 3500);
}

function readJson(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

window.toggleMenu = function toggleMenu() {
  const menu = document.querySelector(".quickies");
  if (menu) menu.classList.toggle("show");
};


function setupMenuClose() {
  document.addEventListener("click", (event) => {
    const menu = document.querySelector(".quickies");
    const hamburger = document.querySelector(".hamburger");
    if (!menu || !hamburger) return;
    if (!hamburger.contains(event.target) && !menu.contains(event.target)) {
      menu.classList.remove("show");
    }
  });
}

function setupThemeToggle() {
  const themeButton = document.querySelector(".nav-bar-right a");
  if (!themeButton) return;
  if (localStorage.getItem("theme") === "dark") document.body.classList.add("theme-dark");
  themeButton.addEventListener("click", (event) => {
    event.preventDefault();
    document.body.classList.toggle("theme-dark");
    localStorage.setItem("theme", document.body.classList.contains("theme-dark") ? "dark" : "light");
  });
}

let selectedIndexes = new Set();

function rebuildSelectedAfterRemove(removedIndex) {
  const next = new Set();
  selectedIndexes.forEach((i) => {
    if (i === removedIndex) return;
    next.add(i > removedIndex ? i - 1 : i);
  });
  selectedIndexes = next;
}

function renderSummary() {
  const cart = readJson("cart", []);
  const itemsContainer = document.querySelector(".checkout-items");
  if (!itemsContainer) return;
  itemsContainer.innerHTML = "";

  let subtotal = 0;
  selectedIndexes.forEach((index) => {
    const item = cart[index];
    if (!item) return;
    const total = item.price * item.quantity;
    subtotal += total;
    itemsContainer.insertAdjacentHTML("beforeend", `
      <div class="checkout-item">
        
        
          <h4>${item.title}</h4>
          <p class="checkout-line-price">${item.quantity} x Rs.${item.price.toLocaleString()} = Rs.${total.toLocaleString()}</p>
        
      </div>
    `);
  });

  const tax = Math.round(subtotal * 0.13);
  const total = subtotal + tax;
  const subEl = document.getElementById("subtotal");
  const taxEl = document.getElementById("tax");
  const totalEl = document.getElementById("total");
  if (subEl) subEl.textContent = `Rs.${subtotal.toLocaleString()}`;
  if (taxEl) taxEl.textContent = `Rs.${tax.toLocaleString()}`;
  if (totalEl) totalEl.textContent = `Rs.${total.toLocaleString()}`;
}

function renderCart() {
  const cart = readJson("cart", []);
  const container = document.querySelector(".cart-products");
  if (!container) return;

  selectedIndexes = new Set([...selectedIndexes].filter((i) => i < cart.length));
  container.innerHTML = "";

  if (!cart.length) {
    container.innerHTML = `<div class="cart-empty">Your cart is empty.</div>`;
    renderSummary();
    return;
  }

  cart.forEach((item, index) => {
    const isSelected = selectedIndexes.has(index);
    const card = document.createElement("div");
    card.className = `cart-product ${isSelected ? "selected" : ""}`;
    card.dataset.index = String(index);
    card.innerHTML = `
      <div class="cart-product-top">
        <div class="details-product">
          <label class="item-check">
            <input type="checkbox" class="item-checkbox" ${isSelected ? "checked" : ""}>
          </label>
          <div class="img-product"><img src="${item.img}" alt="${item.title}"></div>
          <div class="details">
            <h3>${item.title}</h3>
            <div class="details-price-row">
              <p class="cart-price-each">Rs.${item.price.toLocaleString()} piece</p>
              <div class="details-row-actions">
                <button type="button" class="cart-wishlist-btn" aria-label="Move to wishlist" title="Wishlist">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/>
                  </svg>
                </button>
                <button type="button" class="delete-product" aria-label="Remove from cart">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="cart-item-side">
          <div class="add-item">
            <div class="quantity">
              <button type="button" class="decrease">-</button>
              <span class="quantity-value">${item.quantity}</span>
              <button type="button" class="increase">+</button>
            </div>
          </div>
          <div class="total"><h3 class="cart-line-total">Total: Rs.${(item.price * item.quantity).toLocaleString()}</h3></div>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
  const checkoutBtn = document.getElementById("proceed-checkout");
if (checkoutBtn) {
checkoutBtn.disabled = cart.length === 0;
checkoutBtn.style.opacity = cart.length === 0 ? "0.5" : "1";
checkoutBtn.style.cursor = cart.length === 0 ? "not-allowed" : "pointer";
}

  bindCartEvents();
  renderSummary();
}

function bindCartEvents() {
  document.querySelectorAll(".cart-product").forEach((card) => {
    const index = Number(card.dataset.index);

    card.querySelector(".item-checkbox")?.addEventListener("change", (event) => {
      if (event.target.checked) selectedIndexes.add(index);
      else selectedIndexes.delete(index);
      card.classList.toggle("selected", event.target.checked);
      renderSummary();

    });

    card.addEventListener("click", (event) => {
      if (event.target.closest("button") || event.target.closest(".item-check") || event.target.closest(".cart-item-side")) {
        return;
      }
      const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
      const cb = card.querySelector(".item-checkbox");

      if (isDesktop && cb) {
        cb.checked = !cb.checked;
        cb.dispatchEvent(new Event("change"));
        return;
      }

      if (!isDesktop) {
        if (selectedIndexes.has(index)) {
          selectedIndexes.delete(index);
          card.classList.remove("selected");
        } else {
          selectedIndexes.add(index);
          card.classList.add("selected");
        }
        if (cb) cb.checked = selectedIndexes.has(index);
        renderSummary();
      }
    });

    card.querySelector(".increase")?.addEventListener("click", (e) => {
      e.stopPropagation();
      const latest = readJson("cart", []);
      if (!latest[index]) return;
      latest[index].quantity += 1;
      writeJson("cart", latest);
      renderCart();
    });

    card.querySelector(".decrease")?.addEventListener("click", (e) => {
      e.stopPropagation();
      const latest = readJson("cart", []);
      if (!latest[index]) return;
      if (latest[index].quantity > 1) latest[index].quantity -= 1;
      writeJson("cart", latest);
      renderCart();
    });

card.querySelector(".delete-product")?.addEventListener("click", (event) => {
  event.stopPropagation();

  const next = readJson("cart", []);
  const item = next[index]; // 👈 get item before delete

  next.splice(index, 1);
  writeJson("cart", next);

  rebuildSelectedAfterRemove(index);
  renderCart();

  // ✅ correct usage
  showToast(`${item.title} removed from cart`);
});
card.querySelector(".cart-wishlist-btn")?.addEventListener("click", (event) => {
  event.stopPropagation();

  const current = readJson("cart", []);
  const item = current[index];
  if (!item) return;

  const wishlist = readJson("wishlist", []);
  wishlist.push({
    title: item.title,
    price: item.price,
    img: item.img,
    category: item.category || "General",
    desc: item.desc || "Saved from cart."
  });

  writeJson("wishlist", wishlist);

  // remove from cart
  current.splice(index, 1);
  writeJson("cart", current);

  rebuildSelectedAfterRemove(index);
  renderCart();

  // ✅ SHOW TOAST HERE
  showToast(`${item.title} moved to wishlist`);
});
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setupMenuClose();
  setupThemeToggle();
  const initialCart = readJson("cart", []);

  renderCart();
  const checkoutBtn = document.getElementById("proceed-checkout");

checkoutBtn?.addEventListener("click", () => {
  const cart = readJson("cart", []);

  // ❌ Cart empty
  if (cart.length === 0) {
    showPopup("Your cart is empty!");
    return;
  }

  // ❌ Nothing selected
  if (selectedIndexes.size === 0) {
    showPopup("Please select at least one product!");
    return;
  }

  // ✅ Proceed
  showPopup("Proceeding to checkout...");
  // OR redirect:
  // window.location.href = "/checkout";
});
});

function showPopup(message, type = "info") {
  const popup = document.getElementById("popup");
  const msg = document.getElementById("popup-message");

  if (!popup || !msg) return;

  msg.textContent = message;

  // reset classes
  popup.classList.remove("success", "error", "info");

  popup.classList.add("show", type);

  // auto close for success
  if (type === "success") {
    setTimeout(() => {
      popup.classList.remove("show");
    }, 1500);
  }
}

function closePopup() {
  document.getElementById("popup")?.classList.remove("show");
}

