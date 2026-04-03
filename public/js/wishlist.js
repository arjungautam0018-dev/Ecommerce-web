document.addEventListener("DOMContentLoaded", async () => {


/* ============================================================
   SECTION 1 — AUTH-AWARE FETCH
   All API calls go through apiFetch.
   401 → redirect to /login immediately.
   ============================================================ */

    async function apiFetch(url, options = {}) {
        const res = await fetch(url, { credentials: "include", ...options });
        if (res.status === 401) {
            window.location.href = "/login";
            throw new Error("Unauthenticated");
        }
        return res;
    }


/* ============================================================
   SECTION 2 — THEME TOGGLE
   Reads from localStorage, applies on load, toggles on click.
   ============================================================ */

    const ICONS = {
        sun: `<svg class="menu-item-icon" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g fill="#ffe62e">
                <path d="M20.5 59.7l7-7.2c-2.5-.5-4.8-1.5-6.9-2.9l-.1 10.1"/>
                <path d="M43.5 4.3l-7 7.2c2.5.5 4.8 1.5 6.9 2.9l.1-10.1"/>
                <path d="M4.3 43.5l10.1-.1C13 41.3 12 39 11.5 36.5l-7.2 7"/>
                <path d="M59.7 20.5l-10.1.1c1.3 2.1 2.3 4.4 2.9 6.9l7.2-7"/>
            </g>
            <circle cx="32" cy="32" r="19" fill="#ffce31"/>
        </svg>`,
        moon: `<svg class="menu-item-icon" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
        </svg>`,
    };

    const themeButton = document.querySelector(".theme-toggle");
    if (themeButton) {
        const iconContainer = themeButton.querySelector(".icon");
        const savedTheme    = localStorage.getItem("theme") ||
            (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

        applyTheme(savedTheme);

        themeButton.addEventListener("click", (e) => {
            e.preventDefault();
            document.body.classList.toggle("theme-dark");
            const newTheme = document.body.classList.contains("theme-dark") ? "dark" : "light";
            localStorage.setItem("theme", newTheme);
            applyTheme(newTheme);
        });

        function applyTheme(theme) {
            if (theme === "dark") {
                document.body.classList.add("theme-dark");
                if (iconContainer) iconContainer.innerHTML = ICONS.moon;
            } else {
                document.body.classList.remove("theme-dark");
                if (iconContainer) iconContainer.innerHTML = ICONS.sun;
            }
        }
    }


/* ============================================================
   SECTION 3 — HAMBURGER MENU
   Toggles .show on .quickies, closes on outside click.
   ============================================================ */

    window.toggleMenu = function () {
        document.querySelector(".quickies")?.classList.toggle("show");
    };

    const hamburger = document.querySelector(".hamburger");
    const navMenu   = document.querySelector(".quickies");

    document.addEventListener("click", (e) => {
        if (navMenu && hamburger && !hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove("show");
        }
    });


/* ============================================================
   SECTION 4 — TOAST NOTIFICATION
   Small non-blocking feedback message at top-right.
   ============================================================ */

    function showToast(msg, isError = false) {
        let toast = document.getElementById("_wishlistToast");
        if (!toast) {
            toast = document.createElement("div");
            toast.id        = "_wishlistToast";
            toast.className = "toast";
            document.body.appendChild(toast);
        }
        toast.textContent        = msg;
        toast.style.background   = isError ? "#ef4444" : "#021024";
        toast.classList.add("show");
        setTimeout(() => toast.classList.remove("show"), 2500);
    }


/* ============================================================
   SECTION 5 — WISHLIST DATA FETCH
   GET /api/wishlist → array of items from DB.
   401 → redirect to /login.
   ============================================================ */

    let wishlistItems = [];

    async function fetchWishlist() {
        const res  = await apiFetch("/api/wishlist");
        const data = await res.json();
        return data.items || [];
    }

    try {
        wishlistItems = await fetchWishlist();
    } catch (err) {
        console.error("[wishlist] fetch failed:", err);
        return;
    }


/* ============================================================
   SECTION 6 — RENDER WISHLIST CARDS
   Builds card HTML for each item.
   Empty state shown when no items.
   ============================================================ */

    const root = document.getElementById("wishlistProducts");

    function renderWishlist() {
        if (!root) return;
        root.innerHTML = "";

        if (!wishlistItems.length) {
            root.innerHTML = `<div class="empty-state">Your wishlist is empty. Add products from the home or category pages.</div>`;
            return;
        }

        wishlistItems.forEach(item => {
            const card = document.createElement("article");
            card.className    = "wishlist-card";
            card.dataset.title = item.title;
            card.innerHTML = `
                <img src="${item.img || ''}" alt="${item.title}" loading="lazy">
                <div class="wishlist-card-body">
                    <h3>${item.title}</h3>
                    <p>${item.desc || "Saved item from your product list."}</p>
                    <div class="wishlist-price">Rs.${(item.price || 0).toLocaleString()}</div>
                    <div class="wishlist-actions">
                        <button class="move-cart-btn" data-title="${item.title}">Add to Cart</button>
                        <button class="remove-btn"    data-title="${item.title}">Remove</button>
                    </div>
                </div>
            `;
            root.appendChild(card);
        });
    }

    renderWishlist();


/* ============================================================
   SECTION 7 — ADD TO CART (move from wishlist)
   POST /api/wishlist/move-to-cart
   Removes item from wishlist after adding to cart.
   ============================================================ */

    root?.addEventListener("click", async (e) => {
        const cartBtn   = e.target.closest(".move-cart-btn");
        const removeBtn = e.target.closest(".remove-btn");

        if (cartBtn) {
            const title = cartBtn.dataset.title;
            cartBtn.disabled    = true;
            cartBtn.textContent = "Adding…";

            try {
                const res = await apiFetch("/api/wishlist/move-to-cart", {
                    method:  "POST",
                    headers: { "Content-Type": "application/json" },
                    body:    JSON.stringify({ title })
                });

                if (!res.ok) {
                    const err = await res.json();
                    showToast(err.message || "Failed to add to cart", true);
                    cartBtn.disabled    = false;
                    cartBtn.textContent = "Add to Cart";
                    return;
                }

                const data    = await res.json();
                wishlistItems = data.items;
                showToast(`${title} added to cart`);
                renderWishlist();

            } catch (err) {
                console.error("[move-to-cart] error:", err);
                cartBtn.disabled    = false;
                cartBtn.textContent = "Add to Cart";
            }
        }


/* ============================================================
   SECTION 8 — REMOVE FROM WISHLIST
   DELETE /api/wishlist/remove
   Re-renders the list after removal.
   ============================================================ */

        if (removeBtn) {
            const title = removeBtn.dataset.title;
            removeBtn.disabled    = true;
            removeBtn.textContent = "Removing…";

            try {
                const res = await apiFetch("/api/wishlist/remove", {
                    method:  "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body:    JSON.stringify({ title })
                });

                if (!res.ok) {
                    const err = await res.json();
                    showToast(err.message || "Failed to remove", true);
                    removeBtn.disabled    = false;
                    removeBtn.textContent = "Remove";
                    return;
                }

                const data    = await res.json();
                wishlistItems = data.items;
                showToast(`${title} removed`);
                renderWishlist();

            } catch (err) {
                console.error("[remove] error:", err);
                removeBtn.disabled    = false;
                removeBtn.textContent = "Remove";
            }
        }
    });


});
