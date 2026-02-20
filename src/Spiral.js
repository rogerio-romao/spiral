import AlgorithmChooser from './AlgorithmChooser.js';
import AlgorithmLoader from './AlgorithmLoader.js';
import HUDController from './HUDController.js';
import KeyboardController from './KeyboardController.js';
import MusicPlayer from './MusicPlayer.js';
import TransitionManager from './TransitionManager.js';
import FrequencyAnalyser from './utils/FrequencyAnalyser.js';

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

        // HUD controller
        this.hud = new HUDController({
            messageElement: document.querySelector('#msg'),
            algosDisplayElement: document.querySelector('#algos'),
            helpElement: document.querySelector('#help'),
        });

        // Transition manager
        this.transitionManager = new TransitionManager({
            canvas: this.canvas,
            ctx: this.ctx,
            algorithmLoader: this.algorithmLoader,
            algorithmChooser: this.algorithmChooser,
            hud: this.hud,
            getDimensions: () => ({ w: this.w, h: this.h }),
            devMode: this.devMode,
            devAlgorithmClass: this.devAlgorithmClass,
        });

        // Music player and frequency analyser — deferred to init()
        this.musicPlayer = null;
        this.frequencyAnalyser = null;

        // Keyboard controller — deferred to init() (needs musicPlayer)
        this.keyboardController = null;

        // Cursor hide timeout ID for debouncing
        this.cursorHideTimeout = null;
        // Resize debounce timeout ID
        this.resizeTimeout = null;

        // Initialize the application
        this.init();
    }

    init() {
        // display some user tips on screen
        this.canvas.focus();

        // Hide cursor by default on launch
        this.canvas.style.cursor = 'none';
        this.hud.displayMessage('WELCOME');
        this._welcomeTimers = [
            setTimeout(() => {
                this.hud.displayMessage('PRESS H FOR HELP');
            }, 10000),
            setTimeout(() => {
                this.hud.displayMessage('TIP: F FOR FULLSCREEN');
            }, 20000),
        ];

        // make algorithms auto-change if not in manual mode
        this.transitionManager.resetAutoChangeTimer();

        // add canvas-level event listeners
        this._addCanvasListeners();

        // trigger the first algorithm
        this.transitionManager.startFirst();

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

        // Keyboard controller (created after musicPlayer exists)
        this.keyboardController = new KeyboardController({
            hud: this.hud,
            transition: this.transitionManager,
            musicPlayer: this.musicPlayer,
            spiral: this,
        });
        this.keyboardController.bind();
    }

    _addCanvasListeners() {
        // recover from algorithm draw() errors by loading the next algorithm
        this.canvas.addEventListener('algorithm-error', () => {
            this.transitionManager.changeAlgorithm();
        });

        // change canvas size on window resize
        window.addEventListener('resize', () => {
            // Ensure the running algorithm is stopped immediately
            this.transitionManager.stopCurrentAlgorithm();

            const rect = this.canvas.getBoundingClientRect();
            this.w = rect.width;
            this.h = rect.height;
            this._applyDpr();

            // Debounce subsequent restarts during continuous resize
            if (this.resizeTimeout) {
                clearTimeout(this.resizeTimeout);
            }
            this.resizeTimeout = setTimeout(() => {
                this.transitionManager.changeAlgorithm();
                this.resizeTimeout = null;
            }, 250);
        });

        // on canvas click, generate a new spiral
        this.canvas.addEventListener('click', () => {
            this.transitionManager.changeAlgorithm();
        });

        // on mousemove, show the cursor
        this.canvas.addEventListener('mousemove', () => {
            // Show cursor
            this.canvas.style.cursor = 'pointer';

            // Clear existing timeout to prevent unbounded setTimeout accumulation
            if (this.cursorHideTimeout) {
                clearTimeout(this.cursorHideTimeout);
            }

            // Set new timeout and store ID for debouncing
            this.cursorHideTimeout = setTimeout(() => {
                this.canvas.style.cursor = 'none';
            }, 4000);
        });

        // Detect devicePixelRatio changes (e.g. dragging between monitors)
        this._watchDprChange();
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

    /** Clean up resources before the app closes. */
    destroy() {
        this._welcomeTimers.forEach(clearTimeout);
        this.musicPlayer.destroy();
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

                // Stop current algorithm immediately and debounce restart
                this.transitionManager.stopCurrentAlgorithm();
                if (this.resizeTimeout) {
                    clearTimeout(this.resizeTimeout);
                }
                this.resizeTimeout = setTimeout(() => {
                    this.transitionManager.changeAlgorithm();
                    this.resizeTimeout = null;
                }, 250);

                // Re-register for the new DPR value
                this._watchDprChange();
            },
            { once: true },
        );
    }
}
