import AL from '../AlgorithmLoader.js';

export default class Smooth extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.size = AL.random(50, 500);
        this.x = AL.random(0, this.w);
        this.y = AL.random(0, this.h);
        this.rot = AL.random(1, 11);
    }

    setupDrawingStyles() {
        this.ctx.fillStyle = AL.randomColor(0, 255, 0.03, 0.08);
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.fillRect(this.x, this.y, this.size, this.size);
        }

        this.ctx.translate(this.w / 2, this.h / 2);
        this.ctx.rotate(this.rot);
        this.ctx.translate(-this.w / 2, -this.h / 2);

        if (this.t % (this.speed * 60) === 0) {
            this.size = AL.random(50, 500);
            this.x = AL.random(0, this.w);
            this.y = AL.random(0, this.h);
            this.rot = AL.random(1, 11);

            this.ctx.fillStyle = AL.randomColor(0, 255, 0.03, 0.08);
        }

        this.t++;

        requestAnimationFrame(this.draw);
    }
}
