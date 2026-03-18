function toggleMenu(){
    document.querySelector(".quickies").classList.toggle("show");
}
document.addEventListener("click", function(e){
    const menu = document.querySelector(".quickies");
    const hamburger = document.querySelector(".hamburger");

    if (!hamburger.contains(e.target) && !menu.contains(e.target)) {
        menu.classList.remove("show");
    }
});

const layers = document.querySelectorAll('.constant-change .gradient-layer');
let current = 0;
layers[current].classList.add('active');

setInterval(() => {
    layers[current].classList.remove('active');
    current = (current + 1) % layers.length;
    layers[current].classList.add('active');
}, 5000);


const productsList = [
  {
    title: "Custom Frame",
    desc: "A personalized frame for photos or artwork, perfect as a gift or for home decoration.",
    price: "Rs.2,499",
    img: "/resources/frame1.jpg"
  },
  {
    title: "Custom Frame",
    desc: "A personalized frame for photos or artwork, great for gifts or home decoration.",
    price: "Rs.2,499",
    img: "/resources/frame.webp"
  },
  {
    title: "Stamp Set",
    desc: "Official stamp set suitable for badge programs and office use.",
    price: "Rs.1,299",
    img: "/resources/stamp.jpg"
  },

];

const productsContainer = document.querySelector('.products');
productsList.forEach(product=>{
    const productCard = document.createElement('div');
    productCard.classList.add('product-card');
    productCard.innerHTML = `
                   <img class="products_images" src="${product.img}" alt="Product 1">
            <div class="product-inform">

                <h3>${product.title}</h3>
                <p class="desc-product">${product.desc}</p>
                <p class="price-product">${product.price}</p>
            </div>
            <div class="add-to-cart">
                <button>
                    <i class="fa-solid fa-cart-shopping"></i>
                        Add to Cart
                </button>
            </div>
    `;
    productsContainer.appendChild(productCard);
});

const productsContainer2 = document.querySelector('.products2');
productsList.forEach(product=>{
    const productCard = document.createElement('div');
    productCard.classList.add('product-card');
    productCard.innerHTML = `
                   <img class="products_images" src="${product.img}" alt="Product 1">
            <div class="product-inform">

                <h3>${product.title}</h3>
                <p class="desc-product">${product.desc}</p>
                <p class="price-product">${product.price}</p>
            </div>
            <div class="add-to-cart">
                <button>
                    <i class="fa-solid fa-cart-shopping"></i>
                        Add to Cart
                </button>
            </div>
    `;
    productsContainer2.appendChild(productCard);
});


// index.js (add at the end of your current code)

// Select all Add to Cart buttons
function setupAddToCartButtons() {
    const buttons = document.querySelectorAll('.add-to-cart button');

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.product-card');
            const title = card.querySelector('h3').textContent;
            const priceText = card.querySelector('.price-product').textContent;
            const img = card.querySelector('.products_images').src;

            const price = parseInt(priceText.replace(/[^0-9]/g, ''));

            // Get cart from localStorage
            let cart = JSON.parse(localStorage.getItem('cart')) || [];

            // Check if item already exists
            const existing = cart.find(item => item.title === title);
            if (existing) {
                existing.quantity += 1;
            } else {
                cart.push({
                    title,
                    price,
                    img,
                    quantity: 1
                });
            }

            localStorage.setItem('cart', JSON.stringify(cart));
            alert(`${title} added to cart`);
        });
    });
}

setupAddToCartButtons();