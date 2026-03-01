import AL from '../AlgorithmLoader.js';

export default class Supernova extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.name = 'Supernova';

        this.initializeProperties();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeProperties() {
        this.rotate = AL.random(1, 20);
        this.approach = AL.random(5, 31);
        this.fib = [0, Number(Math.random().toFixed(3))];
        this.length = this.fib.at(-2) + this.fib.at(-1) + 3;
    }

    setupDrawingStyles() {
        this.ctx.fillStyle = AL.randomColor(0, 255, 0.03, 0.06);
        this.ctx.strokeStyle = AL.randomColor(0, 255, 0.06, 0.12);
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.translate(this.w / 2, this.h / 2);
            this.ctx.moveTo(0, 0);
            this.ctx.fillRect(0, 0, this.length, this.length);
            this.ctx.strokeRect(0, 0, this.length, this.length);
            this.ctx.rotate(1.618 * this.rotate);
            this.ctx.translate(-this.w / 2, -this.h / 2);
        }

        if (this.t % (this.speed * this.approach) === 0) {
            this.fib.push(this.fib.at(-2) + this.fib.at(-1));
            this.length = this.fib.at(-2) + this.fib.at(-1) + 3;
        }

        if (this.length > Math.max(this.w, this.h)) {
            this.length = 0;
            this.approach = AL.random(5, 31);
            this.fib = [0, Number(Math.random().toFixed(3))];
            this.length = this.fib.at(-2) + this.fib.at(-1) + 3;
            this.rotate = AL.random(1, 20);
            this.setupDrawingStyles();
        }

        this.t += 1;

        this.requestFrame();
    }
}
