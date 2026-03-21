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
        <span class="wishlist-category">${item.category || "General"}</span>
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

document.addEventListener("DOMContentLoaded", () => {
  closeMenuOnOutsideClick();
  renderWishlist();
});
