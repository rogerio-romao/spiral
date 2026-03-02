import {
    generateHSLAPalette,
    generateRGBAPalette,
    random,
    randomColor,
} from '../../src/utils/randomUtils.js';

describe('randomUtils', () => {
    describe('random function', () => {
        it('returns integers within [min, max)', () => {
            const results = Array.from({ length: 500 }, () => random(5, 15));
            for (const r of results) {
                expect(r).toBeGreaterThanOrEqual(5);
                expect(r).toBeLessThan(15);
                expect(Number.isInteger(r)).toBeTruthy();
            }
        });
    });

    describe('randomColor function', () => {
        afterEach(() => {
            delete globalThis.CSS;
        });

        it('returns an rgba string when CSS.supports is unavailable', () => {
            const color = randomColor();
            expect(color).toMatch(/^rgba\(/);
        });

        it('returns an rgba string when CSS.supports returns false', () => {
            globalThis.CSS = { supports: () => false };
            const color = randomColor();
            expect(color).toMatch(/^rgba\(/);
        });

        it('returns a display-p3 string when CSS.supports returns true', () => {
            globalThis.CSS = { supports: () => true };
            const color = randomColor();
            expect(color).toMatch(/^color\(display-p3/);
        });

        it('accepts custom min/max color and alpha ranges', () => {
            const color = randomColor(100, 200, 0.5, 0.8);
            expect(color).toMatch(/^rgba\(/);
        });
    });

    describe('generateRGBAPalette function', () => {
        it('returns an array of the requested length', () => {
            expect(generateRGBAPalette(5)).toHaveLength(5);
        });

        it('each entry is a color string', () => {
            const palette = generateRGBAPalette(3);
            for (const color of palette) {
                expectTypeOf(color).toBeString();
                expect(color.length).toBeGreaterThan(0);
            }
        });

        it('returns empty array for count 0', () => {
            expect(generateRGBAPalette(0)).toHaveLength(0);
        });
    });

    describe('generateHSLAPalette function', () => {
        it('returns an array of the requested length', () => {
            expect(generateHSLAPalette(6)).toHaveLength(6);
        });

        it('each entry is an hsla string', () => {
            const palette = generateHSLAPalette(4);
            for (const color of palette) {
                expect(color).toMatch(/^hsla\(/);
            }
        });

        it('hue mode spaces hues evenly when degrees is provided', () => {
            const palette = generateHSLAPalette(4, 'hue', 90);
            expect(palette).toHaveLength(4);
            for (const color of palette) {
                expect(color).toMatch(/^hsla\(/);
            }
        });

        it('supports saturation mode', () => {
            expect(generateHSLAPalette(3, 'saturation')).toHaveLength(3);
        });

        it('supports luminosity mode', () => {
            expect(generateHSLAPalette(3, 'luminosity')).toHaveLength(3);
        });

        it('supports alpha mode', () => {
            expect(generateHSLAPalette(3, 'alpha')).toHaveLength(3);
        });

        it('supports random mode', () => {
            expect(generateHSLAPalette(3, 'random')).toHaveLength(3);
        });
    });
});
