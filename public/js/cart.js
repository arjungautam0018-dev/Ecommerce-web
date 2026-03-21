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

window.toggleMenu = function toggleMenu() {
  const menu = document.querySelector(".quickies");
  if (menu) menu.classList.toggle("show");
};

function setupMenuClose() {
  document.addEventListener("click", (event) => {
    const menu = document.querySelector(".quickies");
    const hamburger = document.querySelector(".hamburger");
    if (!menu || !hamburger) return;
    if (!hamburger.contains(event.target) && !menu.contains(event.target)) {
      menu.classList.remove("show");
    }
  });
}

function setupThemeToggle() {
  const themeButton = document.querySelector(".nav-bar-right a");
  if (!themeButton) return;
  if (localStorage.getItem("theme") === "dark") document.body.classList.add("theme-dark");
  themeButton.addEventListener("click", (event) => {
    event.preventDefault();
    document.body.classList.toggle("theme-dark");
    localStorage.setItem("theme", document.body.classList.contains("theme-dark") ? "dark" : "light");
  });
}

let selectedIndexes = new Set();

function renderSummary() {
  const cart = readJson("cart", []);
  const itemsContainer = document.querySelector(".checkout-items");
  if (!itemsContainer) return;
  itemsContainer.innerHTML = "";

  let subtotal = 0;
  selectedIndexes.forEach((index) => {
    const item = cart[index];
    if (!item) return;
    const total = item.price * item.quantity;
    subtotal += total;
    itemsContainer.insertAdjacentHTML("beforeend", `
      <div class="checkout-item">
        <img src="${item.img}" alt="${item.title}">
        <div class="checkout-item-details">
          <h4>${item.title}</h4>
          <p>${item.quantity} x Rs.${item.price.toLocaleString()} = Rs.${total.toLocaleString()}</p>
        </div>
      </div>
    `);
  });

  const tax = Math.round(subtotal * 0.13);
  const total = subtotal + tax;
  document.getElementById("subtotal").textContent = `Rs.${subtotal.toLocaleString()}`;
  document.getElementById("tax").textContent = `Rs.${tax.toLocaleString()}`;
  document.getElementById("total").textContent = `Rs.${total.toLocaleString()}`;
}

function renderCart() {
  const cart = readJson("cart", []);
  const container = document.querySelector(".cart-products");
  if (!container) return;

  selectedIndexes = new Set([...selectedIndexes].filter((i) => i < cart.length));
  container.innerHTML = "";

  if (!cart.length) {
    container.innerHTML = `<div class="cart-empty">Your cart is empty.</div>`;
    renderSummary();
    return;
  }

  cart.forEach((item, index) => {
    const isSelected = selectedIndexes.has(index);
    const card = document.createElement("div");
    card.className = `cart-product ${isSelected ? "selected" : ""}`;
    card.dataset.index = String(index);
    card.innerHTML = `
      <div class="details-product">
        <label class="item-check">
          <input type="checkbox" class="item-checkbox" ${isSelected ? "checked" : ""}>
        </label>
        <div class="img-product"><img src="${item.img}" alt="${item.title}"></div>
        <div class="details">
          <h3>${item.title}</h3>
          <p>Rs.${item.price.toLocaleString()} each</p>
        </div>
      </div>
      <div class="add-item">
        <div class="quantity">
          <button class="decrease">-</button>
          <span class="quantity-value">${item.quantity}</span>
          <button class="increase">+</button>
        </div>
      </div>
      <div class="total"><h3>Total: Rs.${(item.price * item.quantity).toLocaleString()}</h3></div>
    `;
    container.appendChild(card);
  });

  bindCartEvents();
  renderSummary();
}

function bindCartEvents() {
  const cart = readJson("cart", []);
  document.querySelectorAll(".cart-product").forEach((card) => {
    const index = Number(card.dataset.index);

    card.querySelector(".item-checkbox")?.addEventListener("change", (event) => {
      if (event.target.checked) selectedIndexes.add(index);
      else selectedIndexes.delete(index);
      card.classList.toggle("selected", event.target.checked);
      renderSummary();
    });

    card.addEventListener("click", (event) => {
      if (!window.matchMedia("(min-width: 1024px)").matches) return;
      if (event.target.closest("button") || event.target.closest(".item-check")) return;
      const cb = card.querySelector(".item-checkbox");
      if (!cb) return;
      cb.checked = !cb.checked;
      cb.dispatchEvent(new Event("change"));
    });

    card.querySelector(".increase")?.addEventListener("click", () => {
      cart[index].quantity += 1;
      writeJson("cart", cart);
      renderCart();
    });

    card.querySelector(".decrease")?.addEventListener("click", () => {
      if (cart[index].quantity > 1) cart[index].quantity -= 1;
      writeJson("cart", cart);
      renderCart();
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setupMenuClose();
  setupThemeToggle();
  renderCart();
});