const STORAGE_KEY = 'spiral:playlist';

/**
 * @typedef {{ filePath: string, trackName: string }} SavedTrack
 * @typedef {{ tracks: SavedTrack[], currentSongIndex: number }} SavedPlaylist
 */

/**
 * Return true if a value is a well-formed SavedTrack entry.
 * @param {unknown} t - The value to test.
 * @returns {t is SavedTrack} True when the value has string filePath and trackName fields.
 */
function isValidTrack(t) {
    if (t === null || typeof t !== 'object') {
        return false;
    }
    const { filePath, trackName } = /** @type {Record<string, unknown>} */ (t);
    return typeof filePath === 'string' && typeof trackName === 'string';
}

/**
 * Load the saved playlist from localStorage.
 * Returns `null` if nothing has been saved, the data is corrupt, or the top-level
 * structure is invalid. Individual track entries that fail validation are silently
 * filtered out so a partially-corrupt playlist is still usable.
 * @returns {SavedPlaylist | null} The saved playlist, or null if unavailable or structurally invalid.
 */
export function loadPlaylist() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
            return null;
        }
        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed !== 'object') {
            return null;
        }
        const { tracks, currentSongIndex } = /** @type {Record<string, unknown>} */ (parsed);
        if (!Array.isArray(tracks)) {
            return null;
        }
        if (!Number.isInteger(currentSongIndex) || /** @type {number} */ (currentSongIndex) < 0) {
            return null;
        }
        const validTracks = /** @type {SavedTrack[]} */ (tracks.filter((t) => isValidTrack(t)));
        return { currentSongIndex: /** @type {number} */ (currentSongIndex), tracks: validTracks };
    } catch {
        return null;
    }
}

/**
 * Persist the current playlist to localStorage.
 * Errors are silently swallowed so storage failures never crash the app.
 * @param {SavedTrack[]} tracks - Track metadata to persist.
 * @param {number} currentSongIndex - Index of the currently selected track.
 */
export function savePlaylist(tracks, currentSongIndex) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ currentSongIndex, tracks }));
    } catch {
        // localStorage unavailable or quota exceeded — fail silently
    }
}

/**
 * Remove the saved playlist from localStorage.
 * Errors are silently swallowed.
 */
export function clearPlaylist() {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch {
        // localStorage unavailable — fail silently
    }
}
