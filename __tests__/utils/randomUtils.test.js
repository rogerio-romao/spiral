import {
    generateHSLAPalette,
    generateRGBAPalette,
    random,
    randomColor,
} from '../../src/utils/randomUtils.js';

describe('randomUtils', () => {
    describe('random function', () => {
        it('returns integers within [min, max]', () => {
            const results = Array.from({ length: 200 }, () => random(5, 15));

            for (const r of results) {
                expect(r).toBeGreaterThanOrEqual(5);
                expect(r).toBeLessThan(16);
                expect(Number.isInteger(r)).toBeTruthy();
            }
        });

        it('returns min when min == max', () => {
            expect(random(7, 7)).toBe(7);
        });

        it('works when min > max (swaps range)', () => {
            // Should still return a value in [max, min]
            const results = Array.from({ length: 100 }, () => random(10, 5));

            for (const r of results) {
                expect(r).toBeGreaterThanOrEqual(5);
                expect(r).toBeLessThanOrEqual(10);
            }
        });

        it('handles float input by flooring', () => {
            const results = Array.from({ length: 100 }, () => random(1.2, 3.8));

            for (const r of results) {
                expect([1, 2, 3]).toContain(r);
            }
        });

        it('throws TypeError for non-number inputs', () => {
            expect(() => random('a', 5)).toThrow(TypeError);
            expect(() => random(1, 'b')).toThrow(TypeError);
            expect(() => random(null, 5)).toThrow(TypeError);
            expect(() => random(1, {})).toThrow(TypeError);
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

        it('returns the same color if minC == maxC and minA == maxA', () => {
            const color = randomColor(100, 100, 0.5, 0.5);

            expect(color).toMatch(/^rgba\(100, 100, 100, 0.5\)/);
        });

        it('works if minC > maxC and minA > maxA', () => {
            // Should swap internally or still produce a valid color
            const color = randomColor(200, 100, 0.8, 0.5);

            expect(color).toMatch(/^rgba\(/);
        });

        it('does not clamp out-of-bounds values', () => {
            // Should still produce a string, but values may be out of normal range
            const color = randomColor(-50, 300, -1, 2);

            expectTypeOf(color).toBeString();
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

        it('throws TypeError for non-number inputs', () => {
            expect(() => randomColor('a', 255, 0.5, 1)).toThrow(TypeError);
            expect(() => randomColor(0, 'b', 0.5, 1)).toThrow(TypeError);
            expect(() => randomColor(0, 255, 'c', 1)).toThrow(TypeError);
            expect(() => randomColor(0, 255, 0.5, 'd')).toThrow(TypeError);
        });
    });

    describe('generateRGBAPalette function', () => {
        it('returns an array of the requested length', () => {
            expect(generateRGBAPalette(5)).toHaveLength(5);
        });

        it('returns empty array for negative count', () => {
            expect(generateRGBAPalette(-3)).toHaveLength(0);
        });

        it('floors float count', () => {
            expect(generateRGBAPalette(2.7)).toHaveLength(2);
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

        it('accepts custom color and alpha ranges', () => {
            const palette = generateRGBAPalette(3, 50, 150, 0.3, 0.7);

            for (const color of palette) {
                expectTypeOf(color).toBeString();
                expect(color.length).toBeGreaterThan(0);
            }
        });

        it('throws TypeError for non-number inputs', () => {
            expect(() => generateRGBAPalette('a')).toThrow(TypeError);
            expect(() => generateRGBAPalette(5, 'b')).toThrow(TypeError);
            expect(() => generateRGBAPalette(5, 0, 'c')).toThrow(TypeError);
            expect(() => generateRGBAPalette(5, 0, 255, 'd')).toThrow(TypeError);
            expect(() => generateRGBAPalette(5, 0, 255, 0.5, 'e')).toThrow(TypeError);
        });
    });

    describe('generateHSLAPalette function', () => {
        it('returns an array of the requested length', () => {
            expect(generateHSLAPalette(6)).toHaveLength(6);
        });

        it('returns empty array for negative count', () => {
            expect(generateHSLAPalette(-2)).toHaveLength(0);
        });

        it('floors float count', () => {
            expect(generateHSLAPalette(2.9)).toHaveLength(2);
        });

        it('returns default hues for invalid mode', () => {
            // Should default to 'hue' or not throw
            expect(() => generateHSLAPalette(3, 'not-a-mode')).not.toThrow();
            expect(generateHSLAPalette(3, 'not-a-mode')).toHaveLength(3);
        });

        it('handles negative and zero degrees in hue mode', () => {
            expect(generateHSLAPalette(3, 'hue', 0)).toHaveLength(3);
            expect(generateHSLAPalette(3, 'hue', -90)).toHaveLength(3);
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

        it('invalid mode defaults to varying hue', () => {
            const palette = generateHSLAPalette(3, 'invalid-mode');

            expect(palette).toHaveLength(3);
            for (const color of palette) {
                expect(color).toMatch(/^hsla\(/);
            }
        });

        it('throws TypeError for non-number count', () => {
            expect(() => generateHSLAPalette('a')).toThrow(TypeError);
        });

        it('throws TypeError for non-string mode', () => {
            expect(() => generateHSLAPalette(5, 123)).toThrow(TypeError);
        });

        it('throws TypeError for non-number degrees', () => {
            expect(() => generateHSLAPalette(5, 'hue', 'not-a-number')).toThrow(TypeError);
        });
    });
});
