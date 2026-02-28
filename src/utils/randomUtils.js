export function random(min, max) {
    const num = Math.floor(Math.random() * (max - min)) + min;
    return num;
}

export function randomColor(minC = 0, maxC = 255, minA = 0.1, maxA = 1) {
    const r = random(minC, maxC) / 255;
    const g = random(minC, maxC) / 255;
    const b = random(minC, maxC) / 255;
    const a = +(Math.random() * (maxA - minA) + minA).toFixed(3);

    // detect if the browser support p3 color space and use it if available, otherwise fallback to rgba
    if (window.CSS && CSS.supports('color', 'color(display-p3 1 0 0 / 1)')) {
        return `color(display-p3 ${r} ${g} ${b} / ${a})`;
    }

    return `rgba(${r}, ${g}, ${b}, ${a})`;
}

/**
 * Convert RGBA to OKLCH
 * @param {number} r - Red (0–255)
 * @param {number} g - Green (0–255)
 * @param {number} b - Blue (0–255)
 * @param {number} a - Alpha (0–1)
 * @returns {{ l: number, c: number, h: number, a: number }}
 */
function rgbaToOklch(r, g, b, a = 1) {
    // Step 1: Normalize RGB to [0, 1]
    let rLin = r / 255;
    let gLin = g / 255;
    let bLin = b / 255;

    // Step 2: Convert sRGB to linear RGB (remove gamma)
    rLin =
        rLin <= 0.04045 ? rLin / 12.92 : Math.pow((rLin + 0.055) / 1.055, 2.4);
    gLin =
        gLin <= 0.04045 ? gLin / 12.92 : Math.pow((gLin + 0.055) / 1.055, 2.4);
    bLin =
        bLin <= 0.04045 ? bLin / 12.92 : Math.pow((bLin + 0.055) / 1.055, 2.4);

    // Step 3: Linear RGB → OKLab (via XYZ intermediate, using Björn Ottosson's matrices)
    const l = 0.4122214708 * rLin + 0.5363325363 * gLin + 0.0514459929 * bLin;
    const m = 0.2119034982 * rLin + 0.6806995451 * gLin + 0.1073969566 * bLin;
    const s = 0.0883024619 * rLin + 0.2817188376 * gLin + 0.6299787005 * bLin;

    const lCbrt = Math.cbrt(l);
    const mCbrt = Math.cbrt(m);
    const sCbrt = Math.cbrt(s);

    const L = 0.2104542553 * lCbrt + 0.793617785 * mCbrt - 0.0040720468 * sCbrt;
    const A = 1.9779984951 * lCbrt - 2.428592205 * mCbrt + 0.4505937099 * sCbrt;
    const B = 0.0259040371 * lCbrt + 0.7827717662 * mCbrt - 0.808675766 * sCbrt;

    // Step 4: OKLab → OKLCH
    const C = Math.sqrt(A * A + B * B);
    let H = Math.atan2(B, A) * (180 / Math.PI);
    if (H < 0) H += 360;

    return {
        l: L, // Lightness  [0, 1]
        c: C, // Chroma     [0, ~0.4]
        h: H, // Hue        [0, 360)
        a: a, // Alpha      [0, 1]
    };
}

function toOklchString(r, g, b, a = 1) {
    const { l, c, h } = rgbaToOklch(r, g, b, a);
    return a < 1
        ? `oklch(${(l * 100).toFixed(2)}% ${c.toFixed(4)} ${h.toFixed(2)} / ${a})`
        : `oklch(${(l * 100).toFixed(2)}% ${c.toFixed(4)} ${h.toFixed(2)})`;
}

/**
 * Generate an array of random RGBA colors.
 * Delegates to randomColor, accepts same parameters.
 * @param {number} count - Number of colors to generate.
 * @param {number} [minC=0] - Minimum color value (0-255).
 * @param {number} [maxC=255] - Maximum color value (0-255).
 * @param {number} [minA=0.5] - Minimum alpha value (0-1).
 * @param {number} [maxA=1] - Maximum alpha value (0-1).
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
 * @typedef {'hue'|'saturation'|'luminosity'|'alpha'|'random'} HSLAMode
 *
 * @param {HSLAMode} [mode='hue'] - Which property to vary (defaults to 'hue').
 * @param {number} [degrees] - Optional step in degrees for hue mode (overrides automatic calculation).
 * @returns {string[]} Array of HSLA color strings.
 */
export function generateHSLAPalette(count, mode = 'hue', degrees) {
    // Random base values
    const baseHue = Math.floor(Math.random() * 360);
    const baseSat = Math.floor(Math.random() * 101);
    const baseLum = Math.floor(Math.random() * 101);
    const baseAlpha = Math.random() * 0.9 + 0.1; // 0.1–1

    const palette = [];
    for (let i = 0; i < count; i++) {
        let hue = baseHue;
        let sat = baseSat;
        let lum = baseLum;
        let alpha = baseAlpha;

        if (mode === 'hue') {
            const step = degrees !== undefined ? degrees : 360 / count;
            hue = (baseHue + i * step) % 360;
        } else if (mode === 'saturation') {
            sat = (baseSat + i * (100 / count)) % 101;
        } else if (mode === 'luminosity') {
            lum = (baseLum + i * (100 / count)) % 101;
        } else if (mode === 'alpha') {
            // Wrap alpha between 0.1 and 1
            let step = 0.9 / count;
            alpha = baseAlpha + i * step;
            if (alpha > 1) alpha = 0.1 + (alpha - 1);
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
