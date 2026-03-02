import { buildFileContents, toIdentifier } from '../generateAlgorithmRegistry.mjs';

describe('generateAlgorithmRegistry helpers', () => {
    describe('toIdentifier function', () => {
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
            expect(() => toIdentifier('bad-name.js')).toThrow(
                'Algorithm file "bad-name.js" does not map to a valid JavaScript identifier',
            );
        });

        it('throws for names starting with a digit', () => {
            expect(() => toIdentifier('1Algorithm.js')).toThrow(
                'Algorithm file "1Algorithm.js" does not map to a valid JavaScript identifier',
            );
        });

        it('throws for names with spaces', () => {
            expect(() => toIdentifier('My Algo.js')).toThrow(
                'Algorithm file "My Algo.js" does not map to a valid JavaScript identifier',
            );
        });
    });

    describe('buildFileContents function', () => {
        it('generates import lines for each file', () => {
            const { importLines } = buildFileContents(['Algo1.js', 'Algo2.js']);
            expect(importLines).toStrictEqual([
                "import Algo1 from '../algos/Algo1.js';",
                "import Algo2 from '../algos/Algo2.js';",
            ]);
        });

        it('generates array lines for each file', () => {
            const { arrayLines } = buildFileContents(['Algo1.js', 'Algo2.js']);
            expect(arrayLines).toStrictEqual(['    Algo1,', '    Algo2,']);
        });

        it('returns empty arrays for empty input', () => {
            const { arrayLines, importLines } = buildFileContents([]);
            expect(importLines).toStrictEqual([]);
            expect(arrayLines).toStrictEqual([]);
        });

        it('throws when a filename is not a valid identifier', () => {
            expect(() => buildFileContents(['bad-name.js'])).toThrow(
                'Algorithm file "bad-name.js" does not map to a valid JavaScript identifier',
            );
        });
    });
});
