import { init } from './a-star.js';

const canvas = document.getElementById("graph");

let drawer;
let resizeTimeout;
let fading = false;

function redrawAStar() {
  if (!fading && drawer) {
    fading = true;
    drawer.fadeOut();
  }

  clearTimeout(resizeTimeout);
  resizeTimeout = window.setTimeout(() => {
    fading = false;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    // ctx.scale(dpr, dpr);

    drawer = init();
  }, 200);
}

new ResizeObserver(redrawAStar).observe(canvas);
canvas.addEventListener("click", redrawAStar);
