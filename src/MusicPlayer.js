/**
 * MusicPlayer — handles audio playback, playlist management,
 * progress bar, and keyboard toggle (P key).
 */
export default class MusicPlayer {
    constructor() {
        // DOM references
        this.player = document.getElementById('player');
        this.input = document.getElementById('input');
        this.label = document.getElementById('click-label');
        this.playList = document.getElementById('playlist');
        this.playBtn = document.getElementById('play');
        this.playIcon = document.getElementById('play-pause-icon');
        this.stopBtn = document.getElementById('stop');
        this.prevBtn = document.getElementById('prev');
        this.nextBtn = document.getElementById('next');
        this.audio = document.getElementById('audio');
        this.progress = document.getElementById('progress-percent');

        // State
        this.playerShow = false;
        this.player.style.display = 'none';
        this.trackList = [];
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
        window.addEventListener('keyup', (e) => this._handleKeyboard(e));
    }

    /** Process file input and build the playlist. */
    _handleFiles() {
        this.audio.pause();
        this.isPlaying = false;
        this.playIcon.name = 'play-outline';
        this.playList.innerHTML = '';
        this.currentSong = 0;
        this.trackList = [];

        const files = this.input.files;
        for (let i = 0; i < files.length; i++) {
            const listItem = document.createElement('li');
            listItem.classList.add('list-item');
            listItem.textContent = files[i].name.slice(
                0,
                files[i].name.indexOf('.'),
            );
            this.playList.appendChild(listItem);
            this.trackList.push(window.URL.createObjectURL(files[i]));
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
            this.playIcon.name = 'pause-outline';
            this._updatePlaylistStyle();
            this._resumeAnalyser();
            this.audio.play();
        } else if (this.playlistEls) {
            this.isPlaying = false;
            this.playlistEls[this.currentSong].style.color =
                'rgba(255, 165, 0, 0.5)';
            this.playIcon.name = 'play-outline';
            this.audio.pause();
        }
    }

    /** Stop playback and rewind. */
    stopPlayback() {
        if (this.isPlaying) {
            this.audio.pause();
            this.audio.currentTime = 0;
            this.isPlaying = false;
            this.playIcon.name = 'play-outline';
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

    /**
     * Resume the AudioContext used by the frequency analyser.
     * Must be called from a user gesture to satisfy autoplay policy.
     * Safe to call when no analyser is wired up.
     */
    _resumeAnalyser() {
        // Dynamically import to avoid circular dependency —
        // AlgorithmLoader is set up by renderer.js after MusicPlayer.
        import('./AlgorithmLoader.js').then(({ default: AlgorithmLoader }) => {
            AlgorithmLoader.frequencyAnalyser?.resume();
        });
    }

    /** Toggle player visibility with the P key. */
    _handleKeyboard(e) {
        if (e.code === 'KeyP') {
            this.playerShow = !this.playerShow;
            this.player.style.display = this.playerShow ? 'block' : 'none';
        }
    }
}
