/**
 * MusicPlayer — handles audio playback, playlist management,
 * and progress bar.
 */
import { htmlEscape } from './utils/htmlEscape.js';

export default class MusicPlayer {
    constructor() {
        // DOM references
        this.player = document.getElementById('player');
        this.input = document.getElementById('input');
        this.label = document.getElementById('click-label');
        this.playList = document.getElementById('playlist');
        this.playBtn = document.getElementById('play');
        this.iconPlay = document.getElementById('icon-play');
        this.iconPause = document.getElementById('icon-pause');
        this.stopBtn = document.getElementById('stop');
        this.prevBtn = document.getElementById('prev');
        this.nextBtn = document.getElementById('next');
        this.audio = document.getElementById('audio');
        this.progress = document.getElementById('progress-percent');

        // State
        this.playerShow = false;
        this.player.style.display = 'none';
        this.trackList = [];
        this.blobUrls = [];
        this.currentSong = 0;
        this.isPlaying = false;
        this.playlistEls = null;

        this._bindEvents();
    }

    /** Attach all event listeners. */
    _bindEvents() {
        this.input.addEventListener('change', () => this._handleFiles(), false);
        this.playBtn.addEventListener('click', () => this.playTrack());
        this.stopBtn.addEventListener('click', () => this.stopPlayback());
        this.nextBtn.addEventListener('click', () => this.playNext());
        this.prevBtn.addEventListener('click', () => this.playPrev());
        this.audio.addEventListener('timeupdate', () =>
            this._displayProgress(),
        );
        this.audio.addEventListener('ended', () => this.playNext());
        this.progress.addEventListener('mousedown', () => this.audio.pause());
        this.progress.addEventListener('mouseup', (e) => this._scrub(e));
    }

    /** Process file input and build the playlist. */
    _handleFiles() {
        this.audio.pause();
        this.isPlaying = false;
        this._setPlayIcon(false);
        this.playList.innerHTML = '';
        this.currentSong = 0;

        // Revoke any existing blob URLs before creating new ones
        this._revokeBlobUrls();
        this.trackList = [];

        const files = this.input.files;
        if (!files?.length) return;
        for (let i = 0; i < files.length; i++) {
            const listItem = document.createElement('li');
            listItem.classList.add('list-item');
            // Sanitize filename for display
            const baseName =
                files[i].name.indexOf('.') > -1
                    ? files[i].name.slice(0, files[i].name.indexOf('.'))
                    : files[i].name;
            listItem.textContent = baseName;
            // Optionally, if you ever use innerHTML or attributes, escape:
            // listItem.innerHTML = htmlEscape(baseName);
            // listItem.setAttribute('data-filename', htmlEscape(files[i].name));
            this.playList.appendChild(listItem);
            const blobUrl = window.URL.createObjectURL(files[i]);
            this.trackList.push(blobUrl);
            this.blobUrls.push(blobUrl);
        }

        this.audio.src = this.trackList[this.currentSong];
        this.playlistEls = document.getElementsByClassName('list-item');
        this.playlistEls[this.currentSong].scrollIntoView();
        this.playlistEls[this.currentSong].style.color =
            'rgba(255, 165, 0, 0.5)';
    }

    /** Play or pause the current track. */
    playTrack() {
        if (!this.isPlaying && this.playlistEls) {
            this.isPlaying = true;
            this._setPlayIcon(true);
            this._updatePlaylistStyle();
            this.audio.play();
        } else if (this.playlistEls) {
            this.isPlaying = false;
            this.playlistEls[this.currentSong].style.color =
                'rgba(255, 165, 0, 0.5)';
            this._setPlayIcon(false);
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
        this.currentSong--;
        if (this.currentSong < 0) this.currentSong = this.trackList.length - 1;
        this._updatePlaylistStyle();
        this.audio.src = this.trackList[this.currentSong];
        if (this.isPlaying) {
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
        this.currentSong++;
        if (this.currentSong > this.trackList.length - 1) this.currentSong = 0;
        this._updatePlaylistStyle();
        this.audio.src = this.trackList[this.currentSong];
        if (this.isPlaying) {
            this.audio.play();
        } else {
            this.playlistEls[this.currentSong].style.color =
                'rgba(255, 165, 0, 0.5)';
        }
    }

    /** Update the progress bar based on current playback position. */
    _displayProgress() {
        if (this.audio.duration === 0) {
            this.progress.value = 0;
            return;
        }
        const currentTime = this.audio.currentTime;
        const progressPercent = (currentTime / this.audio.duration) * 100;
        this.progress.value = Number.isFinite(progressPercent)
            ? progressPercent.toFixed(2)
            : '0';
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
        this.playlistEls[this.currentSong].scrollIntoView();
    }

    /** Toggle the play/pause icon SVGs. */
    _setPlayIcon(playing) {
        this.iconPlay.style.display = playing ? 'none' : 'inline';
        this.iconPause.style.display = playing ? 'inline' : 'none';
    }

    /** Revoke all stored blob URLs to free memory. */
    _revokeBlobUrls() {
        for (const url of this.blobUrls) {
            window.URL.revokeObjectURL(url);
        }
        this.blobUrls = [];
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
