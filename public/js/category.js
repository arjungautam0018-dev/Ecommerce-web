const CATEGORY_PRODUCTS = {
  gifts: [
    { title: "Custom Frame", desc: "Personalized frame for memories and gifting.", price: 2499, img: "/resources/frame1.jpg", category: "Gifts" },
    { title: "Gift Frame Premium", desc: "Modern premium frame style for special occasions.", price: 3299, img: "/resources/frame3.webp", category: "Gifts" }
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
        <div class="add-to-cart"><button type="button">Add to Cart</button></div>
        <button type="button" class="wishlist-btn">Wishlist</button>
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

    card.querySelector(".wishlist-btn")?.addEventListener("click", (event) => {
      const wishlist = readJson("wishlist", []);
      const index = wishlist.findIndex((product) => product.title === item.title);
      if (index > -1) {
        wishlist.splice(index, 1);
      } else {
        wishlist.push(item);
      }
      writeJson("wishlist", wishlist);
      syncWishlistState();
      event.currentTarget.blur();
    });

    grid.appendChild(card);
  });
}

function syncWishlistState() {
  const wishlist = readJson("wishlist", []);
  const titles = new Set(wishlist.map((item) => item.title));
  document.querySelectorAll(".product-card").forEach((card) => {
    const title = card.querySelector("h3")?.textContent || "";
    const button = card.querySelector(".wishlist-btn");
    if (!button) return;
    button.classList.toggle("active", titles.has(title));
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

document.addEventListener("DOMContentLoaded", () => {
  const themeButton = document.querySelector(".nav-bar-right a");
  if (localStorage.getItem("theme") === "dark") document.body.classList.add("theme-dark");
  themeButton?.addEventListener("click", function(event){
    event.preventDefault();
    document.body.classList.toggle("theme-dark");
    localStorage.setItem("theme", document.body.classList.contains("theme-dark") ? "dark" : "light");
  });

  const categoryKey = document.body.getAttribute("data-category") || "gifts";
  renderCards(categoryKey);
  syncWishlistState();
  closeMenuOnOutsideClick();
});
