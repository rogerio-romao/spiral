import AlgorithmLoader from './AlgorithmLoader.js';
import { algorithms } from './generated/algorithmRegistry.js';
import { saveBlockedAlgorithms } from './utils/BlockedAlgorithms.js';
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
    algoRetries = 0;
    autoChangeIntervalInSeconds = 60;
    /** @type {any} */
    autoChangeTimeout = null;
    blockedAlgorithms = new Set();
    /** @type {any} */
    currentAlgorithm = null;
    devModeActive = false;
    /** @type {Function|null} */
    devModeAlgoA = null;
    /** @type {Function|null} */
    devModeAlgoB = null;
    devModeAlternator = 0;
    isInManualMode = false;
    isTransitioning = false;
    lastAlgos = new Set();
    lastAlgosCapacity = 50;

    /**
     * @param {Object} deps - Dependencies object containing required components
     * @param {HTMLCanvasElement} deps.canvas - The HTML canvas element
     * @param {import('./AlgorithmLoader.js').default} deps.algorithmLoader - Algorithm loader instance
     * @param {import('./HudController.js').default} deps.hudController - HUD controller instance
     */
    constructor({ canvas, algorithmLoader, hudController }) {
        this.canvas = canvas;
        this.algorithmLoader = algorithmLoader;
        this.hudController = hudController;
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

            this.algorithmLoader.speed = random(2, 6);

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
        /** @type {any} */
        let AlgorithmClass = null;
        if (this.devModeActive) {
            // In dev mode, alternate between two specified algorithms (or random if null) on each call. This allows for quick testing of specific algorithms without changing code.
            const isSlotA = this.devModeAlternator === 0;
            this.devModeAlternator = 1 - this.devModeAlternator;
            const algoChoice = isSlotA ? this.devModeAlgoA : this.devModeAlgoB;
            AlgorithmClass = algoChoice || this.getRandomAlgorithm();
        } else {
            AlgorithmClass = this.getRandomAlgorithm();
        }

        // Attempt to instantiate the chosen algorithm, with retry logic in case of constructor errors. This is important because some algorithms may throw errors due to edge cases or unexpected conditions. We want to ensure that a single failure doesn't break the entire app, and that we can recover gracefully by trying a different algorithm.
        try {
            this.currentAlgorithm = new AlgorithmClass();
            this.hudController.displayAlgorithmName(this.currentAlgorithm.name);
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

    /**
     * Returns a random algorithm class, avoiding recently used and blocked ones.
     * The recency capacity scales down proportionally as algorithms are blocked,
     * so the Set never holds more entries than there are active algorithms.
     * @returns {Function} The chosen algorithm class constructor.
     */
    getRandomAlgorithm() {
        const activeAlgos = algorithms.filter((algo) => !this.blockedAlgorithms.has(algo.name));

        const effectiveCapacity = Math.floor(
            activeAlgos.length * (this.lastAlgosCapacity / algorithms.length),
        );

        // Trim lastAlgos down to the effective capacity by evicting oldest entries
        while (this.lastAlgos.size > effectiveCapacity) {
            this.lastAlgos.delete(this.lastAlgos.values().next().value);
        }

        let picks = activeAlgos.filter((algo) => !this.lastAlgos.has(algo));

        // If all active algos are in lastAlgos (only happens at very small pool sizes),
        // reset and use the full active pool
        if (picks.length === 0) {
            this.lastAlgos.clear();
            picks = activeAlgos;
        }

        const randomIndex = Math.floor(Math.random() * picks.length);
        const AlgorithmClass = picks[randomIndex];

        this.lastAlgos.add(AlgorithmClass);

        return AlgorithmClass;
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
        const { canvas } = this;
        const { ctx } = AlgorithmLoader;
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
     * Replace the entire blocked set with a new collection of names and persist it.
     * @param {Iterable<string>} names - Algorithm class names to block.
     */
    setBlockedAlgorithms(names) {
        this.blockedAlgorithms = new Set(names);
        saveBlockedAlgorithms([...this.blockedAlgorithms]);
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
