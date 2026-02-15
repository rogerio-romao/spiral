import AlgorithmChooser from './AlgorithmChooser.js';
import AlgorithmLoader from './AlgorithmLoader.js';
import MusicPlayer from './MusicPlayer.js';
import FrequencyAnalyser from './utils/FrequencyAnalyser.js';
import { random, randomColor } from './utils/randomUtils.js';

export default class Spiral {
    constructor(options = {}) {
        // Setup canvas
        this.canvas = document.querySelector('#canvas');
        this.ctx = this.canvas.getContext('2d');
        this.w = window.innerWidth;
        this.h = window.innerHeight;
        this._applyDpr();

        this.devMode = options.devMode === true;
        this.devAlgorithmClass = options.devAlgorithmClass || null;

        // Algorithm loader instance
        this.algorithmLoader = new AlgorithmLoader(this.ctx, this.w, this.h);

        // Algorithm chooser instance
        this.algorithmChooser = new AlgorithmChooser();

        // running algorithm instance
        this.currentAlgorithm = null;

        // Music player and frequency analyser — deferred to init()
        this.musicPlayer = null;
        this.frequencyAnalyser = null;

        // Setup message display
        this.messageTimer = null;
        this.messageElement = document.querySelector('#msg');

        // Setup algorithm display
        this.algosDisplayElement = document.querySelector('#algos');

        // Setup help display
        this.helpElement = document.querySelector('#help');
        this.helpView = false;

        // Auto change interval
        this.autoChange = 100;
        this.regen = null;

        // Manual mode toggle
        this.manual = false;

        // Silent mode toggle
        this.silent = false;

        // Initialize the application
        this.init();
    }

    init() {
        // display some user tips on screen
        this.canvas.focus();
        this.displayMessage('WELCOME');
        setTimeout(() => {
            this.displayMessage('PRESS H FOR HELP');
        }, 10000);
        setTimeout(() => {
            this.displayMessage('TIP: F FOR FULLSCREEN');
        }, 20000);

        // make algorithms auto-change if not in manual mode
        if (!this.manual && !this.devMode) {
            this.regen = setInterval(() => {
                this.canvas.click();
            }, this.autoChange * 1000);
        }

        // add event listeners
        this.addEventListeners();

        // trigger the first algorithm
        this.chooseAlgos();

        // Music player — deferred from constructor so algorithm loading
        // and first render are not blocked by audio subsystem setup
        this.musicPlayer = new MusicPlayer();

        // Frequency analyser — connects to the audio element owned by MusicPlayer
        this.frequencyAnalyser = new FrequencyAnalyser(this.musicPlayer.audio);
        AlgorithmLoader.frequencyAnalyser = this.frequencyAnalyser;

        // Resume AudioContext on any play event (covers play, next, prev)
        this.musicPlayer.audio.addEventListener('play', () => {
            this.frequencyAnalyser.resume();
        });
    }

    addEventListeners() {
        //change canvas size on window resize
        window.addEventListener('resize', () => {
            const rect = this.canvas.getBoundingClientRect();
            this.w = rect.width;
            this.h = rect.height;
            this._applyDpr();
            this.canvas.click();
        });

        // keystroke listeners
        window.addEventListener('keyup', (e) => {
            switch (e.code) {
                case 'Space':
                    if (!this.devMode) {
                        this.canvas.click();
                    }
                    break;
                case 'KeyF':
                    document.body.requestFullscreen();
                    break;
                case 'KeyI':
                    if (this.devMode) break;
                    this.autoChange += 10;
                    if (this.autoChange > 300) this.autoChange = 300;
                    this.displayMessage(`Auto-change: ${this.autoChange}secs`);
                    break;
                case 'KeyD':
                    if (this.devMode) break;
                    this.autoChange -= 10;
                    if (this.autoChange < 10) this.autoChange = 10;
                    this.displayMessage(`Auto-change: ${this.autoChange}secs`);
                    break;
                case 'KeyM':
                    if (this.devMode) break;
                    this.manual = !this.manual;
                    this.displayMessage(
                        this.manual ? 'Manual mode' : 'Auto mode',
                    );
                    break;
                case 'KeyS':
                    this.silent = !this.silent;
                    this.displayMessage(
                        this.silent ? 'Silent mode' : 'Display mode',
                    );
                    this.algosDisplayElement.textContent = '';
                    this.algosDisplayElement.style.display = 'none';
                    break;
                case 'KeyH':
                    this.helpView = !this.helpView;
                    this.helpElement.style.display = this.helpView
                        ? 'block'
                        : 'none';
                    break;
                default:
                    break;
            }
        });

        // on canvas click, generate a new spiral
        this.canvas.addEventListener('click', () => {
            if (this.devMode) return;
            this.ctx.save();
            // clear any timers
            this.stopCurrentAlgorithm();

            clearInterval(this.regen);
            this.t = 0;
            this.stagger = 0;

            // setup new auto-change timer if not in manual mode
            if (!this.manual) {
                this.regen = setInterval(() => {
                    this.canvas.click();
                }, this.autoChange * 1000);
            }

            // new random speed
            this.algorithmLoader.speed = random(2, 6);

            // canvas resets
            this.ctx.restore();

            // picks a transition mode
            this.canvas.style.background = 'transparent';
            this.clearMethod();

            // reset stroke and fill styles
            this.ctx.strokeStyle = randomColor(5, 255, 0.8, 0.8);
            this.ctx.fillStyle = randomColor(5, 255, 0.5, 0.5);

            // begin new path
            this.ctx.beginPath();

            // selects next algorithm
            this.chooseAlgos();
        });

        // on mousemove, show the cursor
        this.canvas.addEventListener('mousemove', () => {
            this.canvas.style.cursor = 'pointer';
            setTimeout(() => {
                this.canvas.style.cursor = 'none';
            }, 4000);
        });

        // Detect devicePixelRatio changes (e.g. dragging between monitors)
        this._watchDprChange();
    }

    chooseAlgos() {
        // set the basic canvas settings
        this.ctx.strokeStyle = randomColor(5, 255, 0.8, 0.8);
        this.ctx.fillStyle = randomColor(5, 255, 0.5, 0.5);
        this.canvas.style.background = 'transparent';
        this.ctx.imageSmoothingQuality = 'high';
        this.ctx.globalCompositeOperation = 'source-over';
        this.ctx.lineWidth = 1;
        this.ctx.shadowBlur = 0;
        this.ctx.setLineDash([]);
        this.ctx.save();
        // clear any timers
        this.stopCurrentAlgorithm();
        let AlgorithmClass = this.algorithmChooser.getRandomAlgorithm();
        if (this.devMode) {
            if (
                !this.devAlgorithmClass ||
                typeof this.devAlgorithmClass !== 'function'
            ) {
                throw new Error(
                    'Dev mode enabled but no devAlgorithmClass provided.',
                );
            }
            AlgorithmClass = this.devAlgorithmClass;
        }
        this.currentAlgorithm = new AlgorithmClass(this.ctx, this.w, this.h);
        // display algorithm name
        this.displayAlgorithmName(this.currentAlgorithm.name);
    }

    // chooses a transition method when spirals change
    clearMethod() {
        // clear the running algorithm
        this.stopCurrentAlgorithm();

        const clearMethodPick = Math.random();
        // clears to black a portion of the screen based on the canvas size and its rotation at the moment
        if (clearMethodPick < 0.25) {
            this.ctx.clearRect(0, 0, this.w, this.h);
        } else if (clearMethodPick < 0.5) {
            // makes semi-transparent a portion of the screen based on the canvas size and its rotation at the moment
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
            this.ctx.fillRect(0, 0, this.w, this.h);
        } else if (clearMethodPick < 0.75) {
            // colors a portion of the screen based on the canvas size and its rotation at the moment, with random transparency
            this.ctx.fillStyle = randomColor(5, 255, 0.15, 0.9);
            this.ctx.fillRect(0, 0, this.w, this.h);
        } else {
            // completely fills the screen with black
            this.canvas.width = this.canvas.height = 0;
            this._applyDpr();
        }

        this.ctx.strokeStyle = randomColor(5, 255, 0.8, 0.8);
    }

    displayAlgorithmName(name) {
        if (this.silent) return;
        this.algosDisplayElement.textContent = `${name.toUpperCase()}`;
        this.algosDisplayElement.style.display = 'block';

        setTimeout(() => {
            this.algosDisplayElement.style.display = 'none';
            this.algosDisplayElement.textContent = '';
        }, 5000);
    }

    displayMessage(message) {
        clearTimeout(this.messageTimer);
        this.messageElement.textContent = message;
        this.messageElement.style.display = 'block';
        this.messageTimer = setTimeout(() => {
            this.messageElement.style.display = 'none';
            this.messageElement.textContent = '';
        }, 7500);
    }

    /**
     * Sets up the canvas backing store for the current devicePixelRatio.
     * Keeps this.w / this.h as logical CSS pixels; the canvas buffer is
     * scaled up so rendering is sharp on HiDPI / Retina displays.
     */
    _applyDpr() {
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = this.w * dpr;
        this.canvas.height = this.h * dpr;
        this.canvas.style.width = this.w + 'px';
        this.canvas.style.height = this.h + 'px';
        this.ctx.scale(dpr, dpr);
    }

    /**
     * Watches for devicePixelRatio changes via matchMedia.
     * Re-registers on each change since the media query targets a specific DPR.
     */
    _watchDprChange() {
        const mql = window.matchMedia(
            `(resolution: ${window.devicePixelRatio}dppx)`,
        );
        mql.addEventListener(
            'change',
            () => {
                this._applyDpr();
                this.canvas.click();
                // Re-register for the new DPR value
                this._watchDprChange();
            },
            { once: true },
        );
    }

    stopCurrentAlgorithm() {
        if (this.currentAlgorithm?.stop) {
            this.currentAlgorithm.stop();
        } else if (this.currentAlgorithm?.interval) {
            cancelAnimationFrame(this.currentAlgorithm.interval);
            this.currentAlgorithm.interval = null;
        }
        this.currentAlgorithm = null;
    }
}
