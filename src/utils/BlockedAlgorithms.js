const STORAGE_KEY = 'spiral:blockedAlgorithms';

/**
 * Load the blocked algorithms list from localStorage.
 * Returns an empty array if nothing is saved, the data is corrupt, or any
 * entry fails validation.
 * @returns {string[]} Array of blocked algorithm class names.
 */
export function loadBlockedAlgorithms() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
            return [];
        }

        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) {
            return [];
        }

        return parsed.filter((entry) => typeof entry === 'string');
    } catch {
        return [];
    }
}

/**
 * Persist the blocked algorithms list to localStorage.
 * Errors are silently swallowed so storage failures never crash the app.
 * @param {string[]} names - Algorithm class names to block.
 */
export function saveBlockedAlgorithms(names) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(names));
    } catch {
        // localStorage unavailable or quota exceeded — fail silently
    }
}

/**
 * Remove the blocked algorithms list from localStorage.
 * Errors are silently swallowed.
 */
export function clearBlockedAlgorithms() {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch {
        // localStorage unavailable — fail silently
    }
}
