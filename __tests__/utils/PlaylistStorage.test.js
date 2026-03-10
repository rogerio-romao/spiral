// @vitest-environment jsdom

import {
    clearPlaylist,
    loadPlaylist,
    savePlaylist,
    updatePlaylistTime,
} from '../../src/utils/PlaylistStorage.js';

const STORAGE_KEY = 'spiral:playlist';

const TRACKS = [
    { filePath: '/music/Track One.mp3', trackName: 'Track One' },
    { filePath: '/music/Track Two.flac', trackName: 'Track Two' },
];

describe('playlistStorage', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    describe('loadPlaylist()', () => {
        it('returns null when localStorage is empty', () => {
            expect(loadPlaylist()).toBeNull();
        });

        it('returns the saved playlist when all data is valid', () => {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify({ currentSongIndex: 1, currentTime: 30, tracks: TRACKS }),
            );

            expect(loadPlaylist()).toStrictEqual({
                currentSongIndex: 1,
                currentTime: 30,
                tracks: TRACKS,
            });
        });

        it('returns null for corrupt JSON', () => {
            localStorage.setItem(STORAGE_KEY, 'not-valid-json{{{');

            expect(loadPlaylist()).toBeNull();
        });

        it('returns null when tracks is not an array', () => {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify({ currentSongIndex: 0, tracks: 'bad' }),
            );

            expect(loadPlaylist()).toBeNull();
        });

        it('returns null when currentSongIndex is not an integer', () => {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify({ currentSongIndex: 1.5, tracks: TRACKS }),
            );

            expect(loadPlaylist()).toBeNull();
        });

        it('returns null when currentSongIndex is negative', () => {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify({ currentSongIndex: -1, tracks: TRACKS }),
            );

            expect(loadPlaylist()).toBeNull();
        });

        it('filters out a track entry missing filePath and keeps the rest', () => {
            const mixed = [...TRACKS, { trackName: 'No Path' }];
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify({ currentSongIndex: 0, currentTime: 0, tracks: mixed }),
            );

            expect(loadPlaylist()).toStrictEqual({
                currentSongIndex: 0,
                currentTime: 0,
                tracks: TRACKS,
            });
        });

        it('filters out a track entry missing trackName and keeps the rest', () => {
            const mixed = [{ filePath: '/music/track.mp3' }, ...TRACKS];
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify({ currentSongIndex: 0, currentTime: 0, tracks: mixed }),
            );

            expect(loadPlaylist()).toStrictEqual({
                currentSongIndex: 0,
                currentTime: 0,
                tracks: TRACKS,
            });
        });

        it('filters out a track entry with a non-string filePath and keeps the rest', () => {
            const mixed = [{ filePath: 123, trackName: 'Track' }, ...TRACKS];
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify({ currentSongIndex: 0, currentTime: 0, tracks: mixed }),
            );

            expect(loadPlaylist()).toStrictEqual({
                currentSongIndex: 0,
                currentTime: 0,
                tracks: TRACKS,
            });
        });

        it('returns a playlist with an empty tracks array when all entries are invalid', () => {
            const bad = [{ foo: 'bar' }, null, 42];
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify({ currentSongIndex: 0, currentTime: 0, tracks: bad }),
            );

            expect(loadPlaylist()).toStrictEqual({
                currentSongIndex: 0,
                currentTime: 0,
                tracks: [],
            });
        });

        it('accepts an empty tracks array with index 0', () => {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify({ currentSongIndex: 0, currentTime: 0, tracks: [] }),
            );

            expect(loadPlaylist()).toStrictEqual({
                currentSongIndex: 0,
                currentTime: 0,
                tracks: [],
            });
        });

        it('returns null when localStorage throws', () => {
            vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
                throw new DOMException('SecurityError');
            });

            expect(loadPlaylist()).toBeNull();

            vi.restoreAllMocks();
        });
    });

    describe('savePlaylist()', () => {
        it('persists tracks and currentSongIndex to localStorage', () => {
            savePlaylist(TRACKS, 1);
            const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));

            expect(stored).toStrictEqual({ currentSongIndex: 1, currentTime: 0, tracks: TRACKS });
        });

        it('persists currentTime when provided', () => {
            savePlaylist(TRACKS, 1, 45);
            const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));

            expect(stored).toStrictEqual({ currentSongIndex: 1, currentTime: 45, tracks: TRACKS });
        });

        it('overwrites a previously saved playlist', () => {
            savePlaylist(TRACKS, 0);
            const updated = [{ filePath: '/music/New.mp3', trackName: 'New' }];
            savePlaylist(updated, 0);
            const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));

            expect(stored.tracks).toStrictEqual(updated);
        });

        it('does not throw when localStorage throws', () => {
            vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
                throw new DOMException('QuotaExceededError');
            });

            expect(() => savePlaylist(TRACKS, 0)).not.toThrow();

            vi.restoreAllMocks();
        });
    });

    describe('updatePlaylistTime()', () => {
        it('updates the currentTime of an existing saved playlist', () => {
            savePlaylist(TRACKS, 0, 10);
            const result = updatePlaylistTime(45);

            expect(result).toBeTruthy();
            const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
            expect(stored).toStrictEqual({ currentSongIndex: 0, currentTime: 45, tracks: TRACKS });
        });

        it('returns false when no playlist exists', () => {
            const result = updatePlaylistTime(30);

            expect(result).toBeFalsy();
        });

        it('returns false when localStorage throws', () => {
            savePlaylist(TRACKS, 0);
            vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
                throw new DOMException('QuotaExceededError');
            });

            const result = updatePlaylistTime(30);

            expect(result).toBeFalsy();
            vi.restoreAllMocks();
        });
    });

    describe('clearPlaylist()', () => {
        it('removes the saved playlist from localStorage', () => {
            savePlaylist(TRACKS, 0);
            clearPlaylist();

            expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
        });

        it('does nothing when nothing is saved', () => {
            expect(() => clearPlaylist()).not.toThrow();
        });

        it('does not throw when localStorage throws', () => {
            vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
                throw new DOMException('SecurityError');
            });

            expect(() => clearPlaylist()).not.toThrow();

            vi.restoreAllMocks();
        });
    });
});
