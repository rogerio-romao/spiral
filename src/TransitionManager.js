import { random, randomColor } from './utils/randomUtils.js';

/**
 * Manages algorithm transitions, including timing, error handling, and dev mode.
 * Responsibilities:
 * - Starting/stopping algorithms
 * - Resetting canvas context between algorithms
 * - Handling auto-change timer and manual mode
 * - Dev mode for testing specific algorithms
 */
export default class TransitionManager {
    // INSTANCE PROPERTIES
    algoRetries = 0;
    autoChangeIntervalInSeconds = 60;
    autoChangeTimeout = null;
    currentAlgorithm = null;
    devModeActive = false;
    devModeAlgoA = null;
    devModeAlgoB = null;
    devModeAlternator = 0;
    isInManualMode = false;
    isTransitioning = false;

    /**
     * @param {Object} deps - Dependencies object containing required components
     * @param {HTMLCanvasElement}        deps.canvas - The HTML canvas element
     * @param {AlgorithmLoader}          deps.AlgorithmLoader - Algorithm loader instance
     * @param {AlgorithmChooser}         deps.AlgorithmChooser - Algorithm chooser instance
     * @param {HUDController}            deps.HudController - HUD controller instance
     * @param {Function}                 deps.getDimensions  - Returns { w, h }
     */
    constructor({ canvas, AlgorithmLoader, AlgorithmChooser, HudController, getDimensions }) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.AlgorithmLoader = AlgorithmLoader;
        this.AlgorithmChooser = AlgorithmChooser;
        this.HudController = HudController;
        this.getDimensions = getDimensions;
    }

    /** Change to a new algorithm, handling timing, errors, and dev mode. Idempotent if a transition is already in progress. */
    changeAlgorithm() {
        if (this.isTransitioning) {
            return;
        }
        this.isTransitioning = true;

        try {
            this.stopCurrentAlgorithm();

            clearInterval(this.autoChangeTimeout);
            this.autoChangeTimeout = null;

            this.resetCanvasContext();

            this.AlgorithmLoader.speed = random(2, 6);

            this.chooseAlgos();

            if (!this.isInManualMode) {
                this.autoChangeTimeout = setInterval(() => {
                    this.changeAlgorithm();
                }, this.autoChangeIntervalInSeconds * 1000);
            }
        } finally {
            this.isTransitioning = false;
        }
    }

    /** Choose and instantiate a new algorithm, with retry logic for constructor errors. Respects dev mode settings. Idempotent if already transitioning. */
    chooseAlgos() {
        const { w, h } = this.getDimensions();

        let AlgorithmClass = null;
        if (this.devModeActive) {
            // In dev mode, alternate between two specified algorithms (or random if null) on each call. This allows for quick testing of specific algorithms without changing code.
            const isSlotA = this.devModeAlternator === 0;
            this.devModeAlternator = 1 - this.devModeAlternator;
            const algoChoice = isSlotA ? this.devModeAlgoA : this.devModeAlgoB;
            AlgorithmClass = algoChoice || this.AlgorithmChooser.getRandomAlgorithm();
        } else {
            AlgorithmClass = this.AlgorithmChooser.getRandomAlgorithm();
        }

        // Attempt to instantiate the chosen algorithm, with retry logic in case of constructor errors. This is important because some algorithms may throw errors due to edge cases or unexpected conditions. We want to ensure that a single failure doesn't break the entire app, and that we can recover gracefully by trying a different algorithm.
        try {
            this.currentAlgorithm = new AlgorithmClass(this.ctx, w, h);
            this.HudController.displayAlgorithmName(this.currentAlgorithm.name);
            this.algoRetries = 0;
        } catch {
            this.algoRetries += 1;
            if (this.algoRetries < 3) {
                this.chooseAlgos();
            } else {
                this.algoRetries = 0;
            }
        }
    }

    /** Start or restart the auto-change timer based on current settings. */
    resetAutoChangeTimer() {
        clearInterval(this.autoChangeTimeout);
        this.autoChangeTimeout = null;

        // Only start the timer if we're not in manual mode
        if (!this.isInManualMode) {
            this.autoChangeTimeout = setInterval(() => {
                this.changeAlgorithm();
            }, this.autoChangeIntervalInSeconds * 1000);
        }
    }

    /**
     * Comprehensive canvas context reset — consolidates all property
     * resets and adds 7 previously missing ones.
     */
    resetCanvasContext() {
        const { canvas, ctx } = this;
        const dpr = globalThis.devicePixelRatio || 1;

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

        // Line cap/join
        ctx.lineCap = 'butt';
        ctx.lineJoin = 'miter';
        ctx.miterLimit = 10;

        // Shadows
        ctx.shadowBlur = 0;
        ctx.shadowColor = 'transparent';
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        // Text
        ctx.textAlign = 'start';
        ctx.textBaseline = 'alphabetic';
        ctx.direction = 'inherit';

        // Filter
        ctx.filter = 'none';

        // Canvas background style
        canvas.style.background = 'transparent';

        // Begin new path
        ctx.beginPath();
    }

    /**
     * Enable or disable dev mode.
     * @param {boolean} active - Whether to enable dev mode.
     */
    setDevModeActive(active) {
        this.devModeActive = active;
        this.devModeAlternator = 0;
    }

    /**
     * Set the algorithms for dev mode (null = random).
     * @param {Function|null} algoA - The first algorithm class or null for random.
     * @param {Function|null} algoB - The second algorithm class or null for random.
     */
    setDevModeAlgos(algoA, algoB) {
        this.devModeAlgoA = algoA;
        this.devModeAlgoB = algoB;
    }

    /** Load the first algorithm (called once from `Spiral.init()`). */
    startFirst() {
        this.chooseAlgos();
    }

    /** Stop the currently running algorithm. Idempotent. */
    stopCurrentAlgorithm() {
        // Some algorithms use a `stop()` method, while others use an `interval` property for their animation loop. Handle both cases and ensure idempotency.
        if (this.currentAlgorithm?.stop) {
            this.currentAlgorithm.stop();
        } else if (this.currentAlgorithm?.interval) {
            cancelAnimationFrame(this.currentAlgorithm.interval);
            this.currentAlgorithm.interval = null;
        }
        this.currentAlgorithm = null;
    }
}
