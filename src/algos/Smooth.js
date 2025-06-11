import BA from '../BaseAlgorithm.js';

export default class Smooth extends BA {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.size = BA.random(50, 500);
        this.x = BA.random(0, this.w);
        this.y = BA.random(0, this.h);
        this.rot = BA.random(1, 11);
    }

    setupDrawingStyles() {
        this.ctx.fillStyle = BA.randomColor(0, 255, 0.03, 0.08);
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.fillRect(this.x, this.y, this.size, this.size);
        }

        this.ctx.translate(this.w / 2, this.h / 2);
        this.ctx.rotate(this.rot);
        this.ctx.translate(-this.w / 2, -this.h / 2);

        if (this.t % (this.speed * 60) === 0) {
            this.size = BA.random(50, 500);
            this.x = BA.random(0, this.w);
            this.y = BA.random(0, this.h);
            this.rot = BA.random(1, 11);

            this.ctx.fillStyle = BA.randomColor(0, 255, 0.03, 0.08);
        }

        this.t++;

        requestAnimationFrame(this.draw);
    }
}
