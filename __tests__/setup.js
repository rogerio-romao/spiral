/**
 * This file sets up global variables and mocks for tests that run in the jsdom environment.
 */

// oxlint-disable promise/prefer-await-to-callbacks
globalThis.gsap = null;
if (!globalThis.requestAnimationFrame) {
    globalThis.requestAnimationFrame = (cb) => setTimeout(() => cb(Date.now()), 16);
}
if (!globalThis.cancelAnimationFrame) {
    globalThis.cancelAnimationFrame = (id) => clearTimeout(id);
}
