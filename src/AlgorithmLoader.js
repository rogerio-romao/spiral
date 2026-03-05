/// <reference path="../assets/js/types/gsap-core.d.ts" />

import mathUtils from './utils/math.js';
import Particle from './utils/Particle.js';
import {
    generateHSLAPalette,
    generateRGBAPalette,
    random,
    randomColor,
} from './utils/randomUtils.js';
import Vector from './utils/Vector.js';

/**
 * Base class for all visualizer algorithms.
 * Provides a standard interface for canvas drawing, lifecycle management,
 * and access to shared utilities like audio data, math helpers, and GSAP.
 */
export default class AlgorithmLoader {
    // STATIC PROPERTIES

    /**
     * Reference to the `FrequencyAnalyser` instance, providing access to audio FFT data/bands.
     * Gets injected by `Spiral` after initialization. Algorithms can check if it's available and use it to get frequency data for visualization.
     *
     * @static
     * @type {import('./utils/FrequencyAnalyser.js').default|null}
     */
    static frequencyAnalyser = null;

    /**
     * Reference to GSAP animation library (global).
     * This expects GSAP to be loaded globally via <script src="./assets/js/gsap.min.js"></script> in index.html.
     * If GSAP is not present, this will be null and a warning will be logged.
     *
     * @static
     * @readonly
     * @type {typeof gsap|null}
     */
    static gsap = globalThis.gsap || null;

    /**
     * Reference to shared math helpers imported from ./utils/math.js.
     *
     * Exposes common math utilities for algorithms (e.g. easing, angle helpers).
     * Accessible as a class-level utility: AlgorithmLoader.mathUtils.<method>()
     *
     * @static
     * @readonly
     * @type {typeof import('./utils/math.js').default}
     */
    static mathUtils = mathUtils;

    /**
     * Reference to the WaveformController instance, providing access to audio waveform data. This gets injected by Spiral after initialization. Algorithms can check if it's available and use it to get waveform data for visualization.
     *
     * @static
     * @type {import('./WaveformController.js').default|null}
     */
    static waveformController = null;

    // STATIC METHODS

    /**
     * Create a new Particle instance.
     * @static
     * @param {number} x - The initial x coordinate.
     * @param {number} y - The initial y coordinate.
     * @param {number} speed - The initial speed.
     * @param {number} direction - The initial direction in radians.
     * @param {number} [grav] - The gravity applied to the particle (defaults to 0).
     * @returns {Particle} A new Particle instance.
     */
    static createParticle(x, y, speed, direction, grav = 0) {
        return new Particle(x, y, speed, direction, grav);
    }

    /**
     * Create a new Vector instance.
     * @static
     * @param {number} x - The x coordinate.
     * @param {number} y - The y coordinate.
     * @returns {Vector} A new Vector instance.
     */
    static createVector(x, y) {
        return new Vector(x, y);
    }

    /**
     * Generate an array of HSLA color strings, varying one property equally across the range with wrap-around.
     * @static
     * @param {number} count - Number of colors to generate.
     * @param {'hue'|'saturation'|'luminosity'|'alpha'|'random'} [mode] - Which property to vary (defaults to 'hue').
     * @param {number|null} [degrees] - Optional step in degrees for hue mode (overrides automatic calculation).
     * @returns {string[]} Array of length `count` of HSLA color strings.
     */
    static generateHSLAPalette(count, mode = 'hue', degrees = null) {
        return generateHSLAPalette(count, mode, degrees);
    }

    /**
     * Generate an array of random RGBA colors.
     * Delegates to randomColor, accepts these parameters.
     * @static
     * @param {number} count - Number of colors to generate.
     * @param {number} [minC] - Minimum color value for each channel (0-255).
     * @param {number} [maxC] - Maximum color value for each channel (0-255).
     * @param {number} [minA] - Minimum alpha value (0-1).
     * @param {number} [maxA] - Maximum alpha value (0-1).
     * @returns {string[]} Array of length `count` of RGBA color strings.
     */
    static generateRGBAPalette(count, minC = 0, maxC = 255, minA = 0.5, maxA = 1) {
        return generateRGBAPalette(count, minC, maxC, minA, maxA);
    }

    /**
     * Pick a random element from an array.
     * @static
     * @param {Array<any>} array - The array to pick from.
     * @returns {any} A random element from the given array.
     */
    static pickRandomElement(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    /**
     * Generate a random integer between min (inclusive) and max (inclusive).
     * @static
     * @param {number} min - Minimum integer value (inclusive).
     * @param {number} max - Maximum integer value (inclusive).
     * @returns {number} Random integer between min and max.
     */
    static random(min, max) {
        return random(min, max);
    }

    /**
     * Generate a random RGBA or P3 color string.
     * @static
     * @param {number} [minC] - Minimum color value (0-255).
     * @param {number} [maxC] - Maximum color value (0-255).
     * @param {number} [minA] - Minimum alpha value (0-1).
     * @param {number} [maxA] - Maximum alpha value (0-1).
     * @returns {string} RGBA or P3 color string.
     */
    static randomColor(minC = 0, maxC = 255, minA = 0.1, maxA = 1) {
        return randomColor(minC, maxC, minA, maxA);
    }

    /**
     * Initializes a new algorithm instance.
     * @param {CanvasRenderingContext2D} ctx - The canvas 2D rendering context.
     * @param {number} w - The width of the canvas.
     * @param {number} h - The height of the canvas.
     */
    constructor(ctx, w, h) {
        this.ctx = ctx;
        this.w = w;
        this.h = h;

        // Time related properties for animation control
        this.t = 0;
        this.animationFrameId = null;
        this.speed = AlgorithmLoader.random(2, 5);

        // Used for staggered animations
        this.stagger = 0;

        // Used for cleanup and error handling in the draw loop
        this.isRunning = true;

        // Wrap the subclass draw() in an error boundary.
        // If the algorithm throws during animation, stop() is called and
        // an 'algorithm-error' event is dispatched so the app can recover.
        const originalDraw = this.draw.bind(this);
        this.draw = () => {
            if (!this.isRunning) {
                return;
            }
            try {
                originalDraw();
            } catch {
                this.stop();
                this.ctx.canvas.dispatchEvent(new CustomEvent('algorithm-error'));
            }
        };
    }

    // INSTANCE METHODS

    /**
     * Clears the entire canvas, resetting any transforms.
     */
    clearScreen() {
        this.ctx.save();
        this.ctx.resetTransform();
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.restore();
    }

    /**
     * Abstract draw method. Must be overridden by subclasses.
     *
     * Do NOT call `super.draw()` in your algorithm. If you see this error,
     * it means your subclass did not implement `draw()`, or you called `super.draw()` by mistake.
     *
     * @example
     * ```js
     *   class MyAlgo extends AlgorithmLoader {
     *       draw() {
     *           // ...your drawing code...
     *       }
     *   }
     * ```
     */
    draw() {
        throw new Error(
            '[AlgorithmLoader] draw() must be implemented by subclass. Do NOT call super.draw() in your algorithm.',
        );
    }

    /**
     * Fills the entire canvas with the current fill style, resetting any transforms.
     */
    fillScreen() {
        this.ctx.save();
        this.ctx.resetTransform();
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.restore();
    }

    /**
     * Schedule the next animation frame and track its ID so that
     * stop() can cancel the correct pending frame.
     */
    requestFrame() {
        this.animationFrameId = requestAnimationFrame(this.draw);
    }

    /**
     * Rotates the canvas context by a given angle in degrees around its center.
     * @param {number} angle - The angle in degrees to rotate.
     */
    rotateCanvasDegrees(angle) {
        this.ctx.translate(this.w / 2, this.h / 2);
        this.ctx.rotate((angle * Math.PI) / 180);
        this.ctx.translate(-this.w / 2, -this.h / 2);
    }

    /**
     * Rotates the canvas context by a given angle in radians around its center.
     * @param {number} angle - The angle in radians to rotate.
     */
    rotateCanvasRadians(angle) {
        this.ctx.translate(this.w / 2, this.h / 2);
        this.ctx.rotate(angle);
        this.ctx.translate(-this.w / 2, -this.h / 2);
    }

    /**
     * Stop the running algorithm and cancel any pending animation frame.
     *
     * Marks the algorithm as not running so draw() becomes a no-op, cancels the
     * stored requestAnimationFrame id if one exists, and clears the id.
     *
     * Safe to call multiple times.
     */
    stop() {
        this.isRunning = false;
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        this.animationFrameId = null;
    }
}
