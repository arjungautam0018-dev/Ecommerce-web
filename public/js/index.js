function toggleMenu(){
    document.querySelector(".quickies").classList.toggle("show");
}


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