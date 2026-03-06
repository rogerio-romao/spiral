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
        <span id="time-elapsed"></span>
        <progress id="progress-percent" max="100" value="0"></progress>
        <span id="time-total"></span>
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
