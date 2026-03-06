import MusicPlayer from '../../src/MusicPlayer.js';

vi.mock(import('../../src/AlgorithmLoader.js'), () => ({
    default: { frequencyAnalyser: null },
}));

const FIXTURE = /* html */ `
    <div id="player" style="display: block">
        <label id="click-label" for="input">Add Track(s)</label>
        <input type="file" id="input" accept="audio/*" multiple />
        <canvas id="eq-display" width="50" height="20"></canvas>
        <span id="track-name"></span>
        <button id="playlist-toggle"></button>
        <button id="prev"></button>
        <button id="play">
            <svg id="icon-play" style="display: inline"></svg>
            <svg id="icon-pause" style="display: none"></svg>
        </button>
        <button id="stop"></button>
        <button id="next"></button>
        <div id="playlist-accordion"></div>
        <ol id="playlist"></ol>
        <div id="progress" style="display: none">
            <span id="time-elapsed"></span>
            <progress id="progress-percent" max="100" value="0"></progress>
            <span id="time-total"></span>
        </div>
    </div>
    <audio id="audio"></audio>
`;

// Mocks DOM/media APIs to:
// - Prevent real resource allocation and side effects (blobs, audio playback)
// - Ensure test determinism and speed
// - Avoid errors or unpredictable behavior in test environments
function createPlayer() {
    document.body.innerHTML = FIXTURE;
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock');
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(vi.fn());
    vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue(null);
    vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(vi.fn());
    return new MusicPlayer();
}

describe('musicPlayer (browser)', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('constructor', () => {
        it('creates instance without errors', () => {
            const player = createPlayer();
            expect(player).toBeDefined();
        });

        it('shows player panel initially', () => {
            createPlayer();
            expect(document.querySelector('#player').style.display).toBe('block');
        });
    });

    describe('setPlayIcon', () => {
        it('shows pause icon and hides play icon when playing', () => {
            const player = createPlayer();
            player.togglePlayPauseIcon(true);
            expect(document.querySelector('#icon-play').style.display).toBe('none');
            expect(document.querySelector('#icon-pause').style.display).toBe('inline');
        });

        it('shows play icon and hides pause icon when not playing', () => {
            const player = createPlayer();
            player.togglePlayPauseIcon(false);
            expect(document.querySelector('#icon-play').style.display).toBe('inline');
            expect(document.querySelector('#icon-pause').style.display).toBe('none');
        });
    });

    describe('togglePlayerVisibility', () => {
        it('player is visible initially, hides the player on first call', () => {
            const player = createPlayer();
            player.togglePlayerVisibility();
            expect(document.querySelector('#player').style.display).toBe('none');
        });

        it('shows the player on second call', () => {
            const player = createPlayer();
            player.togglePlayerVisibility();
            player.togglePlayerVisibility();
            expect(document.querySelector('#player').style.display).toBe('block');
        });
    });

    describe('renderPlaylist', () => {
        it('creates list items for each track', () => {
            const player = createPlayer();
            player.trackList = ['blob:url1', 'blob:url2'];
            player.trackNames = ['Track 1', 'Track 2'];
            player.currentSong = 0;
            player.renderPlaylist();
            expect(document.querySelectorAll('.list-item')).toHaveLength(2);
        });

        it('sets track name text content correctly', () => {
            const player = createPlayer();
            player.trackList = ['blob:url1', 'blob:url2'];
            player.trackNames = ['Track One', 'Track Two'];
            player.currentSong = 0;
            player.renderPlaylist();

            const items = document.querySelectorAll('.list-item');
            expect(items[0].querySelector('.track-name').textContent).toBe('Track One');
            expect(items[1].querySelector('.track-name').textContent).toBe('Track Two');
        });

        it('reorders playlist items via drag and drop and keeps DOM and state in sync', () => {
            const player = createPlayer();
            player.trackList = ['blob:url1', 'blob:url2', 'blob:url3'];
            player.trackNames = ['Track 1', 'Track 2', 'Track 3'];
            player.currentSongIndex = 1;
            player.renderPlaylist();

            const scrollIntoViewSpy = vi.spyOn(HTMLElement.prototype, 'scrollIntoView');
            const dataTransfer = new DataTransfer();
            const items = document.querySelectorAll('.list-item');

            items[0].dispatchEvent(new DragEvent('dragstart', { bubbles: true, dataTransfer }));
            items[2].dispatchEvent(new DragEvent('dragover', { bubbles: true, dataTransfer }));
            items[2].dispatchEvent(new DragEvent('drop', { bubbles: true, dataTransfer }));
            items[0].dispatchEvent(new DragEvent('dragend', { bubbles: true, dataTransfer }));

            expect(player.trackNames).toStrictEqual(['Track 2', 'Track 3', 'Track 1']);
            expect(player.trackList).toStrictEqual(['blob:url2', 'blob:url3', 'blob:url1']);
            expect(player.currentSongIndex).toBe(0);

            const reorderedItems = document.querySelectorAll('.list-item .track-name');
            expect(reorderedItems[0].textContent).toBe('Track 2');
            expect(reorderedItems[1].textContent).toBe('Track 3');
            expect(reorderedItems[2].textContent).toBe('Track 1');
            expect(document.querySelector('#track-name').textContent).toBe('Track 2');
            expect(scrollIntoViewSpy).toHaveBeenCalledWith({ block: 'nearest' });
        });

        it('clicks a playlist item to jump tracks and update playback UI', () => {
            const player = createPlayer();
            const enqueuePlaySpy = vi.spyOn(player, 'enqueuePlay').mockImplementation(vi.fn());
            const scrollIntoViewSpy = vi.spyOn(HTMLElement.prototype, 'scrollIntoView');

            player.trackList = ['blob:url1', 'blob:url2', 'blob:url3'];
            player.trackNames = ['Track 1', 'Track 2', 'Track 3'];
            player.currentSongIndex = 0;
            player.audio.src = player.trackList[0];
            player.audio.currentTime = 12;
            player.progress.value = '42';
            player.elapsedEl.textContent = '0:12';
            player.totalEl.textContent = '3:33';
            player.renderPlaylist();

            const secondTrackName = document.querySelectorAll('.list-item .track-name')[1];
            secondTrackName.dispatchEvent(new MouseEvent('click', { bubbles: true }));

            expect(HTMLMediaElement.prototype.pause).toHaveBeenCalledWith();
            expect(player.currentSongIndex).toBe(1);
            expect(player.audio.currentTime).toBe(0);
            expect(player.progress.value).toBe(0);
            expect(player.elapsedEl.textContent).toBe('0:00');
            expect(player.totalEl.textContent).toBe('0:00');
            expect(player.audio.src).toContain('blob:url2');
            expect(enqueuePlaySpy).toHaveBeenCalledWith();
            expect(document.querySelector('#track-name').textContent).toBe('Track 2');
            expect(player.playlistEls[1].style.color).toBe('orange');
            expect(scrollIntoViewSpy).toHaveBeenCalledWith({ block: 'nearest' });
        });
    });

    describe('handleFiles', () => {
        it('loads selected files and initializes the playlist and UI', () => {
            const player = createPlayer();
            URL.createObjectURL.mockReturnValueOnce('blob:url1').mockReturnValueOnce('blob:url2');

            const files = [
                new File(['one'], 'Track One.mp3', { type: 'audio/mpeg' }),
                new File(['two'], 'Track Two.wav', { type: 'audio/wav' }),
            ];

            Object.defineProperty(player.input, 'files', {
                configurable: true,
                value: files,
            });

            player.input.dispatchEvent(new Event('change', { bubbles: true }));

            expect(HTMLMediaElement.prototype.pause).toHaveBeenCalledWith();
            expect(player.trackNames).toStrictEqual(['Track One', 'Track Two']);
            expect(player.trackList).toStrictEqual(['blob:url1', 'blob:url2']);
            expect(player.currentSongIndex).toBe(0);
            expect(player.audio.src).toContain('blob:url1');
            expect(player.isPlaying).toBeFalsy();
            expect(player.progressPanel.style.display).toBe('flex');
            expect(player.playlistToggle.classList.contains('tracks-present')).toBeTruthy();
            expect(player.trackNameEl.textContent).toBe('Track One');
            expect(document.querySelectorAll('.list-item')).toHaveLength(2);
            expect(document.querySelector('#icon-play').style.display).toBe('inline');
            expect(document.querySelector('#icon-pause').style.display).toBe('none');
            expect(player.input.value).toBe('');
        });
    });

    describe('scrub', () => {
        it('scrubs the progress bar and updates audio position and progress display', () => {
            const player = createPlayer();
            const enqueuePlaySpy = vi.spyOn(player, 'enqueuePlay').mockImplementation(vi.fn());

            player.trackList = ['blob:url1', 'blob:url2'];
            player.trackNames = ['Track 1', 'Track 2'];
            player.currentSongIndex = 0;
            player.isPlaying = true;
            player.renderPlaylist();

            Object.defineProperty(player.audio, 'duration', {
                configurable: true,
                value: 200,
            });
            Object.defineProperty(player.progress, 'offsetWidth', {
                configurable: true,
                value: 100,
            });

            player.audio.currentTime = 10;
            const mouseUpEvent = new MouseEvent('mouseup', { bubbles: true });
            Object.defineProperty(mouseUpEvent, 'offsetX', {
                configurable: true,
                value: 25,
            });

            player.progress.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
            player.progress.dispatchEvent(mouseUpEvent);
            player.audio.dispatchEvent(new Event('timeupdate'));

            expect(HTMLMediaElement.prototype.pause).toHaveBeenCalledWith();
            expect(player.audio.currentTime).toBe(50);
            expect(player.progress.value).toBe(25);
            expect(player.elapsedEl.textContent).toBe('0:50');
            expect(player.totalEl.textContent).toBe('3:20');
            expect(enqueuePlaySpy).toHaveBeenCalledWith(50);
        });
    });

    describe('removeTrack', () => {
        it('removes a track from trackList and trackNames', () => {
            const player = createPlayer();
            player.trackList = ['blob:url1', 'blob:url2', 'blob:url3'];
            player.trackNames = ['Track 1', 'Track 2', 'Track 3'];
            player.currentSong = 0;
            player.renderPlaylist();
            player.removeTrack(1);
            expect(player.trackList).toHaveLength(2);
            expect(player.trackNames).not.toContain('Track 2');
        });

        it('calls revokeObjectURL for the removed track', () => {
            const player = createPlayer();
            player.trackList = ['blob:url1', 'blob:url2'];
            player.trackNames = ['Track 1', 'Track 2'];
            player.currentSong = 0;
            player.renderPlaylist();
            player.removeTrack(0);
            expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:url1');
        });

        it('removes the currently playing track and continues with the next track', () => {
            const player = createPlayer();
            const enqueuePlaySpy = vi.spyOn(player, 'enqueuePlay').mockImplementation(vi.fn());
            const scrollIntoViewSpy = vi.spyOn(HTMLElement.prototype, 'scrollIntoView');

            player.trackList = ['blob:url1', 'blob:url2', 'blob:url3'];
            player.trackNames = ['Track 1', 'Track 2', 'Track 3'];
            player.currentSongIndex = 1;
            player.isPlaying = true;
            player.audio.src = 'blob:url2';
            player.renderPlaylist();

            const removeButtons = document.querySelectorAll('.remove-track');
            removeButtons[1].dispatchEvent(new MouseEvent('click', { bubbles: true }));

            expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:url2');
            expect(player.trackNames).toStrictEqual(['Track 1', 'Track 3']);
            expect(player.trackList).toStrictEqual(['blob:url1', 'blob:url3']);
            expect(player.currentSongIndex).toBe(1);
            expect(player.audio.src).toContain('blob:url3');
            expect(player.isPlaying).toBeTruthy();
            expect(enqueuePlaySpy).toHaveBeenCalledWith();
            expect(document.querySelectorAll('.list-item')).toHaveLength(2);
            expect(document.querySelector('#track-name').textContent).toBe('Track 3');
            expect(player.playlistEls[1].style.color).toBe('orange');
            expect(scrollIntoViewSpy).toHaveBeenCalledWith({ block: 'nearest' });
        });
    });

    describe('draw flat Eq (real Canvas 2D)', () => {
        it('renders flat eq bars without errors', () => {
            const player = createPlayer();
            expect(() => player.drawEq(true)).not.toThrow();
        });

        it('canvas has correct dimensions', () => {
            createPlayer();
            const canvas = document.querySelector('#eq-display');
            // these dimension are set in index.html
            expect(canvas.width).toBe(50);
            expect(canvas.height).toBe(20);
        });
    });

    describe('destroy', () => {
        it('calls revokeObjectURL for all blob URLs', () => {
            const player = createPlayer();
            player.trackList = ['blob:url1', 'blob:url2'];
            player.destroy();
            expect(URL.revokeObjectURL).toHaveBeenCalledTimes(2);
        });
    });
});
