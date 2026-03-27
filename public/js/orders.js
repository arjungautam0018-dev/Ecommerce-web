window.toggleMenu = function toggleMenu() {
  const menu = document.querySelector(".quickies");
  if (menu) menu.classList.toggle("show");
};

const orders = [
  {
    id: "ORD123",
    status: "pending",
    orderDate: "25 Mar 2026",
    arrivingDate: "28 Mar 2026",

    items: [
      {
        name: "Nike Shoes",
        quantity: 2,
        price: 2500,
        image: "/resources/frame1.jpg"
      }
    ],

    city: "Kathmandu",
    street: "Baneshwor, Street 3",

    paymentStatus: "paid",
    paymentMethod: "eSewa"
  },

  {
    id: "ORD123",
    status: "pending",
    orderDate: "25 Mar 2026",
    arrivingDate: "28 Mar 2026",

    items: [
      {
        name: "Nike Shoes",
        quantity: 2,
        price: 2500,
        image: "/resources/frame1.jpg"
      }
    ],

    city: "Kathmandu",
    street: "Baneshwor, Street 3",

    paymentStatus: "paid",
    paymentMethod: "eSewa"
  },
  {
    id: "ORD123",
    status: "pending",
    orderDate: "25 Mar 2026",
    arrivingDate: "28 Mar 2026",

    items: [
      {
        name: "Nike Shoes",
        quantity: 2,
        price: 2500,
        image: "/resources/frame1.jpg"
      }
    ],

    city: "Kathmandu",
    street: "Baneshwor, Street 3",

    paymentStatus: "paid",
    paymentMethod: "eSewa"
  },
  {
    id: "ORD123",
    status: "pending",
    orderDate: "25 Mar 2026",
    arrivingDate: "28 Mar 2026",

    items: [
      {
        name: "Nike Shoes",
        quantity: 2,
        price: 2500,
        image: "/resources/frame1.jpg"
      }
    ],

    city: "Kathmandu",
    street: "Baneshwor, Street 3",

    paymentStatus: "paid",
    paymentMethod: "eSewa"
  },
  {
    id: "ORD123",
    status: "pending",
    orderDate: "25 Mar 2026",
    arrivingDate: "28 Mar 2026",

    items: [
      {
        name: "Nike Shoes",
        quantity: 2,
        price: 2500,
        image: "/resources/frame1.jpg"
      }
    ],

    city: "Kathmandu",
    street: "Baneshwor, Street 3",

    paymentStatus: "paid",
    paymentMethod: "eSewa"
  },
  {
    id: "ORD123",
    status: "pending",
    orderDate: "25 Mar 2026",
    arrivingDate: "28 Mar 2026",

    items: [
      {
        name: "Nike Shoes",
        quantity: 2,
        price: 2500,
        image: "/resources/frame1.jpg"
      }
    ],

    city: "Kathmandu",
    street: "Baneshwor, Street 3",

    paymentStatus: "paid",
    paymentMethod: "eSewa"
  },
  {
    id: "ORD123",
    status: "pending",
    orderDate: "25 Mar 2026",
    arrivingDate: "28 Mar 2026",

    items: [
      {
        name: "Nike Shoes",
        quantity: 2,
        price: 2500,
        image: "/resources/frame1.jpg"
      }
    ],

    city: "Kathmandu",
    street: "Baneshwor, Street 3",

    paymentStatus: "paid",
    paymentMethod: "eSewa"
  },
  {
    id: "ORD123",
    status: "pending",
    orderDate: "25 Mar 2026",
    arrivingDate: "28 Mar 2026",

    items: [
      {
        name: "Nike Shoes",
        quantity: 2,
        price: 2500,
        image: "/resources/frame1.jpg"
      }
    ],

    city: "Kathmandu",
    street: "Baneshwor, Street 3",

    paymentStatus: "paid",
    paymentMethod: "eSewa"
  },
];

const container = document.getElementById("ordersContainer");

/* FILTER ONLY PENDING */
const pendingOrders = orders.filter(order => order.status === "pending");

/* LOOP + CREATE CARD */
pendingOrders.forEach(order => {

  const card = document.createElement("div");
  card.className = "order-card";

  /* ITEMS HTML */
  const itemsHTML = order.items.map(item => `
    <div class="item">
      <img src="${item.image}" />
      <div>
        <p class="name">${item.name}</p>
        <p class="details">Qty: ${item.quantity} × रू. ${item.price}</p>
      </div>
    </div>
  `).join("");

  card.innerHTML = `
    <div class="order-top">
      <span>#${order.id}</span>
      <span class="status pending">Pending</span>
    </div>

    <div class="order-items">
      ${itemsHTML}
    </div>

<div class="order-info">
  <p><strong>Order:</strong> ${order.orderDate}</p>
  <p><strong>Arriving:</strong> ${order.arrivingDate}</p>
  <p><strong>City:</strong> ${order.city}</p>
<p class="street"><strong>Street:</strong> ${order.street}</p></div>

    <div class="order-bottom">
      <span class="payment ${order.paymentStatus}">
        ${order.paymentStatus === "paid" ? "Paid" : "Cash"} (${order.paymentMethod})
      </span>
      <span class="total">
        रू. ${order.items.reduce((sum, i) => sum + i.price * i.quantity, 0)}
      </span>
    </div>
  `;

  container.appendChild(card);
});


const themeBtn = document.querySelector(".theme-toggle");

themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  // save preference
  if (document.body.classList.contains("dark")) {
    localStorage.setItem("theme", "dark");
  } else {
    localStorage.setItem("theme", "light");
  }
});

/* LOAD SAVED THEME */
window.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark");
  }
});