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
   { title: "Sport Medals", desc: "Custom engraved medals for tournaments, schools, and clubs.", price:"रू .899", img: "/resources/medal.jpg" },
    { title: "Trophies", desc: "Classic and modern trophy designs for winners and MVPs.", price:"रू .3,499", img: "/resources/trophies.jpg" },
    { title: "Token of Love", desc: "Keepsake tokens and commemorative pieces for special moments.", price:"रू .1,299", img: "/resources/token.jpg" },
    { title: "Khada", desc: "Traditional ceremonial scarves — honor guests and champions.", price:"रू .499", img: "/resources/khada.jpg" }
];

function safeJsonRead(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function safeJsonWrite(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

window.toggleMenu = function toggleMenu() {
  const menu = document.querySelector(".quickies");
  if (menu) menu.classList.toggle("show");
};

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

function parsePrice(priceText) {
  return Number(String(priceText).replace(/[^0-9]/g, "")) || 0;
}

function createProductCard(product) {
  const card = document.createElement("div");
  card.className = "product-card";
  card.innerHTML = `
    <div class="product-card-thumb">
      <img class="products_images" src="${product.img}" alt="${product.title}">
    </div>
    <div class="product-inform">
      <h3>${product.title}</h3>
      <p class="desc-product">${product.desc}</p>
      <p class="price-product">${product.price}</p>
    </div>
    <div class="card-actions">

      <div class="buy-now-action">
        <button type="button" class="buy-now-btn">
          <i class="fa-solid fa-bolt"></i>
          Add to Cart
        </button>
      </div>
      <div class="add-to-cart">
        <button type="button">
          <i class="fa-solid fa-cart-shopping"></i>
          Buy Now
        </button>
      </div>
    </div>
  `;
  return card;
}

function renderProducts() {
  const sections = [document.querySelector(".products"), document.querySelector(".products2")];
  sections.forEach((container) => {
    if (!container) return;
    container.innerHTML = "";
    PRODUCTS.forEach((product) => container.appendChild(createProductCard(product)));
  });
}

function setupCartButtons() {
  document.querySelectorAll(".add-to-cart button, .quick-add-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const card = button.closest(".product-card");
      if (!card) return;

      const title = card.querySelector("h3")?.textContent || "";
      const priceText = card.querySelector(".price-product")?.textContent || "0";
      const img = card.querySelector(".products_images")?.src || "";
      const price = parsePrice(priceText);

      const cart = safeJsonRead("cart", []);
      const existingItem = cart.find((item) => item.title === title);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({ title, price, img, quantity: 1 });
      }
      safeJsonWrite("cart", cart);
      showToast(`${title} added to cart`);
    });
  });
}

function setupBuyNowButtons() {
  document.querySelectorAll(".buy-now-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const card = button.closest(".product-card");
      if (!card) return;

      const title = card.querySelector("h3")?.textContent || "";
      const priceText = card.querySelector(".price-product")?.textContent || "0";
      const img = card.querySelector(".products_images")?.src || "";
      const price = parsePrice(priceText);

      // 1️⃣ Read existing cart
      const cart = safeJsonRead("cart", []);

      // 2️⃣ Add item if not already in cart
      let index = cart.findIndex((item) => item.title === title);
      if (index === -1) {
        cart.push({ title, price, img, quantity: 1 });
        index = cart.length - 1;
      }

      safeJsonWrite("cart", cart);

      // 3️⃣ Save selected index in localStorage
      safeJsonWrite("selectedIndexes", [index]);

      // 4️⃣ Redirect to cart
      window.location.href = "/serve/cart";
    });
  });
}
function setupThemeToggle() {
  const sunIcon = `
<svg class="menu-item-icon" stroke="currentColor fill="none" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--emojione" preserveAspectRatio="xMidYMid meet" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g fill="#ffe62e"> <path d="M20.5 59.7l7-7.2c-2.5-.5-4.8-1.5-6.9-2.9l-.1 10.1"> </path> <path d="M43.5 4.3l-7 7.2c2.5.5 4.8 1.5 6.9 2.9l.1-10.1"> </path> <path d="M4.3 43.5l10.1-.1C13 41.3 12 39 11.5 36.5l-7.2 7"> </path> <path d="M59.7 20.5l-10.1.1c1.3 2.1 2.3 4.4 2.9 6.9l7.2-7"> </path> <path d="M4.3 20.5l7.2 7c.5-2.5 1.5-4.8 2.9-6.9l-10.1-.1"> </path> <path d="M59.7 43.5l-7.2-7c-.5 2.5-1.5 4.8-2.9 6.9l10.1.1"> </path> <path d="M20.5 4.3l.1 10.1c2.1-1.3 4.4-2.3 6.9-2.9l-7-7.2"> </path> <path d="M43.5 59.7l-.1-10.1C41.3 51 39 52 36.5 52.5l7 7.2"> </path> </g> <g fill="#ffce31"> <path d="M14.8 44l-4 9.3l9.3-4C18 47.8 16.2 46 14.8 44"> </path> <path d="M49.2 20l4-9.3l-9.2 4c2 1.5 3.8 3.3 5.2 5.3"> </path> <path d="M11.4 28.3L2 32l9.4 3.7c-.3-1.2-.4-2.4-.4-3.7s.1-2.5.4-3.7"> </path> <path d="M52.6 35.7L62 32l-9.4-3.7c.2 1.2.4 2.5.4 3.7c0 1.3-.1 2.5-.4 3.7"> </path> <path d="M20 14.8l-9.3-4l4 9.3c1.5-2.1 3.3-3.9 5.3-5.3"> </path> <path d="M44 49.2l9.3 4l-4-9.3C47.8 46 46 47.8 44 49.2"> </path> <path d="M35.7 11.4L32 2l-3.7 9.4c1.2-.2 2.5-.4 3.7-.4s2.5.1 3.7.4"> </path> <path d="M28.3 52.6L32 62l3.7-9.4c-1.2.3-2.4.4-3.7.4s-2.5-.1-3.7-.4"> </path> <circle cx="32" cy="32" r="19"> </circle> </g> </g></svg>

`;

const moonIcon = `
                <svg class="menu-item-icon" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
        </svg>
`;
  const themeButton = document.querySelector(".theme-toggle");
  const iconContainer = themeButton.querySelector(".icon");

  if (!themeButton) return;

  const savedTheme = localStorage.getItem("theme");

  // Apply saved theme
  if (savedTheme === "dark") {
    document.body.classList.add("theme-dark");
    iconContainer.innerHTML = moonIcon; // show moon in dark mode
  } else {
    iconContainer.innerHTML = sunIcon; // show sun in light mode
  }

  themeButton.addEventListener("click", (event) => {
    event.preventDefault();

    document.body.classList.toggle("theme-dark");

    const isDark = document.body.classList.contains("theme-dark");

    // Save theme
    localStorage.setItem("theme", isDark ? "dark" : "light");

    // 🔥 SWITCH ICON
    iconContainer.innerHTML = isDark ? sunIcon : moonIcon;
  });
}

function setupHeroSlider() {
  const layers = document.querySelectorAll(".hero-slider .carousel-layer");
  const prevBtn = document.querySelector(".hero-slider .carousel-btn.prev");
  const nextBtn = document.querySelector(".hero-slider .carousel-btn.next");

  if (!layers.length || !prevBtn || !nextBtn) return;

  let current = 0;

  function showSlide(index) {
    layers.forEach((layer) => layer.classList.remove("active"));
    layers[index].classList.add("active");
  }

  prevBtn.addEventListener("click", () => {
    current = (current - 1 + layers.length) % layers.length;
    showSlide(current);
  });

  nextBtn.addEventListener("click", () => {
    current = (current + 1) % layers.length;
    showSlide(current);
  });

  setInterval(() => {
    current = (current + 1) % layers.length;
    showSlide(current);
  }, 4000);
}

document.addEventListener("DOMContentLoaded", () => {
  closeMenuOnOutsideClick();
  renderProducts();
  setupCartButtons();
  setupThemeToggle();
  setupHeroSlider();
  setupBuyNowButtons();
});