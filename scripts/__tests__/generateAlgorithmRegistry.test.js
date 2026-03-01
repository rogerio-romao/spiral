import { buildFileContents, toIdentifier } from '../generateAlgorithmRegistry.mjs';

describe('generateAlgorithmRegistry helpers', () => {
    describe('toIdentifier', () => {
        it('strips the .js extension', () => {
            expect(toIdentifier('MyAlgorithm.js')).toBe('MyAlgorithm');
        });

        it('accepts names starting with underscore', () => {
            expect(toIdentifier('_Private.js')).toBe('_Private');
        });

        it('accepts names starting with dollar sign', () => {
            expect(toIdentifier('$Special.js')).toBe('$Special');
        });

        it('accepts names with numbers (not at start)', () => {
            expect(toIdentifier('Algo123.js')).toBe('Algo123');
        });

        it('throws for names with hyphens', () => {
            expect(() => toIdentifier('bad-name.js')).toThrow();
        });

        it('throws for names starting with a digit', () => {
            expect(() => toIdentifier('1Algorithm.js')).toThrow();
        });

        it('throws for names with spaces', () => {
            expect(() => toIdentifier('My Algo.js')).toThrow();
        });
    });

    describe('buildFileContents', () => {
        it('generates import lines for each file', () => {
            const { importLines } = buildFileContents(['Algo1.js', 'Algo2.js']);
            expect(importLines).toEqual([
                "import Algo1 from '../algos/Algo1.js';",
                "import Algo2 from '../algos/Algo2.js';",
            ]);
        });

        it('generates array lines for each file', () => {
            const { arrayLines } = buildFileContents(['Algo1.js', 'Algo2.js']);
            expect(arrayLines).toEqual(['    Algo1,', '    Algo2,']);
        });

        it('returns empty arrays for empty input', () => {
            const { arrayLines, importLines } = buildFileContents([]);
            expect(importLines).toEqual([]);
            expect(arrayLines).toEqual([]);
        });

        it('throws when a filename is not a valid identifier', () => {
            expect(() => buildFileContents(['bad-name.js'])).toThrow();
        });
    });
});
