export default class BaseAlgorithm {
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

    constructor(ctx, w, h) {
        this.ctx = ctx;
        this.w = w;
        this.h = h;

        // Common properties that many algorithms might use
        this.t = 1; // Time variable or frame counter
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
