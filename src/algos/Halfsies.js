import AL from '../AlgorithmLoader.js';

export default class Halfsies extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeConstantProperties();
        this.initializeProperties();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeConstantProperties() {
        this.counter = false;
    }

    initializeProperties() {
        this.rot = AL.random(3, 37);
        this.radius = AL.random(40, 400);
        this.x = AL.random(this.w / 2 - this.radius, this.w / 2 + this.radius);
        this.y = AL.random(this.h / 2 - this.radius, this.h / 2 + this.radius);
        this.width1 = AL.random(2, 11);
        this.width2 = AL.random(2, 11);
    }

    draw() {
        this.ctx.lineWidth = this.t % 2 ? this.width1 : this.width2;
        this.ctx.strokeStyle = this.t % 2 ? 'black' : 'white';
        this.counter = !this.counter;
        this.ctx.globalCompositeOperation =
            this.t % 2 ? 'source-over' : 'difference';

        if (this.t % this.speed === 0) {
            this.ctx.beginPath();
            this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI, this.counter);
            this.ctx.stroke();
            this.ctx.closePath();
        }

        this.t++;

        this.rotateCanvasDegrees(this.rot);

        if (this.t % (this.speed * 120) === 0) {
            this.initializeProperties();

            this.ctx.beginPath();
        }

        requestAnimationFrame(this.draw);
    }
}
