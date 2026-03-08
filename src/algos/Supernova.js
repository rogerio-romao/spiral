import AL from '../AlgorithmLoader.js';

export default class Supernova extends AL {
    constructor() {
        super();

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
        AL.ctx.fillStyle = AL.randomColor(0, 255, 0.03, 0.06);
        AL.ctx.strokeStyle = AL.randomColor(0, 255, 0.06, 0.12);
    }

    draw() {
        if (this.t % this.speed === 0) {
            AL.ctx.translate(AL.w / 2, AL.h / 2);
            AL.ctx.moveTo(0, 0);
            AL.ctx.fillRect(0, 0, this.length, this.length);
            AL.ctx.strokeRect(0, 0, this.length, this.length);
            AL.ctx.rotate(1.618 * this.rotate);
            AL.ctx.translate(-AL.w / 2, -AL.h / 2);
        }

        if (this.t % (this.speed * this.approach) === 0) {
            this.fib.push(this.fib.at(-2) + this.fib.at(-1));
            this.length = this.fib.at(-2) + this.fib.at(-1) + 3;
        }

        if (this.length > Math.max(AL.w, AL.h)) {
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
