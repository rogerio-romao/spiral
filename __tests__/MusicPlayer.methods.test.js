// oxlint-disable no-empty-function
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

    describe('fadeVolume', () => {
        it('sets audio volume to the target value when rAF completes the animation', async () => {
            const instance = Object.create(proto);
            instance.audio = { volume: 0 };
            instance.fadeRafId = null;

            vi.spyOn(globalThis, 'cancelAnimationFrame').mockImplementation(() => {});
            vi.spyOn(globalThis, 'requestAnimationFrame').mockImplementation((step) => {
                step(100);
                return 0;
            });
            vi.spyOn(globalThis.performance, 'now').mockReturnValue(0);

            await instance.fadeVolume(0, 1, 40);

            expect(instance.audio.volume).toBe(1);
        });

        it('clamps progress at 1 and does not schedule another rAF after completion', async () => {
            const instance = Object.create(proto);
            instance.audio = { volume: 0 };
            instance.fadeRafId = null;

            vi.spyOn(globalThis, 'cancelAnimationFrame').mockImplementation(() => {});
            const rafSpy = vi
                .spyOn(globalThis, 'requestAnimationFrame')
                .mockImplementation((step) => {
                    step(100);
                    return 0;
                });
            vi.spyOn(globalThis.performance, 'now').mockReturnValue(0);

            await instance.fadeVolume(0, 1, 40);

            // rAF scheduled once (initial); no second call because progress hits 1
            expect(rafSpy).toHaveBeenCalledOnce();
        });

        it('cancels any in-progress rAF before starting a new fade', async () => {
            const instance = Object.create(proto);
            instance.audio = { volume: 0 };
            instance.fadeRafId = 99;

            const cancelSpy = vi
                .spyOn(globalThis, 'cancelAnimationFrame')
                .mockImplementation(() => {});
            vi.spyOn(globalThis, 'requestAnimationFrame').mockImplementation((step) => {
                step(100);
                return 0;
            });
            vi.spyOn(globalThis.performance, 'now').mockReturnValue(0);

            await instance.fadeVolume(0, 1, 40);

            expect(cancelSpy).toHaveBeenCalledWith(99);
        });
    });

    describe('fadePause', () => {
        it('fades from the current volume to 0, then pauses', async () => {
            const instance = Object.create(proto);
            instance.audio = { pause: vi.fn(), volume: 0.5 };
            instance.playToggleFadeDurationInMs = 80;
            vi.spyOn(instance, 'fadeVolume').mockResolvedValue(null);

            await instance.fadePause();

            expect(instance.fadeVolume).toHaveBeenCalledWith(
                0.5,
                0,
                instance.playToggleFadeDurationInMs,
            );
            expect(instance.audio.pause).toHaveBeenCalledWith();
        });

        it('pauses only after the fade completes', async () => {
            const instance = Object.create(proto);
            instance.audio = { pause: vi.fn(), volume: 1 };
            instance.playToggleFadeDurationInMs = 80;
            const order = [];
            vi.spyOn(instance, 'fadeVolume').mockImplementation(() => {
                order.push('fade');
                return Promise.resolve(null);
            });
            // oxlint-disable-next-line jest/prefer-mock-return-shorthand
            vi.spyOn(instance.audio, 'pause').mockImplementation(() => order.push('pause'));

            await instance.fadePause();

            expect(order).toStrictEqual(['fade', 'pause']);
        });
    });

    describe('fadePlay', () => {
        it('sets volume to 0, plays, then calls fadeVolume from 0 to 1', async () => {
            const instance = Object.create(proto);
            instance.audio = { play: vi.fn().mockResolvedValue(null), volume: 1 };
            vi.spyOn(instance, 'fadeVolume').mockResolvedValue(null);

            await instance.fadePlay();

            expect(instance.audio.volume).toBe(0);
            expect(instance.audio.play).toHaveBeenCalledWith();
            expect(instance.fadeVolume).toHaveBeenCalledWith(
                0,
                1,
                instance.playToggleFadeDurationInMs,
            );
        });

        it('resets volume to 1 and returns early if audio.play() rejects', async () => {
            const instance = Object.create(proto);
            instance.audio = {
                play: vi.fn().mockRejectedValue(new Error('AbortError')),
                volume: 0,
            };
            vi.spyOn(instance, 'fadeVolume').mockResolvedValue(null);

            await instance.fadePlay();

            expect(instance.audio.volume).toBe(1);
            expect(instance.fadeVolume).not.toHaveBeenCalled();
        });
    });
});
