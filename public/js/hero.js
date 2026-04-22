/* ============================================================
   hero.js — Hero section slider
   initHeroSlider() is called by index.js after slides are built
   from featured products.
   ============================================================ */

function initHeroSlider() {
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

    // remove old listeners by cloning buttons
    if (prevBtn) {
        const newPrev = prevBtn.cloneNode(true);
        prevBtn.replaceWith(newPrev);
        newPrev.addEventListener("click", () => { prev(); startAuto(); });
    }
    if (nextBtn) {
        const newNext = nextBtn.cloneNode(true);
        nextBtn.replaceWith(newNext);
        newNext.addEventListener("click", () => { next(); startAuto(); });
    }

    showSlide(0);
    startAuto();
}

// fallback: also run on DOMContentLoaded in case slides are pre-rendered
document.addEventListener("DOMContentLoaded", () => {
    const slider = document.querySelector(".hero-slider");
    if (slider && slider.querySelectorAll(".carousel-layer").length > 0) {
        initHeroSlider();
    }
});