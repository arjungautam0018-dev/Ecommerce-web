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