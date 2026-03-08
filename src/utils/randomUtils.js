/**
 * Utility functions for generating random numbers and colors.
 * Provides functions to create random integers, RGBA/P3 colors, and color palettes.
 * Supports both RGBA and P3 color spaces based on browser capabilities.
 * @module randomUtils
 */

/**
 * Generate an array of HSLA color strings, varying one property equally across the range with wrap-around.
 * @param {number} count - Number of colors to generate.
 * @param {'hue'|'saturation'|'luminosity'|'alpha'|'random'} [mode] - Which property to vary (defaults to 'hue').
 * @param {number|null} [degrees] - Optional step in degrees for hue mode (overrides automatic calculation).
 * @returns {string[]} Array of length `count` of HSLA color strings.
 */
export function generateHSLAPalette(count, mode = 'hue', degrees = null) {
    if (
        typeof count !== 'number' ||
        typeof mode !== 'string' ||
        (degrees !== null && typeof degrees !== 'number')
    ) {
        throw new TypeError(
            'Count must be a number, mode must be a string, and degrees must be a number or null',
        );
    }

    // Ensure count is a non-negative integer
    const clampedCount = Math.max(0, Math.floor(count));
    // Random base values
    const baseHue = Math.floor(Math.random() * 360);
    const baseSat = Math.floor(Math.random() * 101);
    const baseLum = Math.floor(Math.random() * 101);
    // 0.1–1 alpha range to avoid fully transparent colors that can be invisible in some contexts
    const baseAlpha = Math.random() * 0.9 + 0.1;

    const palette = [];
    for (let i = 0; i < clampedCount; i++) {
        let hue = baseHue;
        let sat = baseSat;
        let lum = baseLum;
        let alpha = baseAlpha;

        if (mode === 'hue') {
            const step = degrees === null ? 360 / clampedCount : degrees;
            hue = (baseHue + i * step) % 360;
        } else if (mode === 'saturation') {
            sat = (baseSat + i * (100 / clampedCount)) % 101;
        } else if (mode === 'luminosity') {
            lum = (baseLum + i * (100 / clampedCount)) % 101;
        } else if (mode === 'alpha') {
            // Wrap alpha between 0.1 and 1
            const step = 0.9 / clampedCount;
            alpha = baseAlpha + i * step;
            if (alpha > 1) {
                alpha = 0.1 + (alpha - 1);
            }
        } else if (mode === 'random') {
            hue = Math.floor(Math.random() * 360);
            sat = Math.floor(Math.random() * 101);
            lum = Math.floor(Math.random() * 101);
            alpha = Math.random() * 0.9 + 0.1;
        } else {
            // If mode is invalid, default to varying hue
            const step = 360 / clampedCount;
            hue = (baseHue + i * step) % 360;
        }

        palette.push(
            `hsla(${Math.round(hue)}, ${Math.round(sat)}%, ${Math.round(lum)}%, ${alpha.toFixed(3)})`,
        );
    }
    return palette;
}

/**
 * Generate an array of random RGBA colors.
 * Delegates to randomColor, accepts these parameters.
 * @param {number} count - Number of colors to generate.
 * @param {number} [minC] - Minimum color value for each channel (0-255).
 * @param {number} [maxC] - Maximum color value for each channel (0-255).
 * @param {number} [minA] - Minimum alpha value (0-1).
 * @param {number} [maxA] - Maximum alpha value (0-1).
 * @returns {string[]} Array of length `count` of RGBA color strings.
 */
export function generateRGBAPalette(count, minC = 0, maxC = 255, minA = 0.5, maxA = 1) {
    if (
        typeof count !== 'number' ||
        typeof minC !== 'number' ||
        typeof maxC !== 'number' ||
        typeof minA !== 'number' ||
        typeof maxA !== 'number'
    ) {
        throw new TypeError('Count and color/alpha range values must be numbers');
    }

    // Ensure count is a non-negative integer
    const clampedCount = Math.max(0, Math.floor(count));
    // Clamp color and alpha values to their respective ranges
    const clampedMinC = Math.max(0, Math.min(255, minC));
    const clampedMaxC = Math.max(0, Math.min(255, maxC));
    const clampedMinA = Math.max(0, Math.min(1, minA));
    const clampedMaxA = Math.max(0, Math.min(1, maxA));

    const palette = [];
    for (let i = 0; i < clampedCount; i++) {
        palette.push(randomColor(clampedMinC, clampedMaxC, clampedMinA, clampedMaxA));
    }
    return palette;
}

/**
 * Generate a random integer between min (inclusive) and max (inclusive).
 * @param {number} min - Minimum integer value (inclusive).
 * @param {number} max - Maximum integer value (inclusive).
 * @returns {number} Random integer between min and max.
 */
export function random(min, max) {
    if (typeof min !== 'number' || typeof max !== 'number') {
        throw new TypeError('Both min and max must be numbers');
    }

    // Ensure min and max are integers
    const flooredMin = Math.floor(min);
    const flooredMax = Math.floor(max);

    const num = Math.floor(Math.random() * (flooredMax - flooredMin + 1)) + flooredMin;
    return num;
}

/**
 * Generate a random RGBA or P3 color string.
 * @param {number} [minC] - Minimum color value (0-255).
 * @param {number} [maxC] - Maximum color value (0-255).
 * @param {number} [minA] - Minimum alpha value (0-1).
 * @param {number} [maxA] - Maximum alpha value (0-1).
 * @returns {string} RGBA or P3 color string.
 */
export function randomColor(minC = 0, maxC = 255, minA = 0.1, maxA = 1) {
    if (
        typeof minC !== 'number' ||
        typeof maxC !== 'number' ||
        typeof minA !== 'number' ||
        typeof maxA !== 'number'
    ) {
        throw new TypeError('All color and alpha values must be numbers');
    }

    // Clamp color and alpha values to their respective ranges
    const clampedMinC = Math.max(0, Math.min(255, minC));
    const clampedMaxC = Math.max(0, Math.min(255, maxC));
    const clampedMinA = Math.max(0, Math.min(1, minA));
    const clampedMaxA = Math.max(0, Math.min(1, maxA));

    const r = random(clampedMinC, clampedMaxC);
    const g = random(clampedMinC, clampedMaxC);
    const b = random(clampedMinC, clampedMaxC);
    const a = Number((Math.random() * (clampedMaxA - clampedMinA) + clampedMinA).toFixed(3));

    // detect if the browser support p3 color space and use it if available, otherwise fallback to rgba
    if (globalThis.CSS && CSS.supports('color', 'color(display-p3 1 0 0 / 1)')) {
        const rP3 = r / 255;
        const gP3 = g / 255;
        const bP3 = b / 255;
        return `color(display-p3 ${rP3.toFixed(3)} ${gP3.toFixed(3)} ${bP3.toFixed(3)} / ${a})`;
    }

    return `rgba(${r}, ${g}, ${b}, ${a})`;
}
