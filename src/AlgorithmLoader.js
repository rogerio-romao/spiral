import Particle from './utils/Particle.js';
import Vector from './utils/Vector.js';
import mathUtils from './utils/math.js';

export default class AlgorithmLoader {
    static random(min, max) {
        const num = Math.floor(Math.random() * (max - min)) + min;
        return num;
    }

    static randomColor(minC = 0, maxC = 255, minA = 0.1, maxA = 1) {
        const r = this.random(minC, maxC);
        const g = this.random(minC, maxC);
        const b = this.random(minC, maxC);
        const a = +(Math.random() * (maxA - minA) + minA).toFixed(3);
        return `rgba(${r}, ${g}, ${b}, ${a})`;
    }

    static mathUtils = mathUtils;

    static gsap = gsap;

    static frequencyAnalyser = null;

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

        this.t = 0; // Time variable or frame counter
        this.interval = null; // To store requestAnimationFrame ID
        this.speed = AlgorithmLoader.random(2, 6);
        this.stagger = 0; // Used for staggered animations
        this.isRunning = true;

        const originalDraw = this.draw.bind(this);
        this.draw = () => {
            if (!this.isRunning) return;
            originalDraw();
        };
    }

    /**
     * Schedule the next animation frame and track its ID so that
     * stop() can cancel the correct pending frame.
     */
    requestFrame() {
        this.interval = requestAnimationFrame(this.draw);
    }

    clearScreen() {
        this.ctx.save();
        this.ctx.resetTransform();
        this.ctx.clearRect(0, 0, this.w, this.h);
        this.ctx.restore();
    }

    fillScreen() {
        this.ctx.save();
        this.ctx.resetTransform();
        this.ctx.fillRect(0, 0, this.w, this.h);
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

    draw() {
        // This method should be overridden by subclasses
        throw new Error('Draw method must be implemented by subclass');
    }

    stop() {
        this.isRunning = false;
        if (this.interval) {
            cancelAnimationFrame(this.interval);
        }
        this.interval = null;
    }
}
