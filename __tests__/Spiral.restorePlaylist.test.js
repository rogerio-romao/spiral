// @vitest-environment jsdom

import Spiral from '../src/Spiral.js';

const STORAGE_KEY = 'spiral:playlist';

const SAVED_TRACKS = [
    { filePath: '/music/a.mp3', trackName: 'Track A' },
    { filePath: '/music/b.mp3', trackName: 'Track B' },
    { filePath: '/music/c.mp3', trackName: 'Track C' },
];

const RESOLVED_ALL = [
    { filePath: '/music/a.mp3', fileUrl: 'file:///music/a.mp3', trackName: 'Track A' },
    { filePath: '/music/b.mp3', fileUrl: 'file:///music/b.mp3', trackName: 'Track B' },
    { filePath: '/music/c.mp3', fileUrl: 'file:///music/c.mp3', trackName: 'Track C' },
];

/** Create a minimal Spiral-like object without invoking the constructor.
 * `resolvedFiles` is the array that `electronAPI.resolveFiles` will return, allowing tests to simulate missing files by omitting them from this array.
 * @param {Array<{ filePath: string, fileUrl: string, trackName: string }>} resolvedFiles - The array of resolved file objects that the mocked `electronAPI.resolveFiles` will return.
 * @returns {Spiral} A mock Spiral instance with a mocked musicPlayer and hud, and a mocked electronAPI.resolveFiles that returns the specified resolvedFiles.
 */
function createSpiral(resolvedFiles) {
    const spiral = Object.create(Spiral.prototype);
    spiral.musicPlayer = { restorePlaylist: vi.fn() };
    spiral.hudController = { displayMessage: vi.fn() };
    globalThis.electronAPI = { resolveFiles: vi.fn().mockResolvedValue(resolvedFiles) };
    return spiral;
}

describe('spiral.restorePlaylist', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('does nothing when no saved playlist exists', async () => {
        const spiral = createSpiral(RESOLVED_ALL);
        await spiral.restorePlaylist();

        expect(spiral.musicPlayer.restorePlaylist).not.toHaveBeenCalled();
        expect(globalThis.electronAPI.resolveFiles).not.toHaveBeenCalled();
    });

    it('does nothing when the saved tracks array is empty', async () => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ currentSongIndex: 0, tracks: [] }));
        const spiral = createSpiral(RESOLVED_ALL);
        await spiral.restorePlaylist();

        expect(spiral.musicPlayer.restorePlaylist).not.toHaveBeenCalled();
    });

    it('does nothing when all saved files are missing', async () => {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ currentSongIndex: 0, tracks: SAVED_TRACKS }),
        );
        const spiral = createSpiral([]);
        await spiral.restorePlaylist();

        expect(spiral.musicPlayer.restorePlaylist).not.toHaveBeenCalled();
    });

    it('calls restorePlaylist with resolved files and the correct index', async () => {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ currentSongIndex: 1, tracks: SAVED_TRACKS }),
        );
        const spiral = createSpiral(RESOLVED_ALL);
        await spiral.restorePlaylist();

        expect(spiral.musicPlayer.restorePlaylist).toHaveBeenCalledWith(RESOLVED_ALL, 1);
    });

    it('falls back to index 0 when the saved current track is missing after filtering', async () => {
        // Save with index 1 (Track B), but Track B is missing from resolved
        const resolvedWithoutB = [RESOLVED_ALL[0], RESOLVED_ALL[2]];
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ currentSongIndex: 1, tracks: SAVED_TRACKS }),
        );
        const spiral = createSpiral(resolvedWithoutB);
        await spiral.restorePlaylist();

        expect(spiral.musicPlayer.restorePlaylist).toHaveBeenCalledWith(resolvedWithoutB, 0);
    });

    it('shows a HUD message when some tracks are missing', async () => {
        const resolvedWithoutC = [RESOLVED_ALL[0], RESOLVED_ALL[1]];
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ currentSongIndex: 0, tracks: SAVED_TRACKS }),
        );
        const spiral = createSpiral(resolvedWithoutC);
        await spiral.restorePlaylist();

        expect(spiral.hudController.displayMessage).toHaveBeenCalledWith(
            '1 saved track unavailable',
        );
    });

    it('uses the plural form in the HUD message for multiple missing tracks', async () => {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ currentSongIndex: 0, tracks: SAVED_TRACKS }),
        );
        const spiral = createSpiral([RESOLVED_ALL[0]]);
        await spiral.restorePlaylist();

        expect(spiral.hudController.displayMessage).toHaveBeenCalledWith(
            '2 saved tracks unavailable',
        );
    });

    it('does not show a HUD message when all tracks resolve', async () => {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ currentSongIndex: 0, tracks: SAVED_TRACKS }),
        );
        const spiral = createSpiral(RESOLVED_ALL);
        await spiral.restorePlaylist();

        expect(spiral.hudController.displayMessage).not.toHaveBeenCalled();
    });
});
