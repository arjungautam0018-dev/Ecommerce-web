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



// Initialize after DOM is ready
const defaultCategory = "sports"; // or dynamically get from URL or selection
document.addEventListener("DOMContentLoaded", () => {
  renderCards(defaultCategory);
  closeMenuOnOutsideClick();
});