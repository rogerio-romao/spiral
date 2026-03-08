import AlgorithmLoader from './AlgorithmLoader.js';
import DevModeController from './DevModeController.js';
import FrequencyAnalyser from './FrequencyAnalyser.js';
import HudController from './HudController.js';
import KeyboardController from './KeyboardController.js';
import MusicPlayer from './MusicPlayer.js';
import TransitionManager from './TransitionManager.js';
import WaveformController from './WaveformController.js';

/**
 * Spiral orchestrates the main application logic for the generative art visualizer.
 *
 * Handles canvas setup, HUD, algorithm lifecycle, music player, audio analysis,
 * waveform rendering, keyboard shortcuts, and global event listeners.
 *
 * Entry point for the renderer process.
 */
export default class Spiral {
    // INSTANCE PROPERTIES
    algoChangeDebounceDelayInMs = 250;
    cursorHideDelayInMs = 4000;
    cursorHideTimeout = null;
    debounceTimeout = null;
    frequencyAnalyser = null;
    keyboardController = null;
    musicPlayer = null;
    resizeTimeout = null;
    waveformController = null;

    constructor() {
        // CANVAS SETUP
        /** @type {HTMLCanvasElement} */
        this.canvas = document.querySelector('#canvas');
        this.ctx = this.canvas.getContext('2d');
        this.w = globalThis.innerWidth;
        this.h = globalThis.innerHeight;
        this.applyDpr();

        // Initialize static canvas properties for algorithms
        AlgorithmLoader.ctx = this.ctx;
        AlgorithmLoader.w = this.w;
        AlgorithmLoader.h = this.h;

        // HUD SETUP
        this.hud = new HudController({
            algosDisplayElement: document.querySelector('#algos'),
            helpElement: document.querySelector('#help'),
            messageElement: document.querySelector('#msg'),
        });

        // ALGORITHM & TRANSITION MANAGEMENT
        this.algorithmLoader = new AlgorithmLoader();

        this.transitionManager = new TransitionManager({
            algorithmLoader: this.algorithmLoader,
            canvas: this.canvas,
            hudController: this.hud,
        });

        // DEV MODE CONTROLLER
        this.devModeController = new DevModeController({
            hudController: this.hud,
            transitionManager: this.transitionManager,
        });

        this.init();
    }

    /**
     * Adds all event listeners related to the main canvas element.
     *
     * Handles:
     * - Algorithm error recovery (loads next algorithm on error)
     * - Window resize (stops current algorithm, resizes canvas and waveform, debounces restart)
     * - Canvas click (triggers new algorithm)
     * - Mouse movement (shows/hides cursor after inactivity)
     * - Device pixel ratio changes (re-applies DPR and restarts algorithm)
     */
    addCanvasListeners() {
        // recover from algorithm draw() errors by loading the next algorithm - this is a custom event emitted by the AlgorithmLoader wrapper around the algorithm draw calls
        this.canvas.addEventListener('algorithm-error', () => {
            this.transitionManager.changeAlgorithm();
        });

        // change canvas size on window resize
        globalThis.addEventListener('resize', () => {
            // Ensure the running algorithm is stopped immediately
            this.transitionManager.stopCurrentAlgorithm();

            const rect = this.canvas.getBoundingClientRect();
            this.w = rect.width;
            this.h = rect.height;
            AlgorithmLoader.w = this.w;
            AlgorithmLoader.h = this.h;
            this.applyDpr();

            // Also resize waveform canvas
            this.waveformController?.resizeCanvas();

            // Debounce algorithm restart
            this.debounceAlgorithmRestart();
        });

        // on canvas click, generate a new spiral
        this.canvas.addEventListener('click', () => {
            this.transitionManager.changeAlgorithm();
        });

        // on mousemove, show the cursor
        this.canvas.addEventListener('mousemove', () => {
            this.canvas.style.cursor = 'pointer';

            if (this.cursorHideTimeout) {
                clearTimeout(this.cursorHideTimeout);
            }

            this.cursorHideTimeout = setTimeout(() => {
                this.canvas.style.cursor = 'none';
            }, this.cursorHideDelayInMs);
        });

        // Detect devicePixelRatio changes (e.g. dragging between monitors)
        this.watchDprChange();
    }

    /**
     * Sets up the canvas backing store for the current devicePixelRatio.
     * Keeps this.w / this.h as logical CSS pixels; the canvas buffer is
     * scaled up so rendering is sharp on HiDPI / Retina displays.
     */
    applyDpr() {
        const dpr = globalThis.devicePixelRatio || 1;
        this.canvas.width = this.w * dpr;
        this.canvas.height = this.h * dpr;
        this.canvas.style.width = `${this.w}px`;
        this.canvas.style.height = `${this.h}px`;
        // Prevent compounding scale transforms
        this.ctx.resetTransform();
        this.ctx.scale(dpr, dpr);
    }

    /**
     * Debounce algorithm restart after resize or DPR change.
     * Ensures only one restart is pending at a time.
     * @param {number} delay - The debounce delay in milliseconds.
     */
    debounceAlgorithmRestart(delay = this.algoChangeDebounceDelayInMs) {
        if (this.debounceTimeout) {
            clearTimeout(this.debounceTimeout);
        }
        this.debounceTimeout = setTimeout(() => {
            this.transitionManager.changeAlgorithm();
            this.debounceTimeout = null;
        }, delay);
    }

    /** Clean up resources before the app closes. */
    destroy() {
        this._welcomeTimers.map(clearTimeout);
        this.hud.destroy();
        this.musicPlayer.destroy();
        this.devModeController.destroy();
        this.waveformController?.destroy();

        if (this.cursorHideTimeout) {
            clearTimeout(this.cursorHideTimeout);
        }
        if (this.resizeTimeout) {
            clearTimeout(this.resizeTimeout);
        }
    }

    /**
     * Initializes the Spiral application.
     *
     * Sets up the canvas, HUD, event listeners, algorithm transitions,
     * music player, frequency analyser, waveform controller, and keyboard shortcuts.
     * This method is called from the constructor after all controllers are created.
     */
    init() {
        // Hide cursor by default on launch
        this.canvas.focus();
        this.canvas.style.cursor = 'none';

        this.ctx.imageSmoothingEnabled = true;
        this.ctx.imageSmoothingQuality = 'high';

        // welcome messages and tips
        this.hud.displayMessage('WELCOME');
        this._welcomeTimers = [
            setTimeout(() => {
                this.hud.displayMessage('PRESS H FOR HELP');
            }, 10_000),
            setTimeout(() => {
                this.hud.displayMessage('TIP: F FOR FULLSCREEN');
            }, 20_000),
            setTimeout(() => {
                this.hud.displayMessage('TIP: M TO VIEW/HIDE MUSIC PLAYER');
            }, 30_000),
        ];

        // initiate the transitions timer
        this.transitionManager.resetAutoChangeTimer();

        // add event listeners
        this.addCanvasListeners();

        // trigger the first algorithm
        this.transitionManager.startFirst();

        // Music player — deferred from constructor so algorithm loading
        // and first render are not blocked by audio subsystem setup
        this.musicPlayer = new MusicPlayer();

        // Frequency analyser — connects to the audio element owned by MusicPlayer, and we pass it to AlgorithmLoader so algorithms can access frequency data if they want, and the musicPlayer makes use of it for graphic eq viz and for gain node control over the audio output.
        this.frequencyAnalyser = new FrequencyAnalyser(this.musicPlayer.audio);
        AlgorithmLoader.frequencyAnalyser = this.frequencyAnalyser;
        this.musicPlayer.frequencyAnalyser = this.frequencyAnalyser;

        // Waveform controller — uses frequency analyser to render waveform, and we pass it to AlgorithmLoader so algorithms can use the waveform data
        this.waveformController = new WaveformController({
            canvasElement: document.querySelector('#waveform'),
            frequencyAnalyser: this.frequencyAnalyser,
        });
        AlgorithmLoader.waveformController = this.waveformController;

        // Resume AudioContext on any play event (covers play, next, prev)
        this.musicPlayer.audio.addEventListener('play', () => {
            this.frequencyAnalyser.resume();
        });

        // Keyboard controller for global shortcuts
        this.keyboardController = new KeyboardController({
            devModeController: this.devModeController,
            hudController: this.hud,
            musicPlayer: this.musicPlayer,
            spiral: this,
            transitionManager: this.transitionManager,
        });
        this.keyboardController.bind();
    }

    /** Toggle the audio waveform display on or off, and show a message in the HUD indicating the new state. Called by the `KeyboardController` when the user presses the assigned shortcut key. */
    toggleWaveform() {
        const isOn = this.waveformController.toggleWaveform();
        this.hud.displayMessage(isOn ? 'Waveform: ON' : 'Waveform: OFF');
    }

    /**
     * Sets up a listener for changes in devicePixelRatio, which can occur when dragging the window between monitors with different DPIs. When a change is detected, it reapplies the DPR settings to the canvas and restarts the current algorithm to ensure it renders correctly at the new resolution.
     */
    watchDprChange() {
        // Listen for changes in devicePixelRatio using the 'change' event on a MediaQueryList that matches the current DPR. This is a more efficient way to detect DPR changes than polling.
        const mql = globalThis.matchMedia(`(resolution: ${globalThis.devicePixelRatio}dppx)`);

        mql.addEventListener(
            'change',
            () => {
                this.applyDpr();
                // Stop current algorithm immediately and debounce restart
                this.transitionManager.stopCurrentAlgorithm();
                this.debounceAlgorithmRestart();
                // Re-register for the new DPR value
                this.watchDprChange();
            },
            { once: true },
        );
    }
}
