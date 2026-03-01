import Particle from './utils/Particle.js';
import Vector from './utils/Vector.js';
import mathUtils from './utils/math.js';
import {
    generateHSLAPalette,
    generateRGBAPalette,
    random,
    randomColor,
} from './utils/randomUtils.js';

export default class AlgorithmLoader {
    static random(min, max) {
        return random(min, max);
    }

    static randomColor(minC = 0, maxC = 255, minA = 0.1, maxA = 1) {
        return randomColor(minC, maxC, minA, maxA);
    }

    static generateRGBAPalette(
        count,
        minC = 0,
        maxC = 255,
        minA = 0.5,
        maxA = 1,
    ) {
        return generateRGBAPalette(count, minC, maxC, minA, maxA);
    }

    static generateHSLAPalette(count, mode = 'hue') {
        return generateHSLAPalette(count, mode);
    }

    static mathUtils = mathUtils;

    /**
     * Reference to GSAP animation library (global).
     * This expects GSAP to be loaded globally via <script src="./assets/js/gsap.min.js"></script> in index.html.
     * If GSAP is not present, this will be null and a warning will be logged.
     */
    static gsap =
        typeof window !== 'undefined' && window.gsap ? window.gsap : null;

    static frequencyAnalyser = null;

    static waveformController = null;

    static createVector(x, y) {
        return new Vector(x, y);
    }

    static createParticle(x, y, speed, direction, grav = 0) {
        return new Particle(x, y, speed, direction, grav);
    }

    static pickRandomElement(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    constructor(ctx, w, h) {
        this.ctx = ctx;
        this.w = w;
        this.h = h;

        // Time variable or frame counter
        this.t = 0;
        this.animationFrameId = null;
        this.speed = AlgorithmLoader.random(2, 6);
        // Used for staggered animations
        this.stagger = 0;
        this.isRunning = true;

        const originalDraw = this.draw.bind(this);
        this.draw = () => {
            if (!this.isRunning) return;
            try {
                originalDraw();
            } catch (err) {
                console.error('[AlgorithmLoader] draw() threw:', err);
                this.stop();
                this.ctx.canvas.dispatchEvent(
                    new CustomEvent('algorithm-error'),
                );
            }
        };
    }

    /**
     * Schedule the next animation frame and track its ID so that
     * stop() can cancel the correct pending frame.
     */
    requestFrame() {
        this.animationFrameId = requestAnimationFrame(this.draw);
    }

    clearScreen() {
        this.ctx.save();
        this.ctx.resetTransform();
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.restore();
    }

    fillScreen() {
        this.ctx.save();
        this.ctx.resetTransform();
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.restore();
    }

    rotateCanvasRadians(angle) {
        this.ctx.translate(this.w / 2, this.h / 2);
        this.ctx.rotate(angle);
        this.ctx.translate(-this.w / 2, -this.h / 2);
    }

    rotateCanvasDegrees(angle) {
        this.ctx.translate(this.w / 2, this.h / 2);
        this.ctx.rotate((angle * Math.PI) / 180);
        this.ctx.translate(-this.w / 2, -this.h / 2);
    }

    /**
     * Abstract draw method. Must be overridden by subclasses.
     *
     * Do NOT call super.draw() in your algorithm. If you see this error,
     * it means your subclass did not implement draw(), or you called super.draw() by mistake.
     *
     * Example:
     *   class MyAlgo extends AlgorithmLoader {
     *       draw() {
     *           // ...your drawing code...
     *       }
     *   }
     */
    draw() {
        throw new Error(
            '[AlgorithmLoader] draw() must be implemented by subclass. Do NOT call super.draw() in your algorithm.',
        );
    }

    stop() {
        this.isRunning = false;
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        this.animationFrameId = null;
    }
}
