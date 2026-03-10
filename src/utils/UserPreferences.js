const STORAGE_KEY = 'spiral:preferences';

const DEFAULTS = {
    autoChangeIntervalInSeconds: 60,
    isInManualMode: false,
    showPlayer: true,
    showTips: true,
    showWaveform: false,
    silenceMessages: false,
};

const MIN_INTERVAL = 10;
const MAX_INTERVAL = 300;

/**
 * Load user preferences from localStorage, merged with defaults.
 * Corrupt or missing storage returns defaults.
 * @returns {{ autoChangeIntervalInSeconds: number, isInManualMode: boolean, showPlayer: boolean, showWaveform: boolean, silenceMessages: boolean, showTips: boolean }} The merged preferences object with validated values.
 */
export function loadPreferences() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
            return { ...DEFAULTS };
        }

        const stored = JSON.parse(raw);
        const merged = { ...DEFAULTS, ...stored };

        // Validate and clamp the numeric interval
        const interval = Number(merged.autoChangeIntervalInSeconds);
        merged.autoChangeIntervalInSeconds = Number.isFinite(interval)
            ? Math.min(Math.max(interval, MIN_INTERVAL), MAX_INTERVAL)
            : DEFAULTS.autoChangeIntervalInSeconds;

        // Ensure booleans are actual booleans
        merged.isInManualMode = Boolean(merged.isInManualMode);
        merged.showPlayer = Boolean(merged.showPlayer);
        merged.showTips = Boolean(merged.showTips);
        merged.showWaveform = Boolean(merged.showWaveform);
        merged.silenceMessages = Boolean(merged.silenceMessages);

        return merged;
    } catch {
        return { ...DEFAULTS };
    }
}

/**
 * Save a single preference key to localStorage without clobbering other saved values.
 * Errors are silently swallowed so storage failures never crash the app.
 * @param {keyof typeof DEFAULTS} key - The preference key to update.
 * @param {unknown} value - The value to store.
 */
export function savePreference(key, value) {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const stored = raw ? JSON.parse(raw) : {};
        stored[key] = value;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    } catch {
        // localStorage unavailable or quota exceeded — fail silently
    }
}
