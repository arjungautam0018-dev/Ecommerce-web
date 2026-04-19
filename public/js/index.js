// ============================================================
// UTILITIES
// ============================================================

function showToast(message, type = "success") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast toast--${type}`;

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

function parsePrice(priceText) {
  return Number(String(priceText).replace(/[^0-9]/g, "")) || 0;
}

// ============================================================
// PRODUCTS DATA — loaded from /api/products (products.json)
// ============================================================

let PRODUCTS = [];

async function loadProducts() {
  try {
    const res  = await fetch("/api/products");
    PRODUCTS   = await res.json();
  } catch (e) {
    console.error("Failed to load products:", e);
  }
}

// ============================================================
// API LAYER — DB-READY ENDPOINTS
// ============================================================

const API = {
  /**
   * Add a product to the user's cart in the DB.
   * POST /api/cart/add
   */
  async addToCart(product) {
    const res = await fetch("/api/cart/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: product.title,
        price: product.price,
        img: product.img,
        desc: product.desc,
        quantity: 1,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Failed to add to cart");
    }

    return res.json();
  },

  /**
   * Save the user's theme preference in the DB.
   * PATCH /api/user/preferences
   */
  async saveTheme(theme) {
    const res = await fetch("/api/user/preferences", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ theme }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Failed to save theme");
    }

    return res.json();
  },

  /**
   * Fetch the user's saved preferences (theme, etc.) from the DB.
   * GET /api/user/preferences
   */
  async getPreferences() {
    const res = await fetch("/api/user/preferences");
    if (!res.ok) throw new Error("Failed to fetch preferences");
    return res.json();
  },
};

// ============================================================
// PRODUCT CARD RENDERER
// ============================================================

function createProductCard(product) {
  const card = document.createElement("div");
  card.className = "product-card";

  card.innerHTML = card.innerHTML = `
  <div class="product-card-thumb">
    <img class="products_images" src="${product.img}" alt="${product.title}" loading="lazy">
  </div>
  <div class="product-inform">
    <h3>${product.title}</h3>
    <p class="desc-product">${product.desc}</p>
    <p class="price-product">${product.price}</p>
  </div>
  <div class="card-actions">

    <button type="button" class="add-to-cart-btn"
      data-title="${product.title}"
      data-price="${product.price}"
      data-img="${product.img}"
      data-desc="${product.desc}">Add to Cart</button>

    <button type="button" class="buy-now-btn"
      data-title="${product.title}"
      data-price="${product.price}"
      data-img="${product.img}"
      data-desc="${product.desc}">Buy Now</button>

  </div>
`;


  return card;
}

function renderProducts() {
  const sections = [
    document.querySelector(".products"),
    document.querySelector(".products2"),
  ];

  sections.forEach((container) => {
    if (!container) return;
    container.innerHTML = "";
    PRODUCTS.forEach((product) =>
      container.appendChild(createProductCard(product))
    );
  });
}

// ============================================================
// CART HANDLERS
// ============================================================

function getProductFromCard(btn) {
  return {
    title: btn.dataset.title || "",
    price: btn.dataset.price || "0",
    img:   btn.dataset.img   || "",
    desc:  btn.dataset.desc  || "",
  };
}

function setupAddToCartButtons() {
  document.addEventListener("click", async (e) => {
    const btn = e.target.closest(".add-to-cart-btn");
    if (!btn) return;

    const product = getProductFromCard(btn);

    btn.disabled    = true;
    btn.textContent = "Adding…";

    try {
      await API.addToCart(product);
      showToast(`${product.title} added to cart!`, "success");
      btn.textContent = "Added ✓";
      setTimeout(() => {
        btn.disabled    = false;
        btn.textContent = "Add to Cart";
      }, 2000);
    } catch (err) {
      showToast(err.message, "error");
      btn.disabled    = false;
      btn.textContent = "Add to Cart";
    }
  });
}

function setupBuyNowButtons() {
  document.addEventListener("click", async (e) => {
    const btn = e.target.closest(".buy-now-btn");
    if (!btn) return;

    const product = getProductFromCard(btn);

    btn.disabled    = true;
    btn.textContent = "Processing…";

    try {
      await API.addToCart(product);
      window.location.href = "/serve/cart";
    } catch (err) {
      showToast(err.message, "error");
      btn.disabled    = false;
      btn.textContent = "Buy Now";
    }
  });
}

// ============================================================
// THEME TOGGLE — handled by /js/theme.js
// ============================================================

// ============================================================
// NAV — HAMBURGER MENU
// ============================================================

window.toggleMenu = function () {
  const menu = document.querySelector(".quickies");
  if (menu) menu.classList.toggle("show");
};

function setupMenuOutsideClick() {
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
// HERO SLIDER — moved to /js/hero.js
// ============================================================
/*
function setupHeroSlider() {
  const layers = document.querySelectorAll(".hero-slider .carousel-layer");
  const prevBtn = document.querySelector(".hero-slider .carousel-btn.prev");
  const nextBtn = document.querySelector(".hero-slider .carousel-btn.next");

  if (!layers.length || !prevBtn || !nextBtn) return;

  let current = 0;
  let autoPlayTimer;

  function showSlide(index) {
    layers.forEach((layer) => layer.classList.remove("active"));
    layers[index].classList.add("active");
  }

  function nextSlide() {
    current = (current + 1) % layers.length;
    showSlide(current);
  }

  function prevSlide() {
    current = (current - 1 + layers.length) % layers.length;
    showSlide(current);
  }

  function startAutoPlay() {
    autoPlayTimer = setInterval(nextSlide, 6000);
  }

  function resetAutoPlay() {
    clearInterval(autoPlayTimer);
    startAutoPlay();
  }

  prevBtn.addEventListener("click", () => { prevSlide(); resetAutoPlay(); });
  nextBtn.addEventListener("click", () => { nextSlide(); resetAutoPlay(); });

  startAutoPlay();
}
*/


// ============================================================
// LOGOUT — handled by /js/logout.js
// ============================================================

// ============================================================
// INIT
// ============================================================

document.addEventListener("DOMContentLoaded", async () => {
  setupMenuOutsideClick();
  await loadProducts();
  renderProducts();
  setupAddToCartButtons();
  setupBuyNowButtons();
  // setupHeroSlider(); — now handled by hero.js
});