import { random, randomColor } from "./utils/random.js";

export default class BaseAlgorithm {
    constructor(ctx, w, h) {
        this.ctx = ctx;
        this.w = w;
        this.h = h;

        // Make utility functions available to subclasses via `this`
        this.random = random;
        this.randomColor = randomColor;

        // Common properties that many algorithms might use
        this.t = 0; // Time variable or frame counter
        this.interval = null; // To store requestAnimationFrame ID
        this.speed = this.random(2, 6); // Default speed, can be overridden
        this.stagger = 0; // Used for staggered animations

        this.draw = this.draw.bind(this); // Bind draw method to the instance
    }

    draw() {
        // This method should be overridden by subclasses
        throw new Error('Draw method must be implemented by subclass');
    }
}