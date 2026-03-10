// oxlint-disable max-lines
import AlgorithmLoader from './AlgorithmLoader.js';
import htmlEscape from './utils/htmlEscape.js';
import { clearPlaylist, savePlaylist } from './utils/PlaylistStorage.js';

/** @typedef {{ filePath: string, trackName: string, fileUrl: string }[]} trackFiles */

/**
 * MusicPlayer — handles audio playback, playlist management,
 * and progress bar, as well as the EQ visualization.
 * It also manages the UI state for play/pause icons, track highlighting, and playlist accordion.
 * The class is designed to be instantiated once and manages its own DOM references and event listeners.
 */
export default class MusicPlayer {
    currentSongIndex = 0;
    /** @type {number|null} */
    eqRafId = null;
    /**
     * This is set by the AlgorithmLoader when it creates the FrequencyAnalyser, so that the MusicPlayer can use it to drive the EQ visualization. This is a bit of a circular dependency, but it allows us to keep the audio graph setup in one place (the FrequencyAnalyser) while still enabling the MusicPlayer to control the EQ display.
     * @type {import('./FrequencyAnalyser.js').default|null}
     */
    frequencyAnalyser = null;
    isPlaying = false;
    /** @type {NodeListOf<HTMLLIElement>|null} */
    playlistEls = null;
    playlistIsOpen = false;
    playToggleFadeDurationInMs = 80;
    showPlayer = true;
    showRemaining = false;
    trackSkipIntervalInMs = 200;
    /** @type {ReturnType<typeof setTimeout>|null} */
    trackSkipWhilePlayingTimeout = null;

    /**
     * Runtime audio source URLs (file://) in playlist order.
     * @type {string[]}
     */
    trackList = [];

    /**
     * Persisted track metadata in playlist order.
     * Each entry is the durable record used for saving and restoring the playlist.
     * @type {Array<{ filePath: string, trackName: string }>}
     */
    tracks = [];

    /** True when the in-memory playlist differs from the last saved playlist. */
    isDirty = false;
    /** True when a saved playlist currently exists in storage. */
    hasSavedPlaylist = false;

    // used for smoothing the EQ animation by keeping track of previous values, and for zeroing out the display when music is paused
    previousFreqBandValues = [0, 0, 0, 0, 0];

    constructor() {
        this.initDomRefs();
        this.bindEvents();
    }

    /** Bind drag-and-drop events to playlist items.
     * This allows users to reorder tracks in the playlist by dragging and dropping list items. The handlers manage the drag state and update the track order accordingly when an item is dropped.
     * @param {NodeListOf<HTMLLIElement>} playlistEls - The list item elements to bind events to.
     */
    bindDragEvents(playlistEls) {
        for (const playlistItem of playlistEls) {
            playlistItem.addEventListener('dragstart', (e) => this.handleDragStart(e));
            playlistItem.addEventListener('dragover', (e) => this.handleDragOver(e));
            playlistItem.addEventListener('drop', (e) => this.handleDrop(e));
            playlistItem.addEventListener('dragenter', (e) => this.handleDragEnter(e));
            playlistItem.addEventListener('dragleave', (e) => this.handleDragLeave(e));
            playlistItem.addEventListener('dragend', (e) => this.handleDragEnd(e));
        }
    }

    /**
     * Bind all event listeners for player controls and UI elements.
     * This method attaches handlers for file input, playback controls,
     * progress bar, playlist toggling, and playlist item clicks.
     * Should be called once in the constructor.
     */
    bindEvents() {
        this.label.addEventListener('click', () => this.openFilePicker());

        this.playBtn.addEventListener('click', () => this.playTrack());
        this.stopBtn.addEventListener('click', () => this.stopPlayback());
        this.nextBtn.addEventListener('click', () => this.playNext());
        this.prevBtn.addEventListener('click', () => this.playPrev());

        this.audio.addEventListener('ended', () => this.playNext());
        this.audio.addEventListener('timeupdate', () => this.displayProgress());
        this.audio.addEventListener('loadedmetadata', () => this.onLoadedMetadata());

        this.progress.addEventListener('mousedown', () => this.audio.pause());
        this.progress.addEventListener('mouseup', (e) => this.scrub(e));
        this.elapsedEl.addEventListener('click', () => this.onElapsedClick());

        this.playlistToggle.addEventListener('click', () => this.togglePlaylist());
        this.playListEl.addEventListener('click', (e) => this.onPlaylistClick(e));
        this.savePlBtn.addEventListener('click', () => this.handleSavePlaylist());
        this.clearPlBtn.addEventListener('click', () => this.handleClearPlaylist());
    }

    /**
     * Create a playlist item DOM element.
     * @param {string} baseName - The name of the track.
     * @param {number} index - The index of the track in the playlist.
     * @returns {HTMLLIElement} The created list item element.
     */
    createPlaylistItem(baseName, index) {
        const listItem = document.createElement('li');
        listItem.classList.add('list-item');
        listItem.setAttribute('draggable', 'true');
        listItem.dataset['index'] = String(index);
        listItem.innerHTML = /* html */ `
            <span class="track-name">${htmlEscape(baseName)}</span>
            <button class="remove-track" title="Remove track">remove</button>
        `;

        listItem.querySelector('.remove-track').addEventListener('click', (e) => {
            e.stopPropagation();
            const idx = Number(listItem.dataset['index']);
            this.removeTrack(idx);
        });
        return listItem;
    }

    /** Update the progress bar and time displays based on current playback position. */
    displayProgress() {
        // Guard against division by zero or NaN if metadata isn't loaded yet
        if (!Number.isFinite(this.audio.duration) || this.audio.duration === 0) {
            this.progress.value = '0';
            this.elapsedEl.textContent = '';
            this.totalEl.textContent = '';
            return;
        }

        const { currentTime, duration } = this.audio;
        const progressPercent = (currentTime / duration) * 100;
        this.progress.value = progressPercent.toFixed(2);

        this.elapsedEl.textContent = this.showRemaining
            ? `-${this.formatTime(duration - currentTime)}`
            : this.formatTime(currentTime);
        this.totalEl.textContent = this.formatTime(duration);
    }

    /** Draw the EQ with current frequency data.
     * If `flat` is true, draw flat bars (used when music is paused). Otherwise, use frequency data from the AlgorithmLoader's frequencyAnalyser to draw dynamic bars. The animation is smoothed by blending current frequency values with previous ones.
     * @param {boolean} flat - Whether to draw flat bars (true when music is paused) or dynamic bars based on frequency data (false when music is playing).
     */
    drawEq(flat = false) {
        if (!this.eqCtx) {
            return;
        }

        const { width, height } = this.eqCanvas;
        const bandCount = 5;
        const bandWidth = width / bandCount;

        this.eqCtx.clearRect(0, 0, width, height);
        this.eqCtx.fillStyle = '#32cd32';

        let bands = [0, 0, 0, 0, 0];

        if (!flat) {
            const smoothing = 0.7;
            const newBands =
                AlgorithmLoader.frequencyAnalyser && this.isPlaying
                    ? AlgorithmLoader.frequencyAnalyser.getBands()
                    : [0, 0, 0, 0, 0];

            this.previousFreqBandValues = this.previousFreqBandValues.map(
                (prev, i) => prev * smoothing + newBands[i] * (1 - smoothing),
            );
            bands = this.previousFreqBandValues;
        }

        for (let i = 0; i < bandCount; i++) {
            const bandHeight = flat ? 1 : Math.max(1, bands[i] * height);
            const x = i * bandWidth;
            const y = height - bandHeight;
            this.eqCtx.fillRect(x + 1, y, bandWidth - 2, bandHeight);
        }

        if (!flat) {
            this.eqRafId = requestAnimationFrame(() => this.drawEq());
        }
    }

    /**
     * Schedule playback after a brief delay to allow for track switching.
     * Ensures smooth transitions between tracks by avoiding stutter.
     * @param {number|null} overrideIntervalInMs - Optional override for the delay interval in milliseconds. If not provided, uses the default `trackSkipIntervalInMs`.
     */
    enqueuePlay(overrideIntervalInMs = null) {
        clearTimeout(this.trackSkipWhilePlayingTimeout);

        this.trackSkipWhilePlayingTimeout = setTimeout(() => {
            this.isPlaying = true;
            this.fadePlay();
            this.togglePlayPauseIcon(true);
            this.startEq();
        }, overrideIntervalInMs ?? this.trackSkipIntervalInMs);
    }

    /**
     * Fade gain to zero via the GainNode, then pause playback.
     * Eliminates the audible click that occurs with an abrupt pause.
     */
    async fadePause() {
        if (this.frequencyAnalyser) {
            await this.frequencyAnalyser.fadeTo(0, this.playToggleFadeDurationInMs);
        }
        this.audio.pause();
    }

    /**
     * Start audio playback at zero gain, then fade in to full gain.
     * Eliminates the audible click that occurs with an abrupt resume.
     */
    async fadePlay() {
        this.frequencyAnalyser?.setGain(0);

        try {
            await this.audio.play();
        } catch {
            this.frequencyAnalyser?.setGain(1);
            return;
        }

        await this.frequencyAnalyser?.fadeTo(1, this.playToggleFadeDurationInMs);
    }

    /**
     * Format seconds into M:SS string.
     * @param {number} seconds - The time in seconds to format.
     * @returns {string} The formatted time string in M:SS format.
     */
    formatTime(seconds) {
        // this should never happen, but just in case
        if (!Number.isFinite(seconds) || seconds <= 0 || Number.isNaN(seconds)) {
            return '0:00';
        }

        const minutes = Math.floor(seconds / 60);
        const secondsRemaining = Math.floor(seconds % 60);

        return `${minutes}:${secondsRemaining.toString().padStart(2, '0')}`;
    }

    /**
     * Drag end - clean up visual feedback.
     * @param {DragEvent} e - The drag event.
     */
    handleDragEnd(e) {
        if (e.target instanceof HTMLElement) {
            e.target.classList.remove('dragging');
        }
        this.draggedIndex = null;
    }

    /**
     * Drag enter - visual feedback.
     * @param {DragEvent} e - The drag event.
     */
    handleDragEnter(e) {
        if (e.target instanceof HTMLElement) {
            e.target.classList.add('drag-over');
        }
    }

    /**
     * Drag leave - remove visual feedback.
     * @param {DragEvent} e - The drag event.
     */
    handleDragLeave(e) {
        if (e.target instanceof HTMLElement) {
            e.target.classList.remove('drag-over');
        }
    }

    /**
     * Drag start - store the index of dragged item.
     * @param {DragEvent} e - The drag event.
     */
    handleDragStart(e) {
        if (e.target instanceof HTMLElement) {
            this.draggedIndex = Number(e.target.dataset['index']);
            e.target.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
        }
    }

    /**
     * Drag over - allow dropping.
     * @param {DragEvent} e - The drag event.
     */
    handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    }

    /**
     * Handle drop event for drag-and-drop playlist reordering.
     * Moves the dragged track to the drop position and updates the playlist state, adjusting the current song index as needed to ensure the correct track continues playing if the currently playing track was moved.
     * @param {DragEvent} e - The drop event.
     */
    handleDrop(e) {
        e.preventDefault();
        if (!(e.target instanceof HTMLElement)) {
            return;
        }

        const targetItem = e.target.closest('.list-item');
        if (!targetItem || !(targetItem instanceof HTMLElement)) {
            return;
        }
        const dropIndex = Number(targetItem.dataset['index']);
        if (this.draggedIndex === null || this.draggedIndex === dropIndex) {
            return;
        }

        const [removed] = this.trackList.splice(this.draggedIndex, 1);
        this.trackList.splice(dropIndex, 0, removed);

        const [removedTrack] = this.tracks.splice(this.draggedIndex, 1);
        this.tracks.splice(dropIndex, 0, removedTrack);

        this.isDirty = true;

        if (this.currentSongIndex === this.draggedIndex) {
            // moving the currently playing track - update currentSongIndex to new location
            this.currentSongIndex = dropIndex;
        } else if (
            // track being moved was before the currently playing track, and now is after, decrement currentSongIndex to account for the shift
            this.draggedIndex < this.currentSongIndex &&
            dropIndex >= this.currentSongIndex
        ) {
            this.currentSongIndex -= 1;
        } else if (
            // track being moved was after the currently playing track, and now is before, increment currentSongIndex to account for the shift
            this.draggedIndex > this.currentSongIndex &&
            dropIndex <= this.currentSongIndex
        ) {
            this.currentSongIndex += 1;
        }

        this.renderPlaylist();
        this.updatePlaylistIndices();
        this.updatePlaylistStyle();
        this.updatePlaylistActions();
    }

    /**
     * Add resolved file entries to the playlist.
     * Avoids duplicates by path, updates the UI, and manages playback state as needed.
     * @param {trackFiles} files - Resolved file entries from the Electron dialog or playlist restore.
     */
    handleFiles(files) {
        if (files.length === 0) {
            return;
        }

        // Pause playback while updating the playlist, and remember if we were playing so we can resume if needed
        const wasPlaying = this.isPlaying;
        this.audio.pause();

        this.elapsedEl.textContent = '';
        this.totalEl.textContent = '';

        // If this is the first time loading tracks, we need to set up the audio source and UI. If not, we'll just append to the existing playlist.
        const isFirstLoad = this.trackList.length === 0;

        let added = false;
        for (const { filePath, trackName, fileUrl } of files) {
            // Deduplicate by stable file path
            if (this.tracks.some((t) => t.filePath === filePath)) {
                continue;
            }
            this.tracks.push({ filePath, trackName });
            this.trackList.push(fileUrl);
            added = true;
        }
        if (added) {
            this.isDirty = true;
        }

        this.progressPanel.style.display = 'flex';
        this.updatePlaylistActions();
        this.renderPlaylist();

        if (isFirstLoad) {
            this.currentSongIndex = 0;
            this.audio.src = this.trackList[this.currentSongIndex];
            this.isPlaying = false;
            this.togglePlayPauseIcon(false);
        } else if (wasPlaying) {
            this.enqueuePlay();
        }

        this.playlistToggle.classList.add('tracks-present');
        this.updateTrackName();
    }

    /**
     * Persist the current playlist to storage and reset the dirty flag.
     * Temporarily shows "Saved!" on the button as lightweight feedback.
     */
    handleSavePlaylist() {
        const success = savePlaylist(this.tracks, this.currentSongIndex);
        if (success) {
            this.isDirty = false;
            this.hasSavedPlaylist = true;
            this.updatePlaylistActions();
            this.savePlBtn.textContent = 'Saved!';
            setTimeout(() => {
                this.savePlBtn.textContent = 'Save Playlist';
            }, 1500);
        } else {
            // Show error state, keep Save enabled for retry
            this.savePlBtn.textContent = 'Save Failed!';
            setTimeout(() => {
                this.savePlBtn.textContent = 'Save Playlist';
            }, 2000);
            // Optionally log error for debugging
            if (globalThis && globalThis.console) {
                globalThis.console.error(
                    'Failed to save playlist: localStorage unavailable or quota exceeded.',
                );
            }
        }
    }

    /**
     * Remove the persisted playlist from storage without affecting the in-memory playlist.
     * Re-enables Save if there are tracks loaded.
     */
    handleClearPlaylist() {
        clearPlaylist();
        this.hasSavedPlaylist = false;
        this.isDirty = this.tracks.length > 0;
        this.updatePlaylistActions();
    }

    /**
     * Restore a previously saved playlist on app startup.
     * Populates the playlist, then overrides the active track to the saved position.
     * Sets hasSavedPlaylist = true and clears the dirty flag.
     * @param {trackFiles} files - Resolved file entries.
     * @param {number} restoreIndex - Index of the track to make active; falls back to 0 if out of range.
     */
    restorePlaylist(files, restoreIndex) {
        if (files.length === 0) {
            return;
        }

        this.handleFiles(files);
        // check restoreIndex bounds
        if (restoreIndex > 0 && restoreIndex < this.trackList.length) {
            this.currentSongIndex = restoreIndex;
            this.audio.src = this.trackList[this.currentSongIndex];
            this.updatePlaylistStyle();
            this.updateTrackName();
        }

        this.isDirty = false;
        this.hasSavedPlaylist = true;
        this.updatePlaylistActions();
    }

    /**
     * Open the native file picker dialog via Electron and add selected tracks.
     */
    async openFilePicker() {
        const files = await /** @type {any} */ (globalThis).electronAPI.openFiles();
        if (files.length > 0) {
            this.handleFiles(files);
        }
    }

    /**
     * Initialize DOM references for all player UI elements.
     * This method queries the DOM for required elements and assigns them to instance properties.
     * Should be called once in the constructor.
     */
    initDomRefs() {
        /** @type {HTMLAudioElement} */
        this.audio = document.querySelector('#audio');
        /** @type {HTMLCanvasElement} */
        this.eqCanvas = document.querySelector('#eq-display');
        /** @type {HTMLButtonElement} */
        this.iconPause = document.querySelector('#icon-pause');
        /** @type {HTMLButtonElement} */
        this.iconPlay = document.querySelector('#icon-play');
        /** @type {HTMLDivElement} */
        this.player = document.querySelector('#player');
        /** @type {HTMLUListElement} */
        this.playListEl = document.querySelector('#playlist');
        /** @type {HTMLInputElement} */
        this.progress = document.querySelector('#progress-percent');
        /** @type {HTMLDivElement} */
        this.progressPanel = document.querySelector('#progress');
        /** @type {HTMLButtonElement} */
        this.savePlBtn = document.querySelector('#save-playlist');
        /** @type {HTMLButtonElement} */
        this.clearPlBtn = document.querySelector('#clear-playlist');

        this.accordionEl = document.querySelector('#playlist-accordion');
        this.elapsedEl = document.querySelector('#time-elapsed');
        this.label = document.querySelector('#click-label');
        this.nextBtn = document.querySelector('#next');
        this.playBtn = document.querySelector('#play');
        this.prevBtn = document.querySelector('#prev');
        this.playlistToggle = document.querySelector('#playlist-toggle');
        this.stopBtn = document.querySelector('#stop');
        this.totalEl = document.querySelector('#time-total');
        this.trackNameEl = document.querySelector('#track-name');

        this.eqCtx = this.eqCanvas?.getContext('2d');
    }

    /**
     * Jump to a specific track that was clicked in the playlist. If the clicked track is already playing, this will do nothing. If it's a different track, this will switch to it and start playback if the player was already playing, after a brief pause to allow the new track to load without stuttering.
     * Updates the audio source, resets progress, and updates the playlist UI.
     * @param {number} index - The index of the track to jump to.
     */
    jumpToTrack(index) {
        if (!this.playlistEls || index === this.currentSongIndex) {
            return;
        }

        this.audio.pause();
        this.audio.currentTime = 0;
        this.progress.value = '0';
        this.elapsedEl.textContent = '0:00';
        this.totalEl.textContent = '0:00';
        this.currentSongIndex = index;
        this.audio.src = this.trackList[this.currentSongIndex];
        this.updatePlaylistStyle();
        this.enqueuePlay();

        if (this.hasSavedPlaylist) {
            savePlaylist(this.tracks, this.currentSongIndex);
        }
    }

    /**
     * Toggle between showing elapsed and remaining time in the player UI.
     * Updates the progress display accordingly.
     */
    onElapsedClick() {
        this.showRemaining = !this.showRemaining;
        this.displayProgress();
    }

    /**
     * Handler for the audio element's 'loadedmetadata' event.
     * Updates the total duration and resets the elapsed time display.
     */
    onLoadedMetadata() {
        this.totalEl.textContent = this.formatTime(this.audio.duration);
        this.elapsedEl.textContent = '0:00';
    }

    /**
     * Handle playlist clicks using event delegation.
     * Uses `closest` to safely traverse UP to the parent `.list-item` to get the `data-index`, ensuring it works correctly even if a child element (like the text span) was clicked, and also ensuring that clicks on the "remove" button don't trigger a track jump.
     * @param {MouseEvent} e - The click event.
     */
    onPlaylistClick(e) {
        if (!(e.target instanceof HTMLElement)) {
            return;
        }

        const listItem = e.target.closest('.list-item');
        if (listItem && listItem instanceof HTMLElement && !e.target.closest('.remove-track')) {
            const index = Number(listItem.dataset['index']);
            this.jumpToTrack(index);
        }
    }

    /** Cue and play the next track. */
    playNext() {
        this.skipTrack(1);
    }

    /** Cue and play the previous track. */
    playPrev() {
        this.skipTrack(-1);
    }

    /**
     * Play or pause the current track.
     * Handles toggling playback state, updating UI, and EQ animation.
     */
    async playTrack() {
        if (!this.isPlaying && this.playlistEls) {
            this.isPlaying = true;
            this.togglePlayPauseIcon(true);
            this.updatePlaylistStyle();
            this.startEq();
            await this.fadePlay();
        } else if (this.playlistEls) {
            this.isPlaying = false;
            this.playlistEls[this.currentSongIndex].style.color = 'rgba(255, 165, 0, 0.5)';
            this.togglePlayPauseIcon(false);
            this.stopEq();
            await this.fadePause();
        }
    }

    /**
     * Remove a track from the playlist by index.
     * Updates the playlist, UI, and playback state as needed.
     * @param {number} index - The index of the track to remove.
     */
    removeTrack(index) {
        if (index < 0 || index >= this.trackList.length) {
            return;
        }

        this.trackList.splice(index, 1);
        this.tracks.splice(index, 1);
        this.isDirty = true;

        if (this.trackList.length === 0) {
            this.audio.src = '';
            this.currentSongIndex = 0;
            this.playlistEls = null;
            this.playListEl.innerHTML = '';
            this.progressPanel.style.display = 'none';
            this.isPlaying = false;
            this.togglePlayPauseIcon(false);
            this.trackNameEl.textContent = '';
            this.playlistToggle.classList.remove('tracks-present');
            this.elapsedEl.textContent = '';
            this.totalEl.textContent = '';
            this.stopEq();
            this.eqCanvas.style.display = 'none';
            this.updatePlaylistActions();
            return;
        }

        if (index < this.currentSongIndex) {
            this.currentSongIndex -= 1;
        } else if (index === this.currentSongIndex) {
            if (this.currentSongIndex >= this.trackList.length) {
                this.currentSongIndex = 0;
            }
            this.audio.src = this.trackList[this.currentSongIndex];
            if (this.isPlaying) {
                this.enqueuePlay();
            }
        }

        this.renderPlaylist();
        this.updatePlaylistIndices();
        this.updatePlaylistStyle();
        this.updatePlaylistActions();
    }

    /**
     * Render the entire playlist UI from the current track list.
     * Rebuilds the playlist DOM, binds drag events, and updates the playlist style.
     */
    renderPlaylist() {
        this.playListEl.innerHTML = '';
        const fragment = document.createDocumentFragment();
        for (let i = 0; i < this.tracks.length; i++) {
            const listItem = this.createPlaylistItem(this.tracks[i].trackName, i);
            fragment.append(listItem);
        }
        this.playListEl.append(fragment);
        this.playlistEls = document.querySelectorAll('.list-item');
        this.bindDragEvents(this.playlistEls);
        this.updatePlaylistStyle();
    }

    /**
     * Scrub to clicked position on the progress bar. While the user is dragging, the audio is paused to allow for smooth scrubbing without stuttering. When they release the mouse button, the audio will resume if it was playing before.
     * @param {MouseEvent} e - The mouse event from the progress bar click.
     */
    scrub(e) {
        if (!this.playlistEls) {
            return;
        }

        const scrubTime = (e.offsetX / this.progress.offsetWidth) * this.audio.duration;
        this.audio.currentTime = scrubTime;
        if (this.isPlaying) {
            // slight delay to avoid stutter when seeking while playing
            this.enqueuePlay(50);
        }
    }

    /** Play next/previous track, with a small pause before resuming playback.
     * @param {number} direction - The direction to skip: -1 for previous track, +1 for next track.
     */
    skipTrack(direction) {
        if (!this.playlistEls || this.trackList.length === 0) {
            return;
        }

        this.audio.pause();
        this.togglePlayPauseIcon(false);
        this.audio.currentTime = 0;
        this.progress.value = '0';
        this.elapsedEl.textContent = '0:00';
        this.totalEl.textContent = '0:00';

        this.currentSongIndex += direction;
        if (this.currentSongIndex < 0) {
            this.currentSongIndex = this.trackList.length - 1;
        } else if (this.currentSongIndex > this.trackList.length - 1) {
            this.currentSongIndex = 0;
        }

        this.updatePlaylistStyle();

        this.audio.src = this.trackList[this.currentSongIndex];
        if (this.isPlaying) {
            this.enqueuePlay();
        } else {
            this.playlistEls[this.currentSongIndex].style.color = 'rgba(255, 165, 0, 0.5)';
        }

        if (this.hasSavedPlaylist) {
            savePlaylist(this.tracks, this.currentSongIndex);
        }
    }

    /**
     * Start the EQ animation loop.
     * Resets previous frequency band values and begins drawing the EQ visualization.
     */
    startEq() {
        if (!this.eqCanvas || !this.eqCtx) {
            return;
        }
        this.previousFreqBandValues = [0, 0, 0, 0, 0];
        this.drawEq();
    }

    /** Stop the EQ animation loop and show flat bars. */
    stopEq() {
        if (this.eqRafId) {
            cancelAnimationFrame(this.eqRafId);
            this.eqRafId = null;
        }
        this.drawEq(true);
    }

    /**
     * Stop playback and rewind the current track.
     * Resets playback state, progress, and UI highlights.
     */
    async stopPlayback() {
        if (this.isPlaying) {
            await this.fadePause();
            this.audio.currentTime = 0;
            this.isPlaying = false;
            this.togglePlayPauseIcon(false);
            this.stopEq();
            [...this.playlistEls].map((el) => (el.style.color = '#555'));
            this.playlistEls[this.currentSongIndex].style.color = 'rgba(255, 165, 0, 0.5)';
        } else if (this.playlistEls) {
            // if already paused, just rewind to the beginning
            this.audio.currentTime = 0;
        }
    }

    /** Toggle music player panel visibility. Called by KeyboardController. */
    togglePlayerVisibility() {
        this.showPlayer = !this.showPlayer;
        this.player.style.display = this.showPlayer ? 'block' : 'none';
    }

    /**
     * Toggle the playlist accordion open or closed.
     * Updates the UI state for the playlist and its toggle button.
     */
    togglePlaylist() {
        this.playlistIsOpen = !this.playlistIsOpen;
        this.accordionEl.classList.toggle('open', this.playlistIsOpen);
        this.playlistToggle.classList.toggle('open', this.playlistIsOpen);
    }

    /**
     * Toggle the play/pause icon SVGs.
     * @param {boolean} isPlaying - Whether the player is currently playing.
     */
    togglePlayPauseIcon(isPlaying) {
        this.iconPlay.style.display = isPlaying ? 'none' : 'inline';
        this.iconPause.style.display = isPlaying ? 'inline' : 'none';
    }

    /** Sync the Save / Clear button enabled states with current dirty and saved-playlist flags. */
    updatePlaylistActions() {
        this.savePlBtn.disabled = !this.isDirty || this.tracks.length === 0;
        this.clearPlBtn.disabled = !this.hasSavedPlaylist;
    }

    /** Update data-index attributes for all list items. This is needed when the user reorders tracks by drag and drop or removes a track. */
    updatePlaylistIndices() {
        /** @type {NodeListOf<HTMLLIElement>} */
        const items = this.playListEl.querySelectorAll('.list-item');
        for (let i = 0; i < items.length; i++) {
            items[i].dataset['index'] = String(i);
        }
    }

    /**
     * Update the playlist UI to highlight the current track.
     * Resets all track colors, highlights the active one, scrolls it into view,
     * and updates the now-playing track name.
     */
    updatePlaylistStyle() {
        [...this.playlistEls].map((el) => (el.style.color = '#555'));
        this.playlistEls[this.currentSongIndex].style.color = 'orange';
        this.playlistEls[this.currentSongIndex].scrollIntoView({ block: 'nearest' });
        this.updateTrackName();
    }

    /** Update the now-playing track name display. */
    updateTrackName() {
        if (this.tracks.length === 0) {
            this.trackNameEl.textContent = '';
            return;
        }

        this.trackNameEl.textContent = this.tracks[this.currentSongIndex]?.trackName ?? '';
    }
}
