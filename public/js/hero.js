/* ============================================================
   hero.js — Hero section slider
   - Buttons are direct children of .hero-banner (far edges on desktop)
   - Image fills slider with no box/border
   - Info (title, price, desc) shown below image in .hero-slide-info
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {

    const banner   = document.querySelector(".hero-banner");
    const slider   = document.querySelector(".hero-slider");
    if (!banner || !slider) return;

    const prevBtn  = banner.querySelector(".carousel-btn.prev");
    const nextBtn  = banner.querySelector(".carousel-btn.next");
    const layers   = slider.querySelectorAll(".carousel-layer");
    const infoWrap = document.querySelector(".hero-slide-info");
    const titleEl  = infoWrap?.querySelector(".hero-slide-title");
    const priceEl  = infoWrap?.querySelector(".hero-slide-price");
    const descEl   = infoWrap?.querySelector(".hero-slide-desc");

    if (!layers.length) return;

    let current = 0;
    let timer;

    function updateInfo(index) {
        const layer = layers[index];
        if (titleEl) titleEl.textContent = layer.dataset.title || "";
        if (priceEl) priceEl.textContent = layer.dataset.price || "";
        if (descEl)  descEl.textContent  = layer.dataset.desc  || "";
    }

    function showSlide(index) {
        layers.forEach(l => l.classList.remove("active"));
        layers[index].classList.add("active");
        updateInfo(index);
    }

    function next() {
        current = (current + 1) % layers.length;
        showSlide(current);
    }

    function prev() {
        current = (current - 1 + layers.length) % layers.length;
        showSlide(current);
    }

    function startAuto() {
        clearInterval(timer);
        timer = setInterval(next, 6000);
    }

    if (prevBtn) prevBtn.addEventListener("click", () => { prev(); startAuto(); });
    if (nextBtn) nextBtn.addEventListener("click", () => { next(); startAuto(); });

    showSlide(0);
    startAuto();
});
