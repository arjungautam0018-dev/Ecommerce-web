const PRODUCTS = [
  {
    title: "Custom Frame",
    desc: "A personalized frame for photos or artwork, perfect as a gift or for home decoration.",
    price: "Rs.2,499",
    img: "/resources/frame1.jpg",
    category: "Sports"
  },
  {
    title: "Custom Frame",
    desc: "A personalized frame for photos or artwork, perfect as a gift or for home decoration.",
    price: "Rs.2,499",
    img: "/resources/frame.jpg",
    category: "Sports"
  },
  {
    title: "Custom Wall Frame",
    desc: "Elegant customizable wall frame with premium print finish.",
    price: "Rs.3,499",
    img: "/resources/frame.webp",
    category: "Custom"
  },
  {
    title: "Stamp Set",
    desc: "Official stamp set suitable for badge programs and office use.",
    price: "Rs.1,299",
    img: "/resources/stamp.jpg",
    category: "Office"
  },
  {
    title: "Event Frame",
    desc: "A modern showcase frame designed for event photos and memories.",
    price: "Rs.2,999",
    img: "/resources/frame3.webp",
    category: "Events"
  },
   { title: "Sport Medals", desc: "Custom engraved medals for tournaments, schools, and clubs.", price:"Rs.899", img: "/resources/medal.jpg", category: "Sports" },
    { title: "Trophies", desc: "Classic and modern trophy designs for winners and MVPs.", price:"Rs.3,499", img: "/resources/trophies.jpg", category: "Sports" },
    { title: "Token of Love", desc: "Keepsake tokens and commemorative pieces for special moments.", price:"Rs.1,299", img: "/resources/token.jpg", category: "Sports" },
    { title: "Khada", desc: "Traditional ceremonial scarves — honor guests and champions.", price:"Rs.499", img: "/resources/khada.jpg", category: "Sports" }
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
      <p class="category-chip">${product.category}</p>
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
      alert(`${title} added to cart`);
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
      const cart = [{ title, price, img, quantity: 1 }];
      safeJsonWrite("cart", cart);
      window.location.href = "/serve/cart";
    });
  });
}

function setupThemeToggle() {
  const themeButton = document.querySelector(".nav-bar-right a");
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