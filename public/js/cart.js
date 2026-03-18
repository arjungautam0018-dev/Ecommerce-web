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