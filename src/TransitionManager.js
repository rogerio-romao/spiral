/**
 * TransitionManager — algorithm lifecycle, canvas context reset,
 * auto-change timer, and the one-algorithm-at-a-time guarantee.
 */
import { random, randomColor } from './utils/randomUtils.js';

export default class TransitionManager {
    /**
     * @param {Object} deps
     * @param {HTMLCanvasElement}        deps.canvas
     * @param {CanvasRenderingContext2D} deps.ctx
     * @param {AlgorithmLoader}          deps.algorithmLoader
     * @param {AlgorithmChooser}         deps.algorithmChooser
     * @param {HUDController}            deps.hud
     * @param {Function}                 deps.getDimensions  - Returns { w, h }
     */
    constructor({
        canvas,
        ctx,
        algorithmLoader,
        algorithmChooser,
        hud,
        getDimensions,
    }) {
        this._canvas = canvas;
        this._ctx = ctx;
        this._algorithmLoader = algorithmLoader;
        this._algorithmChooser = algorithmChooser;
        this._hud = hud;
        this._getDimensions = getDimensions;

        this._currentAlgorithm = null;
        this._regen = null;
        this._autoChange = 60;
        this._manual = false;
        this._isTransitioning = false;
        this._algoRetries = 0;

        this._devModeActive = false;
        this._devModeAlgoA = null;
        this._devModeAlgoB = null;
        this._devModeAlternator = 0;
    }

    /** The currently running algorithm instance (read-only). */
    get currentAlgorithm() {
        return this._currentAlgorithm;
    }

    /** Auto-change interval in seconds. */
    get autoChange() {
        return this._autoChange;
    }

    set autoChange(value) {
        this._autoChange = value;
    }

    /** Manual mode flag. */
    get manual() {
        return this._manual;
    }

    set manual(value) {
        this._manual = value;
    }

    /** Whether a transition is currently in progress. */
    get isTransitioning() {
        return this._isTransitioning;
    }

    /** Load the first algorithm (called once from Spiral.init()). */
    startFirst() {
        this._chooseAlgos();
    }

    /** Start or restart the auto-change timer based on current settings. */
    resetAutoChangeTimer() {
        clearInterval(this._regen);
        this._regen = null;

        if (!this._manual) {
            this._regen = setInterval(() => {
                this.changeAlgorithm();
            }, this._autoChange * 1000);
        }
    }

    /** Trigger a full algorithm transition. */
    changeAlgorithm() {
        if (this._isTransitioning) {
            return;
        }
        this._isTransitioning = true;

        try {
            this.stopCurrentAlgorithm();

            clearInterval(this._regen);
            this._regen = null;

            this._resetCanvasContext();

            this._algorithmLoader.speed = random(2, 6);

            this._chooseAlgos();

            if (!this._manual) {
                this._regen = setInterval(() => {
                    this.changeAlgorithm();
                }, this._autoChange * 1000);
            }
        } finally {
            this._isTransitioning = false;
        }
    }

    /** Stop the currently running algorithm. Idempotent. */
    stopCurrentAlgorithm() {
        if (this._currentAlgorithm?.stop) {
            this._currentAlgorithm.stop();
        } else if (this._currentAlgorithm?.interval) {
            cancelAnimationFrame(this._currentAlgorithm.interval);
            this._currentAlgorithm.interval = null;
        }
        this._currentAlgorithm = null;
    }

    /**
     * Comprehensive canvas context reset — consolidates all property
     * resets and adds 7 previously missing ones.
     */
    _resetCanvasContext() {
        const ctx = this._ctx;
        const canvas = this._canvas;
        const dpr = window.devicePixelRatio || 1;

        // Reset transform fully (clears accumulated rotation)
        ctx.resetTransform();

        // Compositing and alpha
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = 'source-over';

        // Clear the canvas using physical pixel dimensions
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Reapply DPR scale so the next algorithm draws in CSS pixels
        ctx.scale(dpr, dpr);

        // Stroke and fill
        ctx.strokeStyle = randomColor(5, 255, 0.8, 0.8);
        ctx.fillStyle = randomColor(5, 255, 0.5, 0.5);
        ctx.lineWidth = 1;

        // Line dash
        ctx.setLineDash([]);
        ctx.lineDashOffset = 0;

        // Line cap/join (NEW — previously missing)
        ctx.lineCap = 'butt';
        ctx.lineJoin = 'miter';
        ctx.miterLimit = 10;

        // Shadows
        ctx.shadowBlur = 0;
        ctx.shadowColor = 'transparent';
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        // Text (NEW — previously missing)
        ctx.textAlign = 'start';
        ctx.textBaseline = 'alphabetic';
        ctx.direction = 'inherit';

        // Image smoothing (NEW — imageSmoothingEnabled was missing)
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Filter
        ctx.filter = 'none';

        // Canvas background style
        canvas.style.background = 'transparent';

        // Begin new path
        ctx.beginPath();
    }

    /** Pick a random algorithm, instantiate it, handle errors with retry. */
    _chooseAlgos() {
        const { w, h } = this._getDimensions();
        let AlgorithmClass = null;

        if (this._devModeActive) {
            const isSlotA = this._devModeAlternator === 0;
            this._devModeAlternator = 1 - this._devModeAlternator;
            const algoChoice = isSlotA
                ? this._devModeAlgoA
                : this._devModeAlgoB;
            AlgorithmClass =
                algoChoice || this._algorithmChooser.getRandomAlgorithm();
        } else {
            AlgorithmClass = this._algorithmChooser.getRandomAlgorithm();
        }

        try {
            this._currentAlgorithm = new AlgorithmClass(this._ctx, w, h);
            this._hud.displayAlgorithmName(this._currentAlgorithm.name);
            this._algoRetries = 0;
        } catch {
            this._algoRetries += 1;
            if (this._algoRetries < 3) {
                this._chooseAlgos();
            } else {
                this._algoRetries = 0;
            }
        }
    }

    /** Enable or disable dev mode. */
    setDevModeActive(active) {
        this._devModeActive = active;
        this._devModeAlternator = 0;
    }

    /** Set the algorithms for dev mode (null = random). */
    setDevModeAlgos(algoA, algoB) {
        this._devModeAlgoA = algoA;
        this._devModeAlgoB = algoB;
    }
}
