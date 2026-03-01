/**
 * MusicPlayer — handles audio playback, playlist management,
 * and progress bar.
 */
import AlgorithmLoader from './AlgorithmLoader.js';
import { htmlEscape } from './utils/htmlEscape.js';

export default class MusicPlayer {
    constructor() {
        // DOM references
        this.player = document.querySelector('#player');
        this.input = document.querySelector('#input');
        this.label = document.querySelector('#click-label');
        this.playList = document.querySelector('#playlist');
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

        // State
        this.playerShow = false;
        this.showRemaining = false;
        this.playlistOpen = false;
        this._jumpTimeout = null;
        this.player.style.display = 'none';
        this.trackList = [];
        this.trackNames = [];
        this.blobUrls = [];
        this.currentSong = 0;
        this.isPlaying = false;
        this.playlistEls = null;
        this._eqAnimationId = null;
        this._lastBandValues = [0, 0, 0, 0, 0];

        this._bindEvents();
    }

    /** Attach all event listeners. */
    _bindEvents() {
        this.input.addEventListener('change', () => this._handleFiles(), false);
        this.playBtn.addEventListener('click', () => this.playTrack());
        this.stopBtn.addEventListener('click', () => this.stopPlayback());
        this.nextBtn.addEventListener('click', () => this.playNext());
        this.prevBtn.addEventListener('click', () => this.playPrev());
        this.audio.addEventListener('loadedmetadata', () => {
            this.totalEl.textContent = this._formatTime(this.audio.duration);
            this.elapsedEl.textContent = '0:00';
        });
        this.audio.addEventListener('timeupdate', () =>
            this._displayProgress(),
        );
        this.audio.addEventListener('ended', () => this.playNext());
        this.progress.addEventListener('mousedown', () => this.audio.pause());
        this.progress.addEventListener('mouseup', (e) => this._scrub(e));
        this.elapsedEl.addEventListener('click', () => {
            this.showRemaining = !this.showRemaining;
            this._displayProgress();
        });
        this.playlistToggle.addEventListener('click', () =>
            this._togglePlaylist(),
        );
        this.playList.addEventListener('click', (e) => {
            const listItem = e.target.closest('.list-item');
            if (listItem && !e.target.closest('.remove-track')) {
                const index = parseInt(listItem.dataset.index, 10);
                this.jumpToTrack(index);
            }
        });
    }

    /** Process file input and build the playlist. */
    _handleFiles() {
        const wasPlaying = this.isPlaying;
        this.audio.pause();
        this.elapsedEl.textContent = '';
        this.totalEl.textContent = '';

        const files = this.input.files;
        if (!files?.length) return;

        const isFirstLoad = this.trackList.length === 0;

        for (let i = 0; i < files.length; i++) {
            const baseName =
                files[i].name.indexOf('.') > -1
                    ? files[i].name.slice(0, files[i].name.indexOf('.'))
                    : files[i].name;

            if (this.trackNames.includes(baseName)) {
                continue;
            }

            const listItem = document.createElement('li');
            listItem.classList.add('list-item');
            listItem.setAttribute('draggable', 'true');
            listItem.dataset.index = this.trackList.length;
            this.trackNames.push(baseName);
            listItem.innerHTML = `
                <span class="track-name">${htmlEscape(baseName)}</span>
                <button class="remove-track" title="Remove track">remove</button>
            `;
            listItem
                .querySelector('.remove-track')
                .addEventListener('click', (e) => {
                    e.stopPropagation();
                    const index = parseInt(listItem.dataset.index, 10);
                    this.removeTrack(index);
                });
            this.playList.append(listItem);
            const blobUrl = window.URL.createObjectURL(files[i]);
            this.trackList.push(blobUrl);
            this.blobUrls.push(blobUrl);
        }

        this._bindDragEvents();

        if (isFirstLoad) {
            this.currentSong = 0;
            this.audio.src = this.trackList[this.currentSong];
            this.isPlaying = false;
            this._setPlayIcon(false);
        } else if (wasPlaying) {
            this.isPlaying = true;
            this._setPlayIcon(true);
            this.audio.play();
        }

        this.playlistEls = document.querySelectorAll('.list-item');
        this._updatePlaylistIndices();
        this._updatePlaylistStyle();
        this.playlistToggle.classList.add('visible');
        this._updateTrackName();
        this.input.value = '';
    }

    /** Play or pause the current track. */
    playTrack() {
        if (!this.isPlaying && this.playlistEls) {
            this.isPlaying = true;
            this._setPlayIcon(true);
            this._updatePlaylistStyle();
            this._startEq();
            this.audio.play();
        } else if (this.playlistEls) {
            this.isPlaying = false;
            this.playlistEls[this.currentSong].style.color =
                'rgba(255, 165, 0, 0.5)';
            this._setPlayIcon(false);
            this._stopEq();
            this.audio.pause();
        }
    }

    /** Stop playback and rewind. */
    stopPlayback() {
        if (this.isPlaying) {
            this.audio.pause();
            this.audio.currentTime = 0;
            this.isPlaying = false;
            this._setPlayIcon(false);
            this._stopEq();
            [...this.playlistEls].forEach((el) => (el.style.color = '#555'));
            this.playlistEls[this.currentSong].style.color =
                'rgba(255, 165, 0, 0.5)';
        } else if (this.playlistEls) {
            this.audio.currentTime = 0;
        }
    }

    /** Cue and play the previous track. */
    playPrev() {
        if (!this.playlistEls) return;
        this.audio.pause();
        this.audio.currentTime = 0;
        this.progress.value = 0;
        this.elapsedEl.textContent = '0:00';
        this.totalEl.textContent = '0:00';
        this.currentSong--;
        if (this.currentSong < 0) this.currentSong = this.trackList.length - 1;
        this._updatePlaylistStyle();
        this.audio.src = this.trackList[this.currentSong];
        if (this.isPlaying) {
            this._startEq();
            this.audio.play();
        } else {
            this.playlistEls[this.currentSong].style.color =
                'rgba(255, 165, 0, 0.5)';
        }
    }

    /** Cue and play the next track. */
    playNext() {
        if (!this.playlistEls) return;
        this.audio.pause();
        this.audio.currentTime = 0;
        this.progress.value = 0;
        this.elapsedEl.textContent = '0:00';
        this.totalEl.textContent = '0:00';
        this.currentSong++;
        if (this.currentSong > this.trackList.length - 1) this.currentSong = 0;
        this._updatePlaylistStyle();
        this.audio.src = this.trackList[this.currentSong];
        if (this.isPlaying) {
            this._startEq();
            this.audio.play();
        } else {
            this.playlistEls[this.currentSong].style.color =
                'rgba(255, 165, 0, 0.5)';
        }
    }

    /** Update the progress bar and time displays based on current playback position. */
    _displayProgress() {
        if (this.audio.duration === 0) {
            this.progress.value = 0;
            return;
        }
        const currentTime = this.audio.currentTime;
        const duration = this.audio.duration;
        const progressPercent = (currentTime / duration) * 100;
        this.progress.value = Number.isFinite(progressPercent)
            ? progressPercent.toFixed(2)
            : '0';

        if (this.showRemaining) {
            this.elapsedEl.textContent =
                '-' + this._formatTime(duration - currentTime);
        } else {
            this.elapsedEl.textContent = this._formatTime(currentTime);
        }
        this.totalEl.textContent = this._formatTime(duration);
    }

    /** Format seconds into M:SS string. */
    _formatTime(seconds) {
        if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m}:${s.toString().padStart(2, '0')}`;
    }

    /** Scrub to clicked position on the progress bar. */
    _scrub(e) {
        if (!this.playlistEls) return;
        const scrubTime =
            (e.offsetX / this.progress.offsetWidth) * this.audio.duration;
        this.audio.currentTime = scrubTime;
        if (this.isPlaying) {
            this.audio.play();
        }
    }

    /** Style the playlist to highlight the current track. */
    _updatePlaylistStyle() {
        [...this.playlistEls].forEach((el) => (el.style.color = '#555'));
        this.playlistEls[this.currentSong].style.color = 'orange';
        this.playlistEls[this.currentSong].scrollIntoView({ block: 'nearest' });
        this._updateTrackName();
    }

    /** Toggle the play/pause icon SVGs. */
    _setPlayIcon(playing) {
        this.iconPlay.style.display = playing ? 'none' : 'inline';
        this.iconPause.style.display = playing ? 'inline' : 'none';
    }

    /** Toggle the playlist accordion open/closed. */
    _togglePlaylist() {
        this.playlistOpen = !this.playlistOpen;
        this.accordionEl.classList.toggle('open', this.playlistOpen);
        this.playlistToggle.classList.toggle('open', this.playlistOpen);
    }

    /** Update the now-playing track name display. */
    _updateTrackName() {
        if (this.trackNames.length === 0) return;
        this.trackNameEl.textContent = this.trackNames[this.currentSong] ?? '';
    }

    /** Jump directly to a track and start playback. */
    jumpToTrack(index) {
        if (!this.playlistEls || index === this.currentSong) return;
        this.audio.pause();
        this.audio.currentTime = 0;
        this.progress.value = 0;
        this.elapsedEl.textContent = '0:00';
        this.totalEl.textContent = '0:00';
        this.currentSong = index;
        this._updatePlaylistStyle();
        this.audio.src = this.trackList[this.currentSong];
        this.isPlaying = true;
        this._setPlayIcon(true);
        this._startEq();
        clearTimeout(this._jumpTimeout);
        this._jumpTimeout = setTimeout(() => this.audio.play(), 200);
    }

    /** Revoke all stored blob URLs to free memory. */
    _revokeBlobUrls() {
        for (const url of this.blobUrls) {
            window.URL.revokeObjectURL(url);
        }
        this.blobUrls = [];
        this.trackNames = [];
    }

    /** Render the entire playlist from trackList. */
    _renderPlaylist() {
        this.playList.innerHTML = '';
        for (let i = 0; i < this.trackList.length; i++) {
            const listItem = document.createElement('li');
            listItem.classList.add('list-item');
            listItem.setAttribute('draggable', 'true');
            listItem.dataset.index = i;
            const fileName = this.trackNames[i];
            listItem.innerHTML = `
                <span class="track-name">${htmlEscape(fileName)}</span>
                <button class="remove-track" title="Remove track">remove</button>
            `;
            listItem
                .querySelector('.remove-track')
                .addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.removeTrack(i);
                });
            this.playList.append(listItem);
        }
        this._bindDragEvents();
        this.playlistEls = document.querySelectorAll('.list-item');
        this._updatePlaylistStyle();
    }

    /** Update data-index attributes for all list items. */
    _updatePlaylistIndices() {
        const items = this.playList.querySelectorAll('.list-item');
        items.forEach((item, i) => {
            item.dataset.index = i;
        });
    }

    /** Bind drag-and-drop events to playlist items. */
    _bindDragEvents() {
        const items = this.playList.querySelectorAll('.list-item');
        items.forEach((item) => {
            item.addEventListener('dragstart', (e) => this._handleDragStart(e));
            item.addEventListener('dragover', (e) => this._handleDragOver(e));
            item.addEventListener('drop', (e) => this._handleDrop(e));
            item.addEventListener('dragenter', (e) => this._handleDragEnter(e));
            item.addEventListener('dragleave', (e) => this._handleDragLeave(e));
            item.addEventListener('dragend', (e) => this._handleDragEnd(e));
        });
    }

    /** Drag start - store the index of dragged item. */
    _handleDragStart(e) {
        this.draggedIndex = parseInt(e.target.dataset.index, 10);
        e.target.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
    }

    /** Drag over - allow dropping. */
    _handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    }

    /** Drag enter - visual feedback. */
    _handleDragEnter(e) {
        e.target.classList.add('drag-over');
    }

    /** Drag leave - remove visual feedback. */
    _handleDragLeave(e) {
        e.target.classList.remove('drag-over');
    }

    /** Drag end - clean up visual feedback. */
    _handleDragEnd(e) {
        e.target.classList.remove('dragging');
        this.draggedIndex = null;
    }

    /** Drop - reorder tracks. */
    _handleDrop(e) {
        e.preventDefault();
        const targetItem = e.target.closest('.list-item');
        if (!targetItem) return;
        const dropIndex = parseInt(targetItem.dataset.index, 10);
        if (this.draggedIndex === null || this.draggedIndex === dropIndex)
            return;

        const [removed] = this.trackList.splice(this.draggedIndex, 1);
        this.trackList.splice(dropIndex, 0, removed);

        const [removedBlob] = this.blobUrls.splice(this.draggedIndex, 1);
        this.blobUrls.splice(dropIndex, 0, removedBlob);

        const [removedName] = this.trackNames.splice(this.draggedIndex, 1);
        this.trackNames.splice(dropIndex, 0, removedName);

        if (this.currentSong === this.draggedIndex) {
            this.currentSong = dropIndex;
        } else if (
            this.draggedIndex < this.currentSong &&
            dropIndex >= this.currentSong
        ) {
            this.currentSong--;
        } else if (
            this.draggedIndex > this.currentSong &&
            dropIndex <= this.currentSong
        ) {
            this.currentSong++;
        }

        this._renderPlaylist();
        this._updatePlaylistIndices();
        this._updatePlaylistStyle();
    }

    /** Remove a track from the playlist. */
    removeTrack(index) {
        if (index < 0 || index >= this.trackList.length) return;

        window.URL.revokeObjectURL(this.trackList[index]);

        this.trackList.splice(index, 1);
        this.blobUrls.splice(index, 1);
        this.trackNames.splice(index, 1);

        if (this.trackList.length === 0) {
            this.audio.src = '';
            this.currentSong = 0;
            this.playlistEls = null;
            this.playList.innerHTML = '';
            this.isPlaying = false;
            this._setPlayIcon(false);
            this.trackNameEl.textContent = '';
            this.playlistToggle.classList.remove('visible');
            this.elapsedEl.textContent = '';
            this.totalEl.textContent = '';
            this._stopEq();
            this.eqCanvas.style.display = 'none';
            return;
        }

        if (index < this.currentSong) {
            this.currentSong--;
        } else if (index === this.currentSong) {
            if (this.currentSong >= this.trackList.length) {
                this.currentSong = 0;
            }
            this.audio.src = this.trackList[this.currentSong];
            if (this.isPlaying) {
                this.audio.play();
            }
        }

        this._renderPlaylist();
        this._updatePlaylistIndices();
        this._updatePlaylistStyle();
    }

    /** Start the EQ animation loop. */
    _startEq() {
        if (!this.eqCanvas || !this.eqCtx) return;
        this._lastBandValues = [0, 0, 0, 0, 0];
        this._drawEq();
    }

    /** Stop the EQ animation loop and show flat bars. */
    _stopEq() {
        if (this._eqAnimationId) {
            cancelAnimationFrame(this._eqAnimationId);
            this._eqAnimationId = null;
        }
        this._drawFlatEq();
    }

    /** Draw the EQ with current frequency data. */
    _drawEq() {
        if (!this.eqCtx) return;

        const ctx = this.eqCtx;
        const w = this.eqCanvas.width;
        const h = this.eqCanvas.height;
        const bandCount = 5;
        const bandWidth = w / bandCount;
        const smoothing = 0.7;

        let newBands;
        if (AlgorithmLoader.frequencyAnalyser && this.isPlaying) {
            newBands = AlgorithmLoader.frequencyAnalyser.getBands();
        } else {
            newBands = [0, 0, 0, 0, 0];
        }

        this._lastBandValues = this._lastBandValues.map(
            (prev, i) => prev * smoothing + newBands[i] * (1 - smoothing),
        );

        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = '#32cd32';

        for (let i = 0; i < bandCount; i++) {
            const bandHeight = Math.max(1, this._lastBandValues[i] * h);
            const x = i * bandWidth;
            const y = h - bandHeight;
            ctx.fillRect(x + 1, y, bandWidth - 2, bandHeight);
        }

        this._eqAnimationId = requestAnimationFrame(() => this._drawEq());
    }

    /** Draw flat (zero) EQ bars. */
    _drawFlatEq() {
        if (!this.eqCtx) return;

        const ctx = this.eqCtx;
        const w = this.eqCanvas.width;
        const h = this.eqCanvas.height;
        const bandCount = 5;
        const bandWidth = w / bandCount;

        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = '#32cd32';

        for (let i = 0; i < bandCount; i++) {
            const x = i * bandWidth;
            ctx.fillRect(x + 1, h - 1, bandWidth - 2, 1);
        }
    }

    /** Clean up resources (blob URLs, etc.) on app close. */
    destroy() {
        this._revokeBlobUrls();
    }

    /** Toggle player panel visibility. Called by KeyboardController. */
    togglePlayerVisibility() {
        this.playerShow = !this.playerShow;
        this.player.style.display = this.playerShow ? 'block' : 'none';
    }
}
