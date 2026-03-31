const CATEGORY_PRODUCTS = {
  sports: [
    { title: "Sport Medals", desc: "Custom engraved medals for tournaments, schools, and clubs.", price: 899, img: "/resources/medal.jpg", category: "Sports" },
    { title: "Trophies", desc: "Classic and modern trophy designs for winners and MVPs.", price: 3499, img: "/resources/trophies.jpg", category: "Sports" },
    { title: "Token of Love", desc: "Keepsake tokens and commemorative pieces for special moments.", price: 1299, img: "/resources/token.jpg", category: "Sports" },
    { title: "Khada", desc: "Traditional ceremonial scarves — honor guests and champions.", price: 599, img: "/resources/khada.jpg", category: "Sports" }
  ],
  events: [
    { title: "Event Frame", desc: "Display event moments with a polished finish frame.", price: 2999, img: "/resources/frame3.webp", category: "Events" },
    { title: "Ceremony Cup", desc: "Custom event cup designed for celebrations.", price: 5499, img: "/resources/sublimation_cup.webp", category: "Events" }
  ],
  office: [
    { title: "Stamp Set", desc: "Official stamp set for office and document use.", price: 1299, img: "/resources/stamp.jpg", category: "Office" },
    { title: "Office Frame", desc: "Desk frame with clean office-friendly design.", price: 2399, img: "/resources/frame.webp", category: "Office" }
  ],
  custom: [
    { title: "Sublimation Cup", desc: "Customizable ceramic cup with smooth print surface.", price: 5999, img: "/resources/sublimation_cup.webp", category: "Custom" },
    { title: "Custom Stamp", desc: "Made-to-order stamp for branding and personal use.", price: 1999, img: "/resources/stamp.jpg", category: "Custom" }
  ]
};

window.toggleMenu = function toggleMenu() {
  const menu = document.querySelector(".quickies");
  if (menu) menu.classList.toggle("show");
};

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

function renderCards(categoryKey) {
  const products = CATEGORY_PRODUCTS[categoryKey] || [];
  const grid = document.getElementById("productsGrid");
  if (!grid) return;
  grid.innerHTML = "";

  products.forEach((item) => {
    const card = document.createElement("article");
    card.className = "product-card";
    card.innerHTML = `
      <div class="product-card-thumb">
        <img src="${item.img}" alt="${item.title}">
      </div>
      <div class="product-inform">
        <h3>${item.title}</h3>
        <p>${item.desc}</p>
        <p class="price-product">Rs.${item.price.toLocaleString()}</p>
      </div>
      <div class="card-actions">
        <div class="buy-now-wrap"><button type="button" class="buy-now-btn">Buy Now</button></div>
        <div class="add-to-cart"><button type="button">Add to Cart</button></div>
      </div>
    `;

    card.querySelector(".add-to-cart button")?.addEventListener("click", () => {
      const cart = readJson("cart", []);
      const existing = cart.find((product) => product.title === item.title);
      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push({ title: item.title, price: item.price, img: item.img, quantity: 1 });
      }
      writeJson("cart", cart);
      alert(`${item.title} added to cart`);
    });

    card.querySelector(".buy-now-btn")?.addEventListener("click", () => {
      writeJson("cart", [{ title: item.title, price: item.price, img: item.img, quantity: 1 }]);
      window.location.href = "/serve/cart";
    });

    grid.appendChild(card);
  });
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
const defaultCategory = "sports"; // or dynamically get from URL or selection
document.addEventListener("DOMContentLoaded", () => {
  renderCards(defaultCategory);
  closeMenuOnOutsideClick();
  setupThemeToggle(); // <-- Also make sure theme toggle runs
});