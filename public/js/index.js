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
          Buy Now
        </button>
      </div>
      <div class="add-to-cart">
        <button type="button">
          <i class="fa-solid fa-cart-shopping"></i>
          Add to Cart
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
  const themeButton = document.querySelector(".theme-toggle");
  if (!themeButton) return;

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") document.body.classList.add("theme-dark");

  themeButton.addEventListener("click", (event) => {
    event.preventDefault();
    document.body.classList.toggle("theme-dark");

    const activeTheme = document.body.classList.contains("theme-dark") ? "dark" : "light";
    localStorage.setItem("theme", activeTheme);
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