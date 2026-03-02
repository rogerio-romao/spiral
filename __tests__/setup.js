// oxlint-disable promise/prefer-await-to-callbacks
globalThis.gsap = null;
globalThis.requestAnimationFrame = (cb) => setTimeout(cb, 0);
globalThis.cancelAnimationFrame = (id) => clearTimeout(id);
