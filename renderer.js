import Spiral from './src/Spiral.js';

// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
('use strict');

CanvasRenderingContext2D.prototype.roundRect = function (
    x,
    y,
    width,
    height,
    radius,
    fill,
    stroke,
) {
    const cornerRadius = {
        upperLeft: 0,
        upperRight: 0,
        lowerLeft: 0,
        lowerRight: 0,
    };
    if (typeof stroke == 'undefined') {
        stroke = true;
    }
    if (typeof radius === 'object') {
        for (const side in radius) cornerRadius[side] = radius[side];
    }

    this.beginPath();
    this.moveTo(x + cornerRadius.upperLeft, y);
    this.lineTo(x + width - cornerRadius.upperRight, y);
    this.quadraticCurveTo(x + width, y, x + width, y + cornerRadius.upperRight);
    this.lineTo(x + width, y + height - cornerRadius.lowerRight);
    this.quadraticCurveTo(
        x + width,
        y + height,
        x + width - cornerRadius.lowerRight,
        y + height,
    );
    this.lineTo(x + cornerRadius.lowerLeft, y + height);
    this.quadraticCurveTo(
        x,
        y + height,
        x,
        y + height - cornerRadius.lowerLeft,
    );
    this.lineTo(x, y + cornerRadius.upperLeft);
    this.quadraticCurveTo(x, y, x + cornerRadius.upperLeft, y);
    this.closePath();
    if (stroke) {
        this.stroke();
    }
    if (fill) {
        this.fill();
    }
};

new Spiral();

// MUSIC PLAYER

// DOM references
const player = document.getElementById('player');
const input = document.getElementById('input');
const label = document.getElementById('click-label');
const playList = document.getElementById('playlist');
const playBtn = document.getElementById('play');
const playIcon = document.getElementById('play-pause-icon');
const stopBtn = document.getElementById('stop');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const audio = document.getElementById('audio');
const progress = document.getElementById('progress-percent');

// initial settings
let playerShow = false;
player.style.display = 'none';
let trackList = [];
let currentSong = 0;
let isPlaying = false;
let playlistEls;

// listener for file input
input.addEventListener('change', handleFiles, false);

// handles the files and adds them to playlist
function handleFiles() {
    // pause if playing and re-init settings
    audio.pause();
    isPlaying = false;
    playIcon.name = 'play-outline';
    playList.innerHTML = '';
    currentSong = 0;
    trackList = [];
    const files = this.files;
    // add li for each song, create playlist
    for (let i = 0; i < files.length; i++) {
        let listItem = document.createElement('li');
        listItem.classList.add('list-item');
        listItem.textContent = files[i].name.slice(
            0,
            files[i].name.indexOf('.'),
        );
        playList.appendChild(listItem);
        let objectURL = window.URL.createObjectURL(files[i]);
        trackList.push(objectURL);
    }
    let song = trackList[currentSong];
    audio.src = song;
    // style and prepare playlist for playback
    playlistEls = document.getElementsByClassName('list-item');
    playlistEls[currentSong].scrollIntoView();
    playlistEls[currentSong].style.color = 'rgba(255, 165, 0, 0.5)';
}

// play or pause current song
function playTrack() {
    // if paused, play
    if (!isPlaying && playlistEls) {
        isPlaying = !isPlaying;
        playIcon.name = 'pause-outline';
        updatePlaylistStyle();
        audio.play();
    } else {
        // if playing, pause
        if (playlistEls) {
            isPlaying = !isPlaying;
            playlistEls[currentSong].style.color = 'rgba(255, 165, 0, 0.5)';
            playIcon.name = 'play-outline';
            audio.pause();
        }
    }
}

// stop the track, rewind it and de-saturate color of li in playlist
function stopPlayback() {
    if (isPlaying) {
        audio.pause();
        audio.currentTime = 0;
        isPlaying = false;
        playIcon.name = 'play-outline';
        [...playlistEls].forEach((el) => (el.style.color = '#555'));
        playlistEls[currentSong].style.color = 'rgba(255, 165, 0, 0.5)';
    } else {
        if (playlistEls) {
            audio.currentTime = 0;
        }
    }
}

// cue the next track and play it if play is on
function playPrev() {
    if (playlistEls) {
        audio.pause();
        audio.currentTime = 0;
        progress.value = 0;
        currentSong--;
        if (currentSong < 0) currentSong = trackList.length - 1;
        updatePlaylistStyle();
        audio.src = trackList[currentSong];
        if (isPlaying) {
            audio.play();
        } else {
            playlistEls[currentSong].style.color = 'rgba(255, 165, 0, 0.5)';
        }
    }
}

// cue the previous track and play it if play is on
function playNext() {
    if (playlistEls) {
        audio.pause();
        audio.currentTime = 0;
        progress.value = 0;
        currentSong++;
        if (currentSong > trackList.length - 1) currentSong = 0;
        updatePlaylistStyle();
        audio.src = trackList[currentSong];
        if (isPlaying) {
            audio.play();
        } else {
            playlistEls[currentSong].style.color = 'rgba(255, 165, 0, 0.5)';
        }
    }
}

// calculates and displays the current track's progress
function displayProgress() {
    const currentTime = audio.currentTime;
    const progressPercent = (currentTime / audio.duration) * 100;
    progress.value = Number.isFinite(progressPercent)
        ? progressPercent.toFixed(2)
        : '0';
}

// skips to the clicked time on the progress bar
function scrub(e) {
    if (playlistEls) {
        const scrubTime = (e.offsetX / progress.offsetWidth) * audio.duration;
        audio.currentTime = scrubTime;
        if (isPlaying) {
            audio.play();
        }
    }
}

// helper function for styling the playlist after changes
function updatePlaylistStyle() {
    [...playlistEls].forEach((el) => (el.style.color = '#555'));
    playlistEls[currentSong].style.color = 'orange';
    playlistEls[currentSong].scrollIntoView();
}

// music player event listeners
playBtn.addEventListener('click', playTrack);
stopBtn.addEventListener('click', stopPlayback);
nextBtn.addEventListener('click', playNext);
prevBtn.addEventListener('click', playPrev);
audio.addEventListener('timeupdate', displayProgress);
audio.addEventListener('ended', playNext);
progress.addEventListener('mousedown', () => audio.pause());
progress.addEventListener('mouseup', scrub);
window.addEventListener('keyup', hidePlayer);

// hide/show the player with the p key
function hidePlayer(e) {
    if (e.code === 'KeyP') {
        if (playerShow) {
            playerShow = !playerShow;
            player.style.display = 'none';
        } else {
            playerShow = !playerShow;
            player.style.display = 'block';
        }
    }
}
