import BA from '../BaseAlgorithm.js';

export default class Supernova extends BA {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.fib = [0, +Math.random().toFixed(3)];
        this.length =
            this.fib[this.fib.length - 2] + this.fib[this.fib.length - 1] + 3;
        this.rot = BA.random(1, 20);
        this.approach = BA.random(5, 31);
    }

    setupDrawingStyles() {
        this.ctx.fillStyle = BA.randomColor(0, 255, 0.03, 0.06);
        this.ctx.strokeStyle = BA.randomColor(0, 255, 0.06, 0.12);
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.translate(this.w / 2, this.h / 2);
            this.ctx.moveTo(0, 0);
            this.ctx.fillRect(0, 0, this.length, this.length);
            this.ctx.strokeRect(0, 0, this.length, this.length);
            this.ctx.rotate(1.618 * this.rot);
            this.ctx.translate(-this.w / 2, -this.h / 2);
        }

        if (this.t % (this.speed * this.approach) === 0) {
            this.fib.push(
                this.fib[this.fib.length - 2] + this.fib[this.fib.length - 1]
            );
            this.length =
                this.fib[this.fib.length - 2] +
                this.fib[this.fib.length - 1] +
                3;
        }

        if (this.length > Math.max(this.w, this.h)) {
            this.length = 0;
            this.approach = BA.random(5, 31);
            this.fib = [0, +Math.random().toFixed(3)];
            this.length =
                this.fib[this.fib.length - 2] +
                this.fib[this.fib.length - 1] +
                3;
            this.rot = BA.random(1, 20);
            this.ctx.strokeStyle = BA.randomColor(0, 255, 0.06, 0.12);
            this.ctx.fillStyle = BA.randomColor(0, 255, 0.03, 0.06);
        }

        this.t++;

        requestAnimationFrame(this.draw);
    }
}
