import BA from '../BaseAlgorithm.js';

export default class TheFan extends BA {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.x1 = BA.random(0, this.w / 2);
        this.y1 = BA.random(0, this.h / 2);
        this.x2 = BA.random(this.w / 2, this.w);
        this.y2 = BA.random(this.h / 2, this.h);
        this.ox = BA.random(0, this.w / 2);
        this.oy = BA.random(0, this.h / 2);
        this.dx = BA.random(this.w / 2, this.w);
        this.dy = BA.random(this.h / 2, this.h);
        this.rotate = BA.random(1, 359);
    }

    setupDrawingStyles() {
        this.ctx.strokeStyle = BA.randomColor();
        this.ctx.globalCompositeOperation = 'luminosity';
        this.ctx.filter = 'saturate(500%)';
        this.ctx.shadowColor = 'black';
        this.ctx.shadowBlur = 4;
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.moveTo(this.ox++, this.oy);
            this.ctx.bezierCurveTo(
                this.x1,
                this.y1,
                this.x2,
                this.y2,
                this.dx,
                this.dy++
            );
            this.ctx.stroke();
        }

        this.ctx.translate(this.w / 2, this.h / 2);
        this.ctx.rotate(this.rotate);
        this.ctx.translate(-this.w / 2, -this.h / 2);

        if (this.t % (this.speed * 240) === 0) {
            this.x1 = BA.random(0, this.w / 2);
            this.y1 = BA.random(0, this.h / 2);
            this.x2 = BA.random(this.w / 2, this.w);
            this.y2 = BA.random(this.h / 2, this.h);
            this.ox = BA.random(0, this.w / 2);
            this.oy = BA.random(0, this.h / 2);
            this.dx = BA.random(this.w / 2, this.w);
            this.dy = BA.random(this.h / 2, this.h);
            this.rotate = BA.random(1, 359);

            this.ctx.beginPath();
            this.ctx.strokeStyle = BA.randomColor();
        }

        this.t++;

        requestAnimationFrame(this.draw);
    }
}
