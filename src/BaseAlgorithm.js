import { random, randomColor } from "./utils/random.js";

export default class BaseAlgorithm {
    static random(min, max) {
        return random(min, max);
    }

    static randomColor(minC = 0, maxC = 255, minA = 0.1, maxA = 1) {
        return randomColor(minC, maxC, minA, maxA);
    }

    constructor(ctx, w, h) {
        this.ctx = ctx;
        this.w = w;
        this.h = h;

        // Common properties that many algorithms might use
        this.t = 0; // Time variable or frame counter
        this.interval = null; // To store requestAnimationFrame ID
        this.speed = BaseAlgorithm.random(2, 6); // Use static method instead
        this.stagger = 0; // Used for staggered animations

        this.draw = this.draw.bind(this); // Bind draw method to the instance
    }

    draw() {
        // This method should be overridden by subclasses
        throw new Error('Draw method must be implemented by subclass');
    }
}