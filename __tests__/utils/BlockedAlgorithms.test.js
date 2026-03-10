// @vitest-environment jsdom

import {
    clearBlockedAlgorithms,
    loadBlockedAlgorithms,
    saveBlockedAlgorithms,
} from '../../src/utils/BlockedAlgorithms.js';

const STORAGE_KEY = 'spiral:blockedAlgorithms';

describe('blockedAlgorithms', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    describe('loadBlockedAlgorithms()', () => {
        it('returns an empty array when localStorage is empty', () => {
            expect(loadBlockedAlgorithms()).toStrictEqual([]);
        });

        it('returns the saved array of algorithm names', () => {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(['AlgoA', 'AlgoB']));

            expect(loadBlockedAlgorithms()).toStrictEqual(['AlgoA', 'AlgoB']);
        });

        it('returns an empty array for corrupt JSON', () => {
            localStorage.setItem(STORAGE_KEY, 'not-valid-json{{{');

            expect(loadBlockedAlgorithms()).toStrictEqual([]);
        });

        it('returns an empty array when stored value is not an array', () => {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ algo: 'AlgoA' }));

            expect(loadBlockedAlgorithms()).toStrictEqual([]);
        });

        it('filters out non-string entries', () => {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(['AlgoA', 42, null, 'AlgoB']));

            expect(loadBlockedAlgorithms()).toStrictEqual(['AlgoA', 'AlgoB']);
        });
    });

    describe('saveBlockedAlgorithms()', () => {
        it('persists an array of algorithm names', () => {
            saveBlockedAlgorithms(['AlgoA', 'AlgoC']);

            expect(JSON.parse(localStorage.getItem(STORAGE_KEY))).toStrictEqual(['AlgoA', 'AlgoC']);
        });

        it('persists an empty array', () => {
            saveBlockedAlgorithms([]);

            expect(JSON.parse(localStorage.getItem(STORAGE_KEY))).toStrictEqual([]);
        });
    });

    describe('clearBlockedAlgorithms()', () => {
        it('removes the key from localStorage', () => {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(['AlgoA']));
            clearBlockedAlgorithms();

            expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
        });

        it('is safe to call when nothing is saved', () => {
            expect(() => clearBlockedAlgorithms()).not.toThrow();
        });
    });

    describe('round-trip', () => {
        it('save then load returns the same names', () => {
            const names = ['Abstractions', 'Wormholes', 'Spirals'];
            saveBlockedAlgorithms(names);

            expect(loadBlockedAlgorithms()).toStrictEqual(names);
        });
    });
});
