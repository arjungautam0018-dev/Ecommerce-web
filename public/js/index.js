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

const themeButton = document.querySelector('.nav-bar-right a'); // moon icon
themeButton.addEventListener('click', function(event) {
    event.preventDefault(); // stop page refresh

    const isDark = document.body.classList.toggle('dark-theme'); // toggle class

    if (isDark) {
        // Dark Theme Colors
        document.body.style.backgroundColor = '#0d1117'; // dark navy
        document.body.style.color = '#e4e6eb'; // soft white

        // Navbar
        document.querySelector('.navbar').style.backgroundColor = '#161b22';
        document.querySelector('.navbar').style.borderBottom = '1px solid rgba(255,255,255,0.1)';

        // Product cards
        document.querySelectorAll('.product-card').forEach(card => {
            card.style.background = '#1b1f27'; // darker card
            card.style.color = '#e4e6eb';
            card.style.border = '1px solid rgba(255,255,255,0.08)';
            card.style.boxShadow = '0 4px 16px rgba(0,0,0,0.4)';
        });

        // Add to cart buttons
        document.querySelectorAll('.add-to-cart button').forEach(btn => {
            btn.style.backgroundColor = '#5c2a9d';
            btn.style.color = '#fff';
        });

        // Category boxes
        document.querySelectorAll('.category').forEach(cat => {
            cat.style.background = 'linear-gradient(135deg, #4b6cb7, #182848)';
            cat.style.color = '#fff';
            cat.style.boxShadow = '0 4px 12px rgba(0,0,0,0.4)';
        });

        // Gradients
        document.querySelectorAll('.gradient-layer').forEach((layer, i) => {
            const darkGradients = [
                'linear-gradient(135deg, #1f1c2c, #928dab)',
                'linear-gradient(135deg, #0f2027, #203a43)',
                'linear-gradient(135deg, #232526, #414345)',
                'linear-gradient(135deg, #3a1c71, #d76d77, #ffaf7b)'
            ];
            layer.style.background = darkGradients[i % darkGradients.length];
        });

        // Overlay
        document.querySelector('.overlay').style.background = 'rgba(0,0,0,0.4)';

        // Quickies dropdown
        document.querySelectorAll('.quickies a').forEach(link => {
            link.style.color = '#e4e6eb';
            link.style.background = '#161b22';
        });

    } else {
        // Light Theme Colors (restore original)
        document.body.style.backgroundColor = '#fff';
        document.body.style.color = '#333';

        document.querySelector('.navbar').style.backgroundColor = '#ffffff';
        document.querySelector('.navbar').style.borderBottom = '1px solid rgba(0,0,0,0.06)';

        document.querySelectorAll('.product-card').forEach(card => {
            card.style.background = '#fff';
            card.style.color = '#333';
            card.style.border = '1px solid rgba(0,0,0,0.08)';
            card.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
        });

        document.querySelectorAll('.add-to-cart button').forEach(btn => {
            btn.style.backgroundColor = '#021024';
            btn.style.color = '#fff';
        });

        document.querySelectorAll('.category').forEach(cat => {
            cat.style.background = '#fff';
            cat.style.color = '#333';
            cat.style.boxShadow = '0 3px 10px rgba(0,0,0,0.05)';
        });

        document.querySelectorAll('.gradient-layer').forEach((layer, i) => {
            const lightGradients = [
                'linear-gradient(135deg, #667eea, #764ba2)',
                'linear-gradient(135deg, #f093fb, #f5576c)',
                'linear-gradient(135deg, #4facfe, #00f2fe)',
                'linear-gradient(135deg, #43e97b, #38f9d7)'
            ];
            layer.style.background = lightGradients[i % lightGradients.length];
        });

        document.querySelector('.overlay').style.background = 'rgba(0,0,0,0.2)';

        document.querySelectorAll('.quickies a').forEach(link => {
            link.style.color = '#333';
            link.style.background = '#fff';
        });
    }
});

document.addEventListener("DOMContentLoaded", () => {

  const layers = document.querySelectorAll('.carousel-layer');
  const prevBtn = document.querySelector('.carousel-btn.prev');
  const nextBtn = document.querySelector('.carousel-btn.next');

  let current = 0;

  function showLayer(index) {
    layers.forEach(layer => layer.classList.remove('active'));
    layers[index].classList.add('active');
  }

  nextBtn.addEventListener('click', () => {
    current = (current + 1) % layers.length;
    showLayer(current);
  });

  prevBtn.addEventListener('click', () => {
    current = (current - 1 + layers.length) % layers.length;
    showLayer(current);
  });

  setInterval(() => {
    current = (current + 1) % layers.length;
    showLayer(current);
  }, 4000);

});