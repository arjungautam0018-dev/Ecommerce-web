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
// PRODUCTS DATA
// ============================================================

const PRODUCTS = [
  {
    title: "Custom Frame",
    desc: "A personalized frame for photos or artwork, perfect as a gift or for home decoration.",
    price: "रू.2,499",
    img: "/resources/frame1.jpg",
  },
  {
    title: "Custom Frame",
    desc: "A personalized frame for photos or artwork, perfect as a gift or for home decoration.",
    price: "रू.2,499",
    img: "/resources/frame.jpg",
  },
  {
    title: "Custom Wall Frame",
    desc: "Elegant customizable wall frame with premium print finish.",
    price: "रू.3,499",
    img: "/resources/frame.webp",
  },
  {
    title: "Stamp Set",
    desc: "Official stamp set suitable for badge programs and office use.",
    price: "रू.1,299",
    img: "/resources/stamp.jpg",
  },
  {
    title: "Event Frame",
    desc: "A modern showcase frame designed for event photos and memories.",
    price: "रू.2,999",
    img: "/resources/frame3.webp",
  },
  {
    title: "Sport Medals",
    desc: "Custom engraved medals for tournaments, schools, and clubs.",
    price: "रू.899",
    img: "/resources/medal.jpg",
  },
  {
    title: "Trophies",
    desc: "Classic and modern trophy designs for winners and MVPs.",
    price: "रू.3,499",
    img: "/resources/trophies.jpg",
  },
  {
    title: "Token of Love",
    desc: "Keepsake tokens and commemorative pieces for special moments.",
    price: "रू.1,299",
    img: "/resources/token.jpg",
  },
  {
    title: "Khada",
    desc: "Traditional ceremonial scarves — honor guests and champions.",
    price: "रू.499",
    img: "/resources/khada.jpg",
  },
];

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
// THEME TOGGLE — DB-READY
// ============================================================

const ICONS = {
  sun: `
    <svg class="menu-item-icon" fill="none" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
      <g fill="#ffe62e">
        <path d="M20.5 59.7l7-7.2c-2.5-.5-4.8-1.5-6.9-2.9l-.1 10.1"/>
        <path d="M43.5 4.3l-7 7.2c2.5.5 4.8 1.5 6.9 2.9l.1-10.1"/>
        <path d="M4.3 43.5l10.1-.1C13 41.3 12 39 11.5 36.5l-7.2 7"/>
        <path d="M59.7 20.5l-10.1.1c1.3 2.1 2.3 4.4 2.9 6.9l7.2-7"/>
        <path d="M4.3 20.5l7.2 7c.5-2.5 1.5-4.8 2.9-6.9l-10.1-.1"/>
        <path d="M59.7 43.5l-7.2-7c-.5 2.5-1.5 4.8-2.9 6.9l10.1.1"/>
        <path d="M20.5 4.3l.1 10.1c2.1-1.3 4.4-2.3 6.9-2.9l-7-7.2"/>
        <path d="M43.5 59.7l-.1-10.1C41.3 51 39 52 36.5 52.5l7 7.2"/>
      </g>
      <g fill="#ffce31">
        <path d="M14.8 44l-4 9.3l9.3-4C18 47.8 16.2 46 14.8 44"/>
        <path d="M49.2 20l4-9.3l-9.2 4c2 1.5 3.8 3.3 5.2 5.3"/>
        <path d="M11.4 28.3L2 32l9.4 3.7c-.3-1.2-.4-2.4-.4-3.7s.1-2.5.4-3.7"/>
        <path d="M52.6 35.7L62 32l-9.4-3.7c.2 1.2.4 2.5.4 3.7c0 1.3-.1 2.5-.4 3.7"/>
        <path d="M20 14.8l-9.3-4l4 9.3c1.5-2.1 3.3-3.9 5.3-5.3"/>
        <path d="M44 49.2l9.3 4l-4-9.3C47.8 46 46 47.8 44 49.2"/>
        <path d="M35.7 11.4L32 2l-3.7 9.4c1.2-.2 2.5-.4 3.7-.4s2.5.1 3.7.4"/>
        <path d="M28.3 52.6L32 62l3.7-9.4c-1.2.3-2.4.4-3.7.4s-2.5-.1-3.7-.4"/>
        <circle cx="32" cy="32" r="19"/>
      </g>
    </svg>`,
  moon: `
    <svg class="menu-item-icon" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path stroke-linecap="round" stroke-linejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
    </svg>`,
};

async function setupThemeToggle() {
  const themeButton = document.querySelector(".theme-toggle");
  if (!themeButton) return;

  const iconContainer = themeButton.querySelector(".icon");
  if (!iconContainer) return;

  // Load theme from DB on init
  let currentTheme = "light";
  try {
    const prefs = await API.getPreferences();
    currentTheme = prefs.theme || "light";
  } catch {
    // If user is not logged in or request fails, fall back to light
    currentTheme = "light";
  }

  applyTheme(currentTheme, iconContainer);

  themeButton.addEventListener("click", async (e) => {
    e.preventDefault();

    document.body.classList.toggle("theme-dark");
    const isDark = document.body.classList.contains("theme-dark");
    const newTheme = isDark ? "dark" : "light";

    iconContainer.innerHTML = isDark ? ICONS.moon : ICONS.sun;

    // Persist to DB (fire-and-forget, non-blocking)
    API.saveTheme(newTheme).catch((err) =>
      console.warn("Theme save failed:", err.message)
    );
  });
}

function applyTheme(theme, iconContainer) {
  if (theme === "dark") {
    document.body.classList.add("theme-dark");
    iconContainer.innerHTML = ICONS.moon;
  } else {
    document.body.classList.remove("theme-dark");
    iconContainer.innerHTML = ICONS.sun;
  }
}

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
// HERO SLIDER
// ============================================================

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
    autoPlayTimer = setInterval(nextSlide, 4000);
  }

  function resetAutoPlay() {
    clearInterval(autoPlayTimer);
    startAutoPlay();
  }

  prevBtn.addEventListener("click", () => { prevSlide(); resetAutoPlay(); });
  nextBtn.addEventListener("click", () => { nextSlide(); resetAutoPlay(); });

  startAutoPlay();
}


// ============================================================
// LOGOUT FUNCTION
// ============================================================

async function logout(event) {
  event.preventDefault();
  try {
    const res = await fetch("/api/logout", { method: "POST" });
    if (res.ok) {
      showToast("Logged out successfully!", "success");
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    }
  } catch (err) {
    showToast("Logout failed. Please try again.", "error");
  }
}

// ============================================================
// INIT
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
  setupMenuOutsideClick();
  renderProducts();
  setupAddToCartButtons();
  setupBuyNowButtons();
  setupThemeToggle(); // async — fetches theme from DB
  setupHeroSlider();
});