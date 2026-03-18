document.addEventListener('DOMContentLoaded', () => {

    // Toggle menu
    function toggleMenu() {
        document.querySelector(".quickies").classList.toggle("show");
    }
    document.querySelector(".hamburger").addEventListener('click', toggleMenu);

    document.addEventListener("click", function(e){
        const menu = document.querySelector(".quickies");
        const hamburger = document.querySelector(".hamburger");

        if (!hamburger.contains(e.target) && !menu.contains(e.target)) {
            menu.classList.remove("show");
        }
    });

    // Cart products
    const cartProducts = document.querySelectorAll('.cart-product');

    cartProducts.forEach(product => {
        const decreaseBtn = product.querySelector('.decrease');
        const increaseBtn = product.querySelector('.increase');
        const quantityValue = product.querySelector('.quantity-value');
        const totalPrice = product.querySelector('.total h3');
        const priceText = product.querySelector('.details p').textContent;

        // Extract unit price correctly
        let unitPrice = parseInt(priceText.replace(/\D/g, ''));

        // Update the total price
        const updateTotal = () => {
            const quantity = parseInt(quantityValue.textContent);
            const total = unitPrice * quantity;
            totalPrice.textContent = `Total: Rs.${total.toLocaleString()}`;
        }

        // Increase quantity
        increaseBtn.addEventListener('click', () => {
            let quantity = parseInt(quantityValue.textContent);
            quantity++;
            quantityValue.textContent = quantity;
            updateTotal();
        });

        // Decrease quantity
        decreaseBtn.addEventListener('click', () => {
            let quantity = parseInt(quantityValue.textContent);
            if (quantity > 1) {
                quantity--;
                quantityValue.textContent = quantity;
                updateTotal();
            }
        });

        // Initialize total price on page load
        updateTotal();
    });

});


// cart.js

document.addEventListener('DOMContentLoaded', () => {
    const cartContainer = document.querySelector('.cart-products');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    cartContainer.innerHTML = ''; // clear placeholder

    cart.forEach((item, index) => {
        const productHTML = `
        <div class="cart-product" data-index="${index}">
            <div class="details-product">
                <div class="img-product">
                    <img src="${item.img}" alt="${item.title}">
                </div>
                <div class="details">
                    <h3>${item.title}</h3>
                    <p>Rs.${item.price} each</p>
                </div>
                <div class="delete-product">
                    <svg fill="none" stroke="#000" stroke-width="1.5" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </div>
            </div>
            <div class="add-item">
                <div class="quantity">
                    <button class="decrease">-</button>
                    <span class="quantity-value">${item.quantity}</span>
                    <button class="increase">+</button>
                </div>
            </div>
            <div class="total">
                <h3>Total: Rs.${item.price * item.quantity}</h3>
            </div>
        </div>
        `;
        cartContainer.insertAdjacentHTML('beforeend', productHTML);
    });

    updateCartEvents();
});

function updateCartEvents() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    document.querySelectorAll('.cart-product').forEach(product => {
        const index = product.dataset.index;
        const quantityValue = product.querySelector('.quantity-value');
        const increaseBtn = product.querySelector('.increase');
        const decreaseBtn = product.querySelector('.decrease');
        const deleteBtn = product.querySelector('.delete-product');
        const totalPrice = product.querySelector('.total h3');

        // Increase quantity
        increaseBtn.addEventListener('click', () => {
            cart[index].quantity += 1;
            quantityValue.textContent = cart[index].quantity;
            totalPrice.textContent = `Total: Rs.${cart[index].price * cart[index].quantity}`;
            localStorage.setItem('cart', JSON.stringify(cart));
        });

        // Decrease quantity
        decreaseBtn.addEventListener('click', () => {
            if (cart[index].quantity > 1) {
                cart[index].quantity -= 1;
                quantityValue.textContent = cart[index].quantity;
                totalPrice.textContent = `Total: Rs.${cart[index].price * cart[index].quantity}`;
                localStorage.setItem('cart', JSON.stringify(cart));
            }
        });

        // Delete product
        deleteBtn.addEventListener('click', () => {
            cart.splice(index, 1);
            localStorage.setItem('cart', JSON.stringify(cart));
            product.remove();
            // Re-run event listeners to refresh indices
            updateCartEvents();
        });
    });
}


document.addEventListener('DOMContentLoaded', () => {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const itemsContainer = document.querySelector('.checkout-items');

  let subtotal = 0;
  itemsContainer.innerHTML = '';

  cart.forEach(item => {
    const totalItemPrice = item.price * item.quantity;
    subtotal += totalItemPrice;

    const itemHTML = `
      <div class="checkout-item">
        <img src="${item.img}" alt="${item.title}">
        <div class="checkout-item-details">
          <h4>${item.title}</h4>
          <p>${item.quantity} x Rs.${item.price.toLocaleString()} = Rs.${totalItemPrice.toLocaleString()}</p>
        </div>
      </div>
    `;
    itemsContainer.insertAdjacentHTML('beforeend', itemHTML);
  });

  const tax = Math.round(subtotal * 0.13); // 13% tax example
  const total = subtotal + tax;

  document.getElementById('subtotal').textContent = `Rs.${subtotal.toLocaleString()}`;
  document.getElementById('tax').textContent = `Rs.${tax.toLocaleString()}`;
  document.getElementById('total').textContent = `Rs.${total.toLocaleString()}`;

  document.getElementById('proceed-checkout').addEventListener('click', () => {
    alert('Proceeding to payment...');
  });

  document.getElementById('continue-shopping').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Make products selectable
const cartProductsElements = document.querySelectorAll('.cart-product');
let selectedIndexes = []; // store indices of selected products

cartProductsElements.forEach(product => {
  product.addEventListener('click', (e) => {
    // prevent clicks on +, -, delete buttons from toggling selection
    if (e.target.closest('.increase') || e.target.closest('.decrease') || e.target.closest('.delete-product')) return;

    const index = parseInt(product.dataset.index);

    if (selectedIndexes.includes(index)) {
      // deselect
      selectedIndexes = selectedIndexes.filter(i => i !== index);
      product.classList.remove('selected');
    } else {
      // select
      selectedIndexes.push(index);
      product.classList.add('selected');
    }

    updateCheckoutSummary();
  });
});

// Function to update checkout summary based on selected products
function updateCheckoutSummary() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const itemsContainer = document.querySelector('.checkout-items');
  itemsContainer.innerHTML = '';

  let subtotal = 0;
  selectedIndexes.forEach(i => {
    const item = cart[i];
    const totalItemPrice = item.price * item.quantity;
    subtotal += totalItemPrice;

    const itemHTML = `
      <div class="checkout-item">
        <img src="${item.img}" alt="${item.title}">
        <div class="checkout-item-details">
          <h4>${item.title}</h4>
          <p>${item.quantity} x Rs.${item.price.toLocaleString()} = Rs.${totalItemPrice.toLocaleString()}</p>
        </div>
      </div>
    `;
    itemsContainer.insertAdjacentHTML('beforeend', itemHTML);
  });

  const tax = Math.round(subtotal * 0.13); // example 13% tax
  const total = subtotal + tax;

  document.getElementById('subtotal').textContent = `Rs.${subtotal.toLocaleString()}`;
  document.getElementById('tax').textContent = `Rs.${tax.toLocaleString()}`;
  document.getElementById('total').textContent = `Rs.${total.toLocaleString()}`;
}

// Initialize: no selection at first
updateCheckoutSummary();
});
