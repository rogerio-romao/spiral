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
            instance.tracks = [
                { filePath: '/1', trackName: 'Song One' },
                { filePath: '/2', trackName: 'Song Two' },
            ];
            instance.currentSongIndex = 1;
            instance.trackNameEl = { textContent: '' };

            instance.updateTrackName();

            expect(instance.trackNameEl.textContent).toBe('Song Two');
        });

        it('clears the track name when the playlist is empty', () => {
            const instance = Object.create(proto);
            instance.tracks = [];
            instance.trackNameEl = { textContent: 'previous' };

            instance.updateTrackName();

            expect(instance.trackNameEl.textContent).toBe('');
        });
    });

    describe('fadePause', () => {
        it('calls frequencyAnalyser.fadeTo(0, duration) then pauses', async () => {
            const instance = Object.create(proto);
            instance.audio = { pause: vi.fn() };
            instance.playToggleFadeDurationInMs = 80;
            instance.frequencyAnalyser = { fadeTo: vi.fn().mockResolvedValue(null) };

            await instance.fadePause();

            expect(instance.frequencyAnalyser.fadeTo).toHaveBeenCalledWith(0, 80);
            expect(instance.audio.pause).toHaveBeenCalledWith();
        });

        it('pauses only after the fade completes', async () => {
            const instance = Object.create(proto);
            instance.audio = { pause: vi.fn() };
            instance.playToggleFadeDurationInMs = 80;
            const order = [];
            instance.frequencyAnalyser = {
                fadeTo: vi.fn().mockImplementation(() => {
                    order.push('fade');
                    return Promise.resolve(null);
                }),
            };

            // oxlint-disable-next-line jest/prefer-mock-return-shorthand
            vi.spyOn(instance.audio, 'pause').mockImplementation(() => order.push('pause'));

            await instance.fadePause();

            expect(order).toStrictEqual(['fade', 'pause']);
        });

        it('pauses immediately when frequencyAnalyser is not set', async () => {
            const instance = Object.create(proto);
            instance.audio = { pause: vi.fn() };
            instance.frequencyAnalyser = null;

            await instance.fadePause();

            expect(instance.audio.pause).toHaveBeenCalledWith();
        });
    });

    describe('fadePlay', () => {
        it('sets gain to 0, plays, then fades in to 1', async () => {
            const instance = Object.create(proto);
            instance.audio = { play: vi.fn().mockResolvedValue(null) };
            instance.playToggleFadeDurationInMs = 80;
            instance.frequencyAnalyser = {
                fadeTo: vi.fn().mockResolvedValue(null),
                setGain: vi.fn(),
            };

            await instance.fadePlay();

            expect(instance.frequencyAnalyser.setGain).toHaveBeenCalledWith(0);
            expect(instance.audio.play).toHaveBeenCalledWith();
            expect(instance.frequencyAnalyser.fadeTo).toHaveBeenCalledWith(1, 80);
        });

        it('resets gain to 1 and returns early if audio.play() rejects', async () => {
            const instance = Object.create(proto);
            instance.audio = {
                play: vi.fn().mockRejectedValue(new Error('AbortError')),
            };
            instance.frequencyAnalyser = {
                fadeTo: vi.fn().mockResolvedValue(null),
                setGain: vi.fn(),
            };

            await instance.fadePlay();

            expect(instance.frequencyAnalyser.setGain).toHaveBeenCalledWith(0);
            expect(instance.frequencyAnalyser.setGain).toHaveBeenCalledWith(1);
            expect(instance.frequencyAnalyser.fadeTo).not.toHaveBeenCalled();
        });

        it('plays immediately when frequencyAnalyser is not set', async () => {
            const instance = Object.create(proto);
            instance.audio = { play: vi.fn().mockResolvedValue(null) };
            instance.frequencyAnalyser = null;

            await instance.fadePlay();

            expect(instance.audio.play).toHaveBeenCalledWith();
        });
    });
});
