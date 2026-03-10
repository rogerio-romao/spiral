// @vitest-environment jsdom

import { loadPreferences, savePreference } from '../../src/utils/UserPreferences.js';

const STORAGE_KEY = 'spiral:preferences';

const DEFAULTS = {
    autoChangeIntervalInSeconds: 60,
    isInManualMode: false,
    showPlayer: true,
    showTips: true,
    showWaveform: false,
    silenceMessages: false,
};

describe('user preferences', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    describe('loadPreferences()', () => {
        it('returns defaults when localStorage is empty', () => {
            expect(loadPreferences()).toStrictEqual(DEFAULTS);
        });

        it('returns stored values merged with defaults', () => {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify({ isInManualMode: true, showPlayer: false }),
            );

            expect(loadPreferences()).toStrictEqual({
                ...DEFAULTS,
                isInManualMode: true,
                showPlayer: false,
            });
        });

        it('returns defaults when localStorage contains corrupt JSON', () => {
            localStorage.setItem(STORAGE_KEY, 'not-valid-json{{{');

            expect(loadPreferences()).toStrictEqual(DEFAULTS);
        });

        it('clamps autoChangeIntervalInSeconds below minimum to 10', () => {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ autoChangeIntervalInSeconds: 5 }));

            expect(loadPreferences().autoChangeIntervalInSeconds).toBe(10);
        });

        it('clamps autoChangeIntervalInSeconds above maximum to 300', () => {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ autoChangeIntervalInSeconds: 999 }));

            expect(loadPreferences().autoChangeIntervalInSeconds).toBe(300);
        });

        it('uses default interval when value is not a number', () => {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify({ autoChangeIntervalInSeconds: 'fast' }),
            );

            expect(loadPreferences().autoChangeIntervalInSeconds).toBe(60);
        });

        it('coerces stored values to booleans', () => {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify({ isInManualMode: 'yes', showPlayer: 0, silenceMessages: 1 }),
            );
            const prefs = loadPreferences();

            expect(prefs.showPlayer).toBeFalsy();
            expect(prefs.silenceMessages).toBeTruthy();
            expect(prefs.isInManualMode).toBeTruthy();
        });

        it('returns all defaults correctly when stored data contains only unknown keys', () => {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ unknownKey: 'something' }));
            const prefs = loadPreferences();

            expect(prefs).toMatchObject(DEFAULTS);
        });
    });

    describe('savePreference()', () => {
        it('persists a preference to localStorage', () => {
            savePreference('showPlayer', false);
            const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));

            expect(stored.showPlayer).toBeFalsy();
        });

        it('does not clobber other saved preferences', () => {
            savePreference('isInManualMode', true);
            savePreference('showPlayer', false);
            const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));

            expect(stored.showPlayer).toBeFalsy();
            expect(stored.isInManualMode).toBeTruthy();
            expect(stored.showTips).toBeUndefined();
        });

        it('overwrites a previously saved value for the same key', () => {
            savePreference('autoChangeIntervalInSeconds', 120);
            savePreference('autoChangeIntervalInSeconds', 180);
            const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));

            expect(stored.autoChangeIntervalInSeconds).toBe(180);
        });

        it('does not throw when localStorage throws', () => {
            vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
                throw new DOMException('QuotaExceededError');
            });

            expect(() => savePreference('showPlayer', false)).not.toThrow();

            vi.restoreAllMocks();
        });
    });
});
