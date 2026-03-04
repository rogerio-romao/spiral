import AlgorithmLoader from './AlgorithmLoader.js';
import htmlEscape from './utils/htmlEscape.js';

/**
 * MusicPlayer — handles audio playback, playlist management,
 * and progress bar.
 */
export default class MusicPlayer {
    // INSTANCE PROPERTIES
    showPlayer = false;
    showRemaining = false;
    playlistIsOpen = false;
    trackSkipWhilePlayingTimeout = null;
    trackSkipIntervalInMs = 200;
    trackList = [];
    trackNames = [];
    currentSongIndex = 0;
    isPlaying = false;
    playlistEls = null;
    eqRafId = null;

    constructor() {
        // used for smoothing the EQ animation by keeping track of previous values, and for zeroing out the display when music is paused
        this.previousFreqBandValues = [0, 0, 0, 0, 0];

        this.initDomRefs();
        this.bindEvents();
    }

    initDomRefs() {
        this.player = document.querySelector('#player');
        this.input = document.querySelector('#input');
        this.label = document.querySelector('#click-label');
        this.playListEl = document.querySelector('#playlist');
        this.playBtn = document.querySelector('#play');
        this.iconPlay = document.querySelector('#icon-play');
        this.iconPause = document.querySelector('#icon-pause');
        this.stopBtn = document.querySelector('#stop');
        this.prevBtn = document.querySelector('#prev');
        this.nextBtn = document.querySelector('#next');
        this.audio = document.querySelector('#audio');
        this.progress = document.querySelector('#progress-percent');
        this.elapsedEl = document.querySelector('#time-elapsed');
        this.totalEl = document.querySelector('#time-total');
        this.trackNameEl = document.querySelector('#track-name');
        this.playlistToggle = document.querySelector('#playlist-toggle');
        this.accordionEl = document.querySelector('#playlist-accordion');
        this.eqCanvas = document.querySelector('#eq-display');
        this.eqCtx = this.eqCanvas?.getContext('2d');
    }

    bindEvents() {
        this.input.addEventListener('change', () => this.handleFiles());

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
    }

    onLoadedMetadata() {
        this.totalEl.textContent = this.formatTime(this.audio.duration);
        this.elapsedEl.textContent = '0:00';
    }

    onElapsedClick() {
        this.showRemaining = !this.showRemaining;
        this.displayProgress();
    }

    /**
     * Handle playlist clicks using event delegation.
     * Uses `closest` to safely traverse UP to the parent `.list-item` to get the `data-index`, ensuring it works correctly even if a child element (like the text span) was clicked, and also ensuring that clicks on the "remove" button don't trigger a track jump.
     * @param {MouseEvent} e - The click event.
     */
    onPlaylistClick(e) {
        const listItem = e.target.closest('.list-item');
        if (listItem && !e.target.closest('.remove-track')) {
            const index = Number(listItem.dataset.index);
            this.jumpToTrack(index);
        }
    }

    /** Process file input and build the playlist. */
    handleFiles() {
        // Pause playback while updating the playlist, and remember if we were playing so we can resume if needed
        const wasPlaying = this.isPlaying;
        this.audio.pause();

        this.elapsedEl.textContent = '';
        this.totalEl.textContent = '';

        const { files } = this.input;
        if (!files?.length) {
            return;
        }

        // If this is the first time loading tracks, we need to set up the audio source and UI. If not, we'll just append to the existing playlist.
        const isFirstLoad = this.trackList.length === 0;

        for (const file of files) {
            const baseName = file.name.includes('.')
                ? file.name.slice(0, file.name.indexOf('.'))
                : file.name;

            // Don't add the same track multiple times if the user selects it again in the file dialog
            if (this.trackNames.includes(baseName)) {
                continue;
            }
            this.trackNames.push(baseName);

            const blob = globalThis.URL.createObjectURL(file);
            this.trackList.push(blob);
        }

        this.renderPlaylist();

        if (isFirstLoad) {
            this.currentSongIndex = 0;
            this.audio.src = this.trackList[this.currentSongIndex];
            this.isPlaying = false;
            this.togglePlayPauseIcon(false);
        } else if (wasPlaying) {
            this.isPlaying = true;
            this.togglePlayPauseIcon(true);
            this.audio.play();
        }

        this.playlistToggle.classList.add('tracks-present');
        this.updateTrackName();
        this.input.value = '';
    }

    /** Play or pause the current track. */
    playTrack() {
        if (!this.isPlaying && this.playlistEls) {
            this.isPlaying = true;
            this.togglePlayPauseIcon(true);
            this.updatePlaylistStyle();
            this.startEq();
            this.audio.play();
        } else if (this.playlistEls) {
            this.isPlaying = false;
            this.playlistEls[this.currentSongIndex].style.color = 'rgba(255, 165, 0, 0.5)';
            this.togglePlayPauseIcon(false);
            this.stopEq();
            this.audio.pause();
        }
    }

    /** Stop playback and rewind. */
    stopPlayback() {
        if (this.isPlaying) {
            this.audio.pause();
            this.audio.currentTime = 0;
            this.isPlaying = false;
            this.togglePlayPauseIcon(false);
            this.stopEq();
            [...this.playlistEls].map((el) => (el.style.color = '#555'));
            this.playlistEls[this.currentSongIndex].style.color = 'rgba(255, 165, 0, 0.5)';
        } else if (this.playlistEls) {
            this.audio.currentTime = 0;
        }
    }

    /** Cue and play the previous track. */
    playPrev() {
        this.skipTrack(-1);
    }

    /** Cue and play the next track. */
    playNext() {
        this.skipTrack(1);
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
        this.progress.value = 0;
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
            clearTimeout(this.trackSkipWhilePlayingTimeout);
            this.trackSkipWhilePlayingTimeout = setTimeout(() => {
                this.audio.play();
                this.togglePlayPauseIcon(true);
                this.startEq();
            }, this.trackSkipIntervalInMs);
        } else {
            this.playlistEls[this.currentSongIndex].style.color = 'rgba(255, 165, 0, 0.5)';
        }
    }

    /** Update the progress bar and time displays based on current playback position. */
    displayProgress() {
        // Guard against division by zero if metadata isn't loaded yet
        if (this.audio.duration === 0) {
            this.progress.value = 0;
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
     * Scrub to clicked position on the progress bar.
     * @param {MouseEvent} e - The mouse event from the progress bar click.
     */
    scrub(e) {
        if (!this.playlistEls) {
            return;
        }

        const scrubTime = (e.offsetX / this.progress.offsetWidth) * this.audio.duration;
        this.audio.currentTime = scrubTime;
        if (this.isPlaying) {
            this.audio.play();
        }
    }

    /** Style the playlist to highlight the current track. */
    updatePlaylistStyle() {
        [...this.playlistEls].map((el) => (el.style.color = '#555'));
        this.playlistEls[this.currentSongIndex].style.color = 'orange';
        this.playlistEls[this.currentSongIndex].scrollIntoView({ block: 'nearest' });
        this.updateTrackName();
    }

    /**
     * Toggle the play/pause icon SVGs.
     * @param {boolean} playing - Whether the player is currently playing.
     */
    togglePlayPauseIcon(playing) {
        this.iconPlay.style.display = playing ? 'none' : 'inline';
        this.iconPause.style.display = playing ? 'inline' : 'none';
    }

    /** Toggle the playlist accordion open/closed. */
    togglePlaylist() {
        this.playlistIsOpen = !this.playlistIsOpen;
        this.accordionEl.classList.toggle('open', this.playlistIsOpen);
        this.playlistToggle.classList.toggle('open', this.playlistIsOpen);
    }

    /** Update the now-playing track name display. */
    updateTrackName() {
        if (this.trackNames.length === 0) {
            return;
        }
        this.trackNameEl.textContent = this.trackNames[this.currentSongIndex] ?? '';
    }

    /**
     * Jump directly to a track and start playback.
     * @param {number} index - The index of the track to jump to.
     */
    jumpToTrack(index) {
        if (!this.playlistEls || index === this.currentSongIndex) {
            return;
        }
        this.audio.pause();
        this.audio.currentTime = 0;
        this.progress.value = 0;
        this.elapsedEl.textContent = '0:00';
        this.totalEl.textContent = '0:00';
        this.currentSongIndex = index;
        this.updatePlaylistStyle();
        this.audio.src = this.trackList[this.currentSongIndex];
        clearTimeout(this.trackSkipWhilePlayingTimeout);
        this.trackSkipWhilePlayingTimeout = setTimeout(() => {
            this.isPlaying = true;
            this.audio.play();
            this.togglePlayPauseIcon(true);
            this.startEq();
        }, this.trackSkipIntervalInMs);
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
        listItem.dataset.index = index;
        listItem.innerHTML = `
            <span class="track-name">${htmlEscape(baseName)}</span>
            <button class="remove-track" title="Remove track">remove</button>
        `;
        listItem.querySelector('.remove-track').addEventListener('click', (e) => {
            e.stopPropagation();
            const idx = Number.parseInt(listItem.dataset.index, 10);
            this.removeTrack(idx);
        });
        return listItem;
    }

    /** Render the entire playlist from trackList. */
    renderPlaylist() {
        this.playListEl.innerHTML = '';
        for (let i = 0; i < this.trackList.length; i++) {
            const fileName = this.trackNames[i];
            const listItem = this.createPlaylistItem(fileName, i);
            this.playListEl.append(listItem);
        }
        this.playlistEls = document.querySelectorAll('.list-item');
        this.bindDragEvents(this.playlistEls);
        this.updatePlaylistStyle();
    }

    /** Update data-index attributes for all list items. */
    updatePlaylistIndices() {
        const items = this.playListEl.querySelectorAll('.list-item');
        for (let i = 0; i < items.length; i++) {
            items[i].dataset.index = i;
        }
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
     * Drag start - store the index of dragged item.
     * @param {DragEvent} e - The drag event.
     */
    handleDragStart(e) {
        this.draggedIndex = Number.parseInt(e.target.dataset.index, 10);
        e.target.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
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
     * Drag enter - visual feedback.
     * @param {DragEvent} e - The drag event.
     */
    handleDragEnter(e) {
        e.target.classList.add('drag-over');
    }

    /**
     * Drag leave - remove visual feedback.
     * @param {DragEvent} e - The drag event.
     */
    handleDragLeave(e) {
        e.target.classList.remove('drag-over');
    }

    /**
     * Drag end - clean up visual feedback.
     * @param {DragEvent} e - The drag event.
     */
    handleDragEnd(e) {
        e.target.classList.remove('dragging');
        this.draggedIndex = null;
    }

    /**
     * Drop - reorder tracks.
     * @param {DragEvent} e - The drag event.
     */
    handleDrop(e) {
        e.preventDefault();
        const targetItem = e.target.closest('.list-item');
        if (!targetItem) {
            return;
        }
        const dropIndex = Number.parseInt(targetItem.dataset.index, 10);
        if (this.draggedIndex === null || this.draggedIndex === dropIndex) {
            return;
        }

        const [removed] = this.trackList.splice(this.draggedIndex, 1);
        this.trackList.splice(dropIndex, 0, removed);

        const [removedName] = this.trackNames.splice(this.draggedIndex, 1);
        this.trackNames.splice(dropIndex, 0, removedName);

        if (this.currentSongIndex === this.draggedIndex) {
            this.currentSongIndex = dropIndex;
        } else if (
            this.draggedIndex < this.currentSongIndex &&
            dropIndex >= this.currentSongIndex
        ) {
            this.currentSongIndex -= 1;
        } else if (
            this.draggedIndex > this.currentSongIndex &&
            dropIndex <= this.currentSongIndex
        ) {
            this.currentSongIndex += 1;
        }

        this.renderPlaylist();
        this.updatePlaylistIndices();
        this.updatePlaylistStyle();
    }

    /**
     * Remove a track from the playlist.
     * @param {number} index - The index of the track to remove.
     */
    removeTrack(index) {
        if (index < 0 || index >= this.trackList.length) {
            return;
        }

        globalThis.URL.revokeObjectURL(this.trackList[index]);

        this.trackList.splice(index, 1);
        this.trackNames.splice(index, 1);

        if (this.trackList.length === 0) {
            this.audio.src = '';
            this.currentSongIndex = 0;
            this.playlistEls = null;
            this.playListEl.innerHTML = '';
            this.isPlaying = false;
            this.togglePlayPauseIcon(false);
            this.trackNameEl.textContent = '';
            this.playlistToggle.classList.remove('tracks-present');
            this.elapsedEl.textContent = '';
            this.totalEl.textContent = '';
            this.stopEq();
            this.eqCanvas.style.display = 'none';
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
                this.audio.play();
            }
        }

        this.renderPlaylist();
        this.updatePlaylistIndices();
        this.updatePlaylistStyle();
    }

    /** Start the EQ animation loop. */
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
        this.drawFlatEq();
    }

    /** Draw the EQ with current frequency data. */
    drawEq() {
        if (!this.eqCtx) {
            return;
        }

        const { width, height } = this.eqCanvas;
        const bandCount = 5;
        const bandWidth = width / bandCount;
        const smoothing = 0.7;

        const newBands =
            AlgorithmLoader.frequencyAnalyser && this.isPlaying
                ? AlgorithmLoader.frequencyAnalyser.getBands()
                : [0, 0, 0, 0, 0];

        this.previousFreqBandValues = this.previousFreqBandValues.map(
            (prev, i) => prev * smoothing + newBands[i] * (1 - smoothing),
        );

        this.eqCtx.clearRect(0, 0, width, height);
        this.eqCtx.fillStyle = '#32cd32';

        for (let i = 0; i < bandCount; i++) {
            const bandHeight = Math.max(1, this.previousFreqBandValues[i] * height);
            const x = i * bandWidth;
            const y = height - bandHeight;
            this.eqCtx.fillRect(x + 1, y, bandWidth - 2, bandHeight);
        }

        this.eqRafId = requestAnimationFrame(() => this.drawEq());
    }

    /** Draw flat (zero) EQ bars. */
    drawFlatEq() {
        if (!this.eqCtx) {
            return;
        }

        const { width, height } = this.eqCanvas;
        const bandCount = 5;
        const bandWidth = width / bandCount;

        this.eqCtx.clearRect(0, 0, width, height);
        this.eqCtx.fillStyle = '#32cd32';

        for (let i = 0; i < bandCount; i++) {
            const x = i * bandWidth;
            this.eqCtx.fillRect(x + 1, height - 1, bandWidth - 2, 1);
        }
    }

    /** Clean up resources (blob URLs, etc.) on app close. */
    destroy() {
        for (const url of this.trackList) {
            globalThis.URL.revokeObjectURL(url);
        }
    }

    /** Toggle player panel visibility. Called by KeyboardController. */
    togglePlayerVisibility() {
        this.showPlayer = !this.showPlayer;
        this.player.style.display = this.showPlayer ? 'block' : 'none';
    }
}
