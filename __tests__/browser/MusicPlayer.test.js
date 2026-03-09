// oxlint-disable max-lines-per-function
import MusicPlayer from '../../src/MusicPlayer.js';

const FIXTURE = /* html */ `
    <div id="player" style="display: block">
        <button id="click-label">Add Track(s)</button>
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
        <div id="playlist-accordion">
            <ol id="playlist"></ol>
            <div id="playlist-actions">
                <button id="save-playlist" disabled>Save Playlist</button>
                <button id="clear-playlist" disabled>Clear Saved Playlist</button>
            </div>
        </div>
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
            player.tracks = [
                { filePath: '/1', trackName: 'Track 1' },
                { filePath: '/2', trackName: 'Track 2' },
            ];
            player.currentSong = 0;
            player.renderPlaylist();

            expect(document.querySelectorAll('.list-item')).toHaveLength(2);
        });

        it('sets track name text content correctly', () => {
            const player = createPlayer();
            player.trackList = ['blob:url1', 'blob:url2'];
            player.tracks = [
                { filePath: '/1', trackName: 'Track One' },
                { filePath: '/2', trackName: 'Track Two' },
            ];
            player.currentSong = 0;
            player.renderPlaylist();

            const items = document.querySelectorAll('.list-item');
            expect(items[0].querySelector('.track-name').textContent).toBe('Track One');
            expect(items[1].querySelector('.track-name').textContent).toBe('Track Two');
        });

        it('reorders playlist items via drag and drop and keeps DOM and state in sync', () => {
            const player = createPlayer();
            player.trackList = ['blob:url1', 'blob:url2', 'blob:url3'];
            player.tracks = [
                { filePath: '/1', trackName: 'Track 1' },
                { filePath: '/2', trackName: 'Track 2' },
                { filePath: '/3', trackName: 'Track 3' },
            ];
            player.currentSongIndex = 1;
            player.renderPlaylist();

            const scrollIntoViewSpy = vi.spyOn(HTMLElement.prototype, 'scrollIntoView');
            // `dataTransfer` is required for drag events to be properly constructed and dispatched in JSDOM
            const dataTransfer = new DataTransfer();
            const items = document.querySelectorAll('.list-item');

            // Simulate dragging the first item (Track 1) to the position of the third item (Track 3)
            items[0].dispatchEvent(new DragEvent('dragstart', { bubbles: true, dataTransfer }));
            items[2].dispatchEvent(new DragEvent('dragover', { bubbles: true, dataTransfer }));
            items[2].dispatchEvent(new DragEvent('drop', { bubbles: true, dataTransfer }));
            items[0].dispatchEvent(new DragEvent('dragend', { bubbles: true, dataTransfer }));

            // After reordering, Track 1 should be last, and the current song index should update to reflect the new position of the previously playing track (Track 2)
            expect(player.tracks.map((t) => t.trackName)).toStrictEqual([
                'Track 2',
                'Track 3',
                'Track 1',
            ]);
            expect(player.trackList).toStrictEqual(['blob:url2', 'blob:url3', 'blob:url1']);
            expect(player.currentSongIndex).toBe(0);

            const reorderedItems = document.querySelectorAll('.list-item .track-name');
            // Verify the DOM order matches the new track order and that the current track is still highlighted and scrolled into view
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
            player.tracks = [
                { filePath: '/1', trackName: 'Track 1' },
                { filePath: '/2', trackName: 'Track 2' },
                { filePath: '/3', trackName: 'Track 3' },
            ];
            player.currentSongIndex = 0;
            player.audio.src = player.trackList[0];

            // Simulate some playback progress on the first track before clicking the second track
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

            const files = [
                {
                    filePath: '/music/Track One.mp3',
                    fileUrl: 'file:///music/Track One.mp3',
                    trackName: 'Track One',
                },
                {
                    filePath: '/music/Track Two.wav',
                    fileUrl: 'file:///music/Track Two.wav',
                    trackName: 'Track Two',
                },
            ];

            player.handleFiles(files);

            expect(HTMLMediaElement.prototype.pause).toHaveBeenCalledWith();
            expect(player.trackList).toStrictEqual([
                'file:///music/Track One.mp3',
                'file:///music/Track Two.wav',
            ]);
            expect(player.tracks.map((t) => t.filePath)).toStrictEqual([
                '/music/Track One.mp3',
                '/music/Track Two.wav',
            ]);
            expect(player.currentSongIndex).toBe(0);
            expect(player.isPlaying).toBeFalsy();
            expect(player.progressPanel.style.display).toBe('flex');
            expect(player.playlistToggle.classList.contains('tracks-present')).toBeTruthy();
            expect(player.trackNameEl.textContent).toBe('Track One');
            expect(document.querySelectorAll('.list-item')).toHaveLength(2);
            expect(document.querySelector('#icon-play').style.display).toBe('inline');
        });

        it('deduplicates tracks by file path', () => {
            const player = createPlayer();

            const files = [
                {
                    filePath: '/music/Track One.mp3',
                    fileUrl: 'file:///music/Track One.mp3',
                    trackName: 'Track One',
                },
            ];

            player.handleFiles(files);
            player.handleFiles(files);

            expect(player.trackList).toHaveLength(1);
        });
    });

    describe('scrub', () => {
        it('scrubs the progress bar and updates audio position and progress display', () => {
            const player = createPlayer();
            const enqueuePlaySpy = vi.spyOn(player, 'enqueuePlay').mockImplementation(vi.fn());

            player.trackList = ['blob:url1', 'blob:url2'];
            player.tracks = [
                { filePath: '/1', trackName: 'Track 1' },
                { filePath: '/2', trackName: 'Track 2' },
            ];
            player.currentSongIndex = 0;
            player.isPlaying = true;
            player.renderPlaylist();

            // We need to define `duration` and `offsetWidth` properties, as they are required for the scrub logic and are not settable by default in JSDOM
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

            // Simulate dragging the progress bar thumb to 25% of the bar, which should set the audio currentTime to 50 (25% of 200 duration)
            player.progress.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
            player.progress.dispatchEvent(mouseUpEvent);
            player.audio.dispatchEvent(new Event('timeupdate'));

            expect(HTMLMediaElement.prototype.pause).toHaveBeenCalledWith();
            // After scrubbing, the audio currentTime should update to 50, the progress bar value should update to 25%, and the elapsed and total time displays should update accordingly. The player should also enqueue play to resume playback from the new position.
            expect(player.audio.currentTime).toBe(50);
            expect(player.progress.value).toBe(25);
            expect(player.elapsedEl.textContent).toBe('0:50');
            expect(player.totalEl.textContent).toBe('3:20');
            expect(enqueuePlaySpy).toHaveBeenCalledWith(50);
        });
    });

    describe('removeTrack', () => {
        it('removes a track from trackList and tracks', () => {
            const player = createPlayer();
            player.trackList = ['blob:url1', 'blob:url2', 'blob:url3'];
            player.tracks = [
                { filePath: '/1', trackName: 'Track 1' },
                { filePath: '/2', trackName: 'Track 2' },
                { filePath: '/3', trackName: 'Track 3' },
            ];
            player.currentSong = 0;
            player.renderPlaylist();

            player.removeTrack(1);
            expect(player.trackList).toHaveLength(2);
            expect(player.tracks.map((t) => t.trackName)).not.toContain('Track 2');
        });

        it('removes the currently playing track and continues with the next track', () => {
            const player = createPlayer();
            const enqueuePlaySpy = vi.spyOn(player, 'enqueuePlay').mockImplementation(vi.fn());
            const scrollIntoViewSpy = vi.spyOn(HTMLElement.prototype, 'scrollIntoView');

            player.trackList = ['blob:url1', 'blob:url2', 'blob:url3'];
            player.tracks = [
                { filePath: '/1', trackName: 'Track 1' },
                { filePath: '/2', trackName: 'Track 2' },
                { filePath: '/3', trackName: 'Track 3' },
            ];
            player.currentSongIndex = 1;
            player.isPlaying = true;
            player.audio.src = 'blob:url2';
            player.renderPlaylist();

            const removeButtons = document.querySelectorAll('.remove-track');
            // Simulate clicking the remove button for the currently playing track (Track 2)
            removeButtons[1].dispatchEvent(new MouseEvent('click', { bubbles: true }));

            // After removing the currently playing track, the player should update the track list and names to remove it, update the current song index to point to the next track (which will now be at the same index as the removed track), load the next track's URL into the audio element, and enqueue play to continue playback. The playlist UI should also update to reflect the removed track and highlight the new current track.
            expect(player.tracks.map((t) => t.trackName)).toStrictEqual(['Track 1', 'Track 3']);
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
        it('runs without errors', () => {
            const player = createPlayer();
            player.trackList = ['file:///music/Track One.mp3', 'file:///music/Track Two.wav'];

            expect(() => player.destroy()).not.toThrow();
        });
    });

    describe('playlist persistence — button states', () => {
        const TRACK_A = {
            filePath: '/music/a.mp3',
            fileUrl: 'file:///music/a.mp3',
            trackName: 'Track A',
        };
        const TRACK_B = {
            filePath: '/music/b.mp3',
            fileUrl: 'file:///music/b.mp3',
            trackName: 'Track B',
        };

        beforeEach(() => {
            localStorage.clear();
        });

        it('save is disabled initially', () => {
            const player = createPlayer();
            expect(player.savePlBtn.disabled).toBeTruthy();
        });

        it('clear is disabled initially', () => {
            const player = createPlayer();
            expect(player.clearPlBtn.disabled).toBeTruthy();
        });

        it('save is enabled after adding tracks', () => {
            const player = createPlayer();
            player.handleFiles([TRACK_A]);
            expect(player.savePlBtn.disabled).toBeFalsy();
        });

        it('save is disabled and clear is enabled after saving', () => {
            const player = createPlayer();
            player.handleFiles([TRACK_A]);
            player.handleSavePlaylist();
            expect(player.savePlBtn.disabled).toBeTruthy();
            expect(player.clearPlBtn.disabled).toBeFalsy();
        });

        it('clear is disabled and save is re-enabled after clearing', () => {
            const player = createPlayer();
            player.handleFiles([TRACK_A]);
            player.handleSavePlaylist();
            player.handleClearPlaylist();
            expect(player.clearPlBtn.disabled).toBeTruthy();
            expect(player.savePlBtn.disabled).toBeFalsy();
        });

        it('save is disabled when the playlist is empty even if isDirty is true', () => {
            const player = createPlayer();
            player.handleFiles([TRACK_A]);
            player.removeTrack(0);
            expect(player.savePlBtn.disabled).toBeTruthy();
        });

        it('save becomes enabled after a drag-and-drop reorder', () => {
            const player = createPlayer();
            player.handleFiles([TRACK_A, TRACK_B]);
            player.handleSavePlaylist();

            player.tracks = [
                { filePath: '/music/b.mp3', trackName: 'Track B' },
                { filePath: '/music/a.mp3', trackName: 'Track A' },
            ];
            player.trackList = ['file:///music/b.mp3', 'file:///music/a.mp3'];
            player.isDirty = true;
            player.updatePlaylistActions();

            expect(player.savePlBtn.disabled).toBeFalsy();
        });
    });

    describe('handleSavePlaylist', () => {
        const TRACK_A = {
            filePath: '/music/a.mp3',
            fileUrl: 'file:///music/a.mp3',
            trackName: 'Track A',
        };

        beforeEach(() => {
            localStorage.clear();
        });

        it('persists tracks and currentSongIndex to storage', () => {
            const player = createPlayer();
            player.handleFiles([TRACK_A]);
            player.handleSavePlaylist();
            const stored = JSON.parse(localStorage.getItem('spiral:playlist'));
            expect(stored.currentSongIndex).toBe(0);
            expect(stored.tracks).toStrictEqual([
                { filePath: '/music/a.mp3', trackName: 'Track A' },
            ]);
        });

        it('disables Save and enables Clear', () => {
            const player = createPlayer();
            player.handleFiles([TRACK_A]);
            player.handleSavePlaylist();
            expect(player.isDirty).toBeFalsy();
            expect(player.hasSavedPlaylist).toBeTruthy();
            expect(player.savePlBtn.disabled).toBeTruthy();
            expect(player.clearPlBtn.disabled).toBeFalsy();
        });

        it('temporarily shows "Saved!" then restores the button label', () => {
            vi.useFakeTimers();
            const player = createPlayer();
            player.handleFiles([TRACK_A]);

            player.handleSavePlaylist();
            expect(player.savePlBtn.textContent).toBe('Saved!');

            vi.runAllTimers();
            expect(player.savePlBtn.textContent).toBe('Save Playlist');
            vi.useRealTimers();
        });
    });

    describe('handleClearPlaylist', () => {
        const TRACK_A = {
            filePath: '/music/a.mp3',
            fileUrl: 'file:///music/a.mp3',
            trackName: 'Track A',
        };

        beforeEach(() => {
            localStorage.clear();
        });

        it('removes the saved playlist from storage', () => {
            const player = createPlayer();
            player.handleFiles([TRACK_A]);
            player.handleSavePlaylist();
            player.handleClearPlaylist();
            expect(localStorage.getItem('spiral:playlist')).toBeNull();
        });

        it('leaves the in-memory playlist intact', () => {
            const player = createPlayer();
            player.handleFiles([TRACK_A]);
            player.handleSavePlaylist();
            player.handleClearPlaylist();
            expect(player.tracks).toHaveLength(1);
            expect(player.trackList).toHaveLength(1);
        });

        it('disables Clear and re-enables Save when tracks remain', () => {
            const player = createPlayer();
            player.handleFiles([TRACK_A]);
            player.handleSavePlaylist();
            player.handleClearPlaylist();
            expect(player.hasSavedPlaylist).toBeFalsy();
            expect(player.isDirty).toBeTruthy();
            expect(player.clearPlBtn.disabled).toBeTruthy();
            expect(player.savePlBtn.disabled).toBeFalsy();
        });
    });

    describe('restorePlaylist', () => {
        const FILES = [
            { filePath: '/music/a.mp3', fileUrl: 'file:///music/a.mp3', trackName: 'Track A' },
            { filePath: '/music/b.mp3', fileUrl: 'file:///music/b.mp3', trackName: 'Track B' },
        ];

        it('populates the playlist from provided files', () => {
            const player = createPlayer();
            player.restorePlaylist(FILES, 0);
            expect(player.trackList).toHaveLength(2);
            expect(player.tracks).toHaveLength(2);
        });

        it('sets currentSongIndex to the provided restoreIndex', () => {
            const player = createPlayer();
            player.restorePlaylist(FILES, 1);
            expect(player.currentSongIndex).toBe(1);
            expect(player.audio.src).toContain('file:///music/b.mp3');
            expect(player.trackNameEl.textContent).toBe('Track B');
        });

        it('falls back to index 0 when restoreIndex is out of range', () => {
            const player = createPlayer();
            player.restorePlaylist(FILES, 99);
            expect(player.currentSongIndex).toBe(0);
        });

        it('clears isDirty and sets hasSavedPlaylist', () => {
            const player = createPlayer();
            player.restorePlaylist(FILES, 0);
            expect(player.isDirty).toBeFalsy();
            expect(player.hasSavedPlaylist).toBeTruthy();
        });

        it('enables Clear and disables Save after restore', () => {
            const player = createPlayer();
            player.restorePlaylist(FILES, 0);
            expect(player.clearPlBtn.disabled).toBeFalsy();
            expect(player.savePlBtn.disabled).toBeTruthy();
        });

        it('does nothing when the files array is empty', () => {
            const player = createPlayer();
            player.restorePlaylist([], 0);
            expect(player.trackList).toHaveLength(0);
            expect(player.hasSavedPlaylist).toBeFalsy();
        });
    });

    describe('auto-save index on track change', () => {
        const FILES = [
            { filePath: '/music/a.mp3', fileUrl: 'file:///music/a.mp3', trackName: 'Track A' },
            { filePath: '/music/b.mp3', fileUrl: 'file:///music/b.mp3', trackName: 'Track B' },
            { filePath: '/music/c.mp3', fileUrl: 'file:///music/c.mp3', trackName: 'Track C' },
        ];

        beforeEach(() => {
            localStorage.clear();
        });

        it('updates the stored index when jumpToTrack is called and hasSavedPlaylist is true', () => {
            const player = createPlayer();
            player.restorePlaylist(FILES, 0);
            player.jumpToTrack(2);
            const stored = JSON.parse(localStorage.getItem('spiral:playlist'));
            expect(stored.currentSongIndex).toBe(2);
        });

        it('updates the stored index when skipTrack is called and hasSavedPlaylist is true', () => {
            const player = createPlayer();
            player.restorePlaylist(FILES, 0);
            player.skipTrack(1);
            const stored = JSON.parse(localStorage.getItem('spiral:playlist'));
            expect(stored.currentSongIndex).toBe(1);
        });

        it('does not write to storage when hasSavedPlaylist is false', () => {
            const player = createPlayer();
            player.handleFiles(FILES);
            player.jumpToTrack(1);
            expect(localStorage.getItem('spiral:playlist')).toBeNull();
        });
    });
});
