import MusicPlayer from '../src/MusicPlayer.js';

// Access prototype methods directly to avoid constructor DOM side effects.
const proto = MusicPlayer.prototype;

describe('musicPlayer methods', () => {
    beforeEach(() => {
        globalThis.URL = { ...globalThis.URL, revokeObjectURL: vi.fn() };
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('setPlayIcon', () => {
        it('hides play icon and shows pause icon when playing', () => {
            const instance = Object.create(proto);
            instance.iconPlay = { style: { display: 'inline' } };
            instance.iconPause = { style: { display: 'none' } };

            instance.setPlayIcon(true);

            expect(instance.iconPlay.style.display).toBe('none');
            expect(instance.iconPause.style.display).toBe('inline');
        });

        it('shows play icon and hides pause icon when not playing', () => {
            const instance = Object.create(proto);
            instance.iconPlay = { style: { display: 'none' } };
            instance.iconPause = { style: { display: 'inline' } };

            instance.setPlayIcon(false);

            expect(instance.iconPlay.style.display).toBe('inline');
            expect(instance.iconPause.style.display).toBe('none');
        });
    });

    describe('togglePlayerVisibility', () => {
        it('shows the player when hidden', () => {
            const instance = Object.create(proto);
            instance.playerShow = false;
            instance.player = { style: { display: 'none' } };

            instance.togglePlayerVisibility();

            expect(instance.playerShow).toBeTruthy();
            expect(instance.player.style.display).toBe('block');
        });

        it('hides the player when shown', () => {
            const instance = Object.create(proto);
            instance.playerShow = true;
            instance.player = { style: { display: 'block' } };

            instance.togglePlayerVisibility();

            expect(instance.playerShow).toBeFalsy();
            expect(instance.player.style.display).toBe('none');
        });
    });

    describe('togglePlaylist', () => {
        it('sets playlistOpen to true on first toggle', () => {
            const instance = Object.create(proto);
            instance.playlistOpen = false;
            instance.accordionEl = { classList: { toggle: vi.fn() } };
            instance.playlistToggle = { classList: { toggle: vi.fn() } };

            instance.togglePlaylist();

            expect(instance.playlistOpen).toBeTruthy();
            expect(instance.accordionEl.classList.toggle).toHaveBeenCalledWith('open', true);
            expect(instance.playlistToggle.classList.toggle).toHaveBeenCalledWith('open', true);
        });

        it('sets playlistOpen to false on second toggle', () => {
            const instance = Object.create(proto);
            instance.playlistOpen = true;
            instance.accordionEl = { classList: { toggle: vi.fn() } };
            instance.playlistToggle = { classList: { toggle: vi.fn() } };

            instance.togglePlaylist();

            expect(instance.playlistOpen).toBeFalsy();
            expect(instance.accordionEl.classList.toggle).toHaveBeenCalledWith('open', false);
        });
    });

    describe('updateTrackName', () => {
        it('sets the track name from the current playlist entry', () => {
            const instance = Object.create(proto);
            instance.trackNames = ['Song One', 'Song Two'];
            instance.currentSong = 1;
            instance.trackNameEl = { textContent: '' };

            instance.updateTrackName();

            expect(instance.trackNameEl.textContent).toBe('Song Two');
        });

        it('does nothing when the playlist is empty', () => {
            const instance = Object.create(proto);
            instance.trackNames = [];
            instance.trackNameEl = { textContent: 'previous' };

            instance.updateTrackName();

            expect(instance.trackNameEl.textContent).toBe('previous');
        });
    });

    describe('revokeBlobUrls', () => {
        it('calls URL.revokeObjectURL for each stored blob url', () => {
            const instance = Object.create(proto);
            instance.blobUrls = ['blob:1', 'blob:2'];
            instance.trackNames = ['Track 1', 'Track 2'];

            instance.revokeBlobUrls();

            expect(globalThis.URL.revokeObjectURL).toHaveBeenCalledWith('blob:1');
            expect(globalThis.URL.revokeObjectURL).toHaveBeenCalledWith('blob:2');
        });

        it('resets blobUrls and trackNames to empty arrays', () => {
            const instance = Object.create(proto);
            instance.blobUrls = ['blob:1'];
            instance.trackNames = ['Track 1'];

            instance.revokeBlobUrls();

            expect(instance.blobUrls).toStrictEqual([]);
            expect(instance.trackNames).toStrictEqual([]);
        });
    });
});
