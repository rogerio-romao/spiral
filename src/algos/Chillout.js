import BA from '../BaseAlgorithm.js';

export default class Chillout extends BA {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.x1 = BA.random(0, this.w);
        this.y1 = BA.random(0, this.h);
        this.x2 = BA.random(0, this.w);
        this.y2 = BA.random(0, this.h);
        this.x3 = BA.random(0, this.w);
        this.y3 = BA.random(0, this.h);
        this.rotate = BA.random(1, 10);
    }

    setupDrawingStyles() {
        this.ctx.lineWidth = BA.random(1, 5);
        this.ctx.strokeStyle = BA.randomColor(0, 255, 0.4, 1);
        this.ctx.filter = 'saturate(17.5%)';
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.moveTo(this.x3, this.y3);
            this.ctx.quadraticCurveTo(this.x2, this.y2, this.x1, this.y1);
            this.ctx.stroke();

            this.ctx.translate(this.w / 2, this.h / 2);
            this.ctx.rotate(this.rotate);
            this.ctx.translate(-this.w / 2, -this.h / 2);
        }

        if (this.t % (this.speed * 80) === 0) {
            this.x1 = BA.random(0, this.w);
            this.y1 = BA.random(0, this.h);
            this.x2 = BA.random(0, this.w);
            this.y2 = BA.random(0, this.h);
            this.x3 = BA.random(0, this.w);
            this.y3 = BA.random(0, this.h);

            this.ctx.beginPath();
            this.ctx.lineWidth = BA.random(1, 5);
            this.ctx.strokeStyle = BA.randomColor(0, 255, 0.4, 1);
            this.rotate = BA.random(1, 10);
        }

        this.t++;

        requestAnimationFrame(this.draw);
    }
}
