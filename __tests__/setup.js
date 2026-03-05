// oxlint-disable no-undefined
// oxlint-disable promise/prefer-await-to-callbacks
globalThis.gsap = null;
if (globalThis.requestAnimationFrame === undefined) {
    globalThis.requestAnimationFrame = (cb) => setTimeout(() => cb(Date.now()), 16);
}
if (globalThis.cancelAnimationFrame === undefined) {
    globalThis.cancelAnimationFrame = (id) => clearTimeout(id);
}
