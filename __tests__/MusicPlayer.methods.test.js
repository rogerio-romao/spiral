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

            instance.togglePlayPauseIcon(true);

            expect(instance.iconPlay.style.display).toBe('none');
            expect(instance.iconPause.style.display).toBe('inline');
        });

        it('shows play icon and hides pause icon when not playing', () => {
            const instance = Object.create(proto);
            instance.iconPlay = { style: { display: 'none' } };
            instance.iconPause = { style: { display: 'inline' } };

            instance.togglePlayPauseIcon(false);

            expect(instance.iconPlay.style.display).toBe('inline');
            expect(instance.iconPause.style.display).toBe('none');
        });
    });

    describe('togglePlayerVisibility', () => {
        it('shows the player when hidden', () => {
            const instance = Object.create(proto);
            instance.showPlayer = false;
            instance.player = { style: { display: 'none' } };

            instance.togglePlayerVisibility();

            expect(instance.showPlayer).toBeTruthy();
            expect(instance.player.style.display).toBe('block');
        });

        it('hides the player when shown', () => {
            const instance = Object.create(proto);
            instance.showPlayer = true;
            instance.player = { style: { display: 'block' } };

            instance.togglePlayerVisibility();

            expect(instance.showPlayer).toBeFalsy();
            expect(instance.player.style.display).toBe('none');
        });
    });

    describe('togglePlaylist', () => {
        it('sets playlistIsOpen to true on first toggle', () => {
            const instance = Object.create(proto);
            instance.playlistIsOpen = false;
            instance.accordionEl = { classList: { toggle: vi.fn() } };
            instance.playlistToggle = { classList: { toggle: vi.fn() } };

            instance.togglePlaylist();

            expect(instance.playlistIsOpen).toBeTruthy();
            expect(instance.accordionEl.classList.toggle).toHaveBeenCalledWith('open', true);
            expect(instance.playlistToggle.classList.toggle).toHaveBeenCalledWith('open', true);
        });

        it('sets playlistIsOpen to false on second toggle', () => {
            const instance = Object.create(proto);
            instance.playlistIsOpen = true;
            instance.accordionEl = { classList: { toggle: vi.fn() } };
            instance.playlistToggle = { classList: { toggle: vi.fn() } };

            instance.togglePlaylist();

            expect(instance.playlistIsOpen).toBeFalsy();
            expect(instance.accordionEl.classList.toggle).toHaveBeenCalledWith('open', false);
        });
    });

    describe('updateTrackName', () => {
        it('sets the track name from the current playlist entry', () => {
            const instance = Object.create(proto);
            instance.trackNames = ['Song One', 'Song Two'];
            instance.currentSongIndex = 1;
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
});
