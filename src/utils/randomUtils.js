export function random(min, max) {
    const num = Math.floor(Math.random() * (max - min)) + min;
    return num;
}

export function randomColor(minC = 0, maxC = 255, minA = 0.1, maxA = 1) {
    const r = random(minC, maxC);
    const g = random(minC, maxC);
    const b = random(minC, maxC);
    const a = +(Math.random() * (maxA - minA) + minA).toFixed(3);
    return `rgba(${r}, ${g}, ${b}, ${a})`;
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
 * @param {string} [mode='hue'] - Which property to vary: 'hue', 'saturation', 'luminosity', 'alpha', 'random' (defaults to 'hue').
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
