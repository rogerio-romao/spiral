/**
 * Utility functions for generating random numbers and colors.
 * Provides functions to create random integers, RGBA/P3 colors, and color palettes.
 * Supports both RGBA and P3 color spaces based on browser capabilities.
 * @module randomUtils
 */

/**
 * Generate a random integer between min (inclusive) and max (exclusive).
 * @param {number} min - Minimum integer value (inclusive).
 * @param {number} max - Maximum integer value (exclusive).
 * @returns {number} Random integer between min and max.
 */
export function random(min, max) {
    const num = Math.floor(Math.random() * (max - min)) + min;
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
    const r = random(minC, maxC) / 255;
    const g = random(minC, maxC) / 255;
    const b = random(minC, maxC) / 255;
    const a = Number((Math.random() * (maxA - minA) + minA).toFixed(3));

    // detect if the browser support p3 color space and use it if available, otherwise fallback to rgba
    if (
        globalThis.CSS &&
        CSS.supports('color', 'color(display-p3 1 0 0 / 1)')
    ) {
        return `color(display-p3 ${r} ${g} ${b} / ${a})`;
    }

    return `rgba(${r}, ${g}, ${b}, ${a})`;
}

/**
 * Generate an array of random RGBA colors.
 * Delegates to randomColor, accepts same parameters.
 * @param {number} count - Number of colors to generate.
 * @param {number} [minC] - Minimum color value (0-255).
 * @param {number} [maxC] - Maximum color value (0-255).
 * @param {number} [minA] - Minimum alpha value (0-1).
 * @param {number} [maxA] - Maximum alpha value (0-1).
 * @returns {string[]} Array of RGBA color strings.
 */
export function generateRGBAPalette(
    count,
    minC = 0,
    maxC = 255,
    minA = 0.5,
    maxA = 1,
) {
    const palette = [];
    for (let i = 0; i < count; i++) {
        palette.push(randomColor(minC, maxC, minA, maxA));
    }
    return palette;
}

/**
 * Generate an array of HSLA color strings, varying one property equally across the range with wrap-around.
 * @param {number} count - Number of colors to generate.
 * @param {'hue'|'saturation'|'luminosity'|'alpha'|'random'} [mode] - Which property to vary (defaults to 'hue').
 * @param {number|null} [degrees] - Optional step in degrees for hue mode (overrides automatic calculation).
 * @returns {string[]} Array of HSLA color strings.
 */
export function generateHSLAPalette(count, mode = 'hue', degrees = null) {
    // Random base values
    const baseHue = Math.floor(Math.random() * 360);
    const baseSat = Math.floor(Math.random() * 101);
    const baseLum = Math.floor(Math.random() * 101);
    // 0.1–1 alpha range to avoid fully transparent colors that can be invisible in some contexts
    const baseAlpha = Math.random() * 0.9 + 0.1;

    const palette = [];
    for (let i = 0; i < count; i++) {
        let hue = baseHue;
        let sat = baseSat;
        let lum = baseLum;
        let alpha = baseAlpha;

        if (mode === 'hue') {
            const step = degrees === null ? 360 / count : degrees;
            hue = (baseHue + i * step) % 360;
        } else if (mode === 'saturation') {
            sat = (baseSat + i * (100 / count)) % 101;
        } else if (mode === 'luminosity') {
            lum = (baseLum + i * (100 / count)) % 101;
        } else if (mode === 'alpha') {
            // Wrap alpha between 0.1 and 1
            const step = 0.9 / count;
            alpha = baseAlpha + i * step;
            if (alpha > 1) {
                alpha = 0.1 + (alpha - 1);
            }
        } else if (mode === 'random') {
            hue = Math.floor(Math.random() * 360);
            sat = Math.floor(Math.random() * 101);
            lum = Math.floor(Math.random() * 101);
            alpha = Math.random() * 0.9 + 0.1;
        }

        palette.push(
            `hsla(${Math.round(hue)}, ${Math.round(sat)}%, ${Math.round(lum)}%, ${alpha.toFixed(3)})`,
        );
    }
    return palette;
}
