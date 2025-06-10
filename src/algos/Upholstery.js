import BA from '../BaseAlgorithm.js';

export default class Upholstery extends BA {
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
        this.rotate = BA.random(1, 55);
        this.dash1 = BA.random(1, 15);
        this.dash2 = BA.random(20, 40);
        this.dash3 = BA.random(1, 50);
    }

    setupDrawingStyles() {
        this.ctx.strokeStyle = BA.randomColor(50, 255, 1, 1);
        this.ctx.setLineDash([this.dash1, this.dash2, this.dash3]);
        this.ctx.globalCompositeOperation = 'overlay';
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.moveTo(this.x1, this.y1);
            this.ctx.lineTo(this.x2, this.y2);
            this.ctx.stroke();
        }

        this.ctx.translate(this.w / 2, this.h / 2);
        this.ctx.rotate(this.rotate);
        this.ctx.translate(-this.w / 2, -this.h / 2);

        if (this.t % (this.speed * 120) === 0) {
            this.dash1 = BA.random(1, 15);
            this.dash2 = BA.random(20, 40);
            this.dash3 = BA.random(1, 50);
            this.x1 = BA.random(0, this.w);
            this.y1 = BA.random(0, this.h);
            this.x2 = BA.random(0, this.w);
            this.y2 = BA.random(0, this.h);
            this.rotate = BA.random(1, 55);

            this.ctx.setLineDash([this.dash1, this.dash2, this.dash3]);
            this.ctx.strokeStyle = BA.randomColor(50, 255, 1, 1);
            this.ctx.beginPath();
        }

        this.t++;

        requestAnimationFrame(this.draw);
    }
}
