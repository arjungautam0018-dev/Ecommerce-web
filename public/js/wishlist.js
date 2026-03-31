window.toggleMenu = function toggleMenu() {
  const menu = document.querySelector(".quickies");
  if (menu) menu.classList.toggle("show");
};

function safeRead(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function safeWrite(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function parsePrice(text) {
  return Number(String(text).replace(/[^0-9]/g, "")) || 0;
}

function closeMenuOnOutsideClick() {
  document.addEventListener("click", (event) => {
    const menu = document.querySelector(".quickies");
    const hamburger = document.querySelector(".hamburger");
    if (!menu || !hamburger) return;
    if (!hamburger.contains(event.target) && !menu.contains(event.target)) {
      menu.classList.remove("show");
    }
  });
}

function renderWishlist() {
  const root = document.getElementById("wishlistProducts");
  if (!root) return;

  const wishlist = safeRead("wishlist", []);
  root.innerHTML = "";

  if (!wishlist.length) {
    root.innerHTML = `<div class="empty-state">Your wishlist is empty. Add products from the home or category pages.</div>`;
    return;
  }

  wishlist.forEach((item) => {
    const card = document.createElement("article");
    card.className = "wishlist-card";
    card.innerHTML = `
      <img src="${item.img}" alt="${item.title}">
      <div class="wishlist-card-body">
        <h3>${item.title}</h3>
        <p>${item.desc || "Saved item from your product list."}</p>
        <div class="wishlist-price">Rs.${(item.price || 0).toLocaleString()}</div>
        <div class="wishlist-actions">
          <button type="button" class="move-cart-btn">Add to Cart</button>
          <button type="button" class="remove-btn">Remove</button>
        </div>
      </div>
    `;

    card.querySelector(".move-cart-btn")?.addEventListener("click", () => {
      const cart = safeRead("cart", []);
      const existing = cart.find((product) => product.title === item.title);
      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push({
          title: item.title,
          price: item.price || parsePrice(item.priceText || "0"),
          img: item.img,
          quantity: 1
        });
      }
      safeWrite("cart", cart);
      alert(`${item.title} added to cart`);
    });

    card.querySelector(".remove-btn")?.addEventListener("click", () => {
      const updated = safeRead("wishlist", []).filter((product) => product.title !== item.title);
      safeWrite("wishlist", updated);
      renderWishlist();
    });

    root.appendChild(card);
  });
}
// ============================================================
// THEME TOGGLE
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

function setupThemeToggle() {
  const themeButton = document.querySelector(".theme-toggle");
  if (!themeButton) return;

  const iconContainer = themeButton.querySelector(".icon");
  if (!iconContainer) return;

  // Load saved theme or system preference
  let currentTheme = localStorage.getItem("theme");
  if (!currentTheme) {
    currentTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  document.body.classList.toggle("theme-dark", currentTheme === "dark");
  iconContainer.innerHTML = currentTheme === "dark" ? ICONS.sun : ICONS.moon;

  // Click to toggle
  themeButton.addEventListener("click", (e) => {
    e.preventDefault();
    const isDark = document.body.classList.toggle("theme-dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    iconContainer.innerHTML = isDark ? ICONS.sun : ICONS.moon;
  });
}

// Initialize after DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  closeMenuOnOutsideClick();
  renderWishlist();
  setupThemeToggle();
});