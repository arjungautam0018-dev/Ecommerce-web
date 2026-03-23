const playSuccessSound = () => {
    const sound = document.getElementById('success-sound');
    if (sound) {
        sound.volume = 0.5;
        sound.play().catch(err => console.log("Still blocked:", err));
    }
};

// 1. Try to play on load (works if user interacted with the site on the previous page)
window.addEventListener('load', () => {
    playSuccessSound();
});

// 2. Fallback: Play on the first click/touch anywhere on the page
document.addEventListener('click', () => {
    playSuccessSound();
}, { once: true }); // 'once' ensures it doesn't play every time they click

function toggleMenu() {
    document.querySelector('.quickies').classList.toggle('show');
}