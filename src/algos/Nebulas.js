import BA from '../BaseAlgorithm.js';

export default class Nebulas extends BA {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.length = BA.random(50, Math.min(this.w, this.h) / 1.5);
        this.gap = BA.random(4, 100);
        this.rotate = BA.random(3, 160);
    }

    setupDrawingStyles() {
        this.ctx.shadowBlur = 15;
        this.ctx.shadowColor = 'rgba(255,255,255,0.7)';
        this.ctx.shadowOffsetX = 5;
        this.ctx.shadowOffsetY = 5;
        this.ctx.fillStyle = this.ctx.strokeStyle = BA.randomColor(
            5,
            255,
            0.02,
            0.02
        );
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.lineWidth = BA.random(1, 200);
            this.ctx.strokeRect(this.w / 2, this.h / 2, this.length, this.gap);
            this.ctx.translate(this.w / 2, this.h / 2);
            this.ctx.rotate(this.rotate);
            this.ctx.translate(-this.w / 2, -this.h / 2);
            this.length = BA.random(10, Math.max(this.w, this.h));
            this.rotate = BA.random(3, 160);
            this.gap += BA.random(2, 10);
            if (this.gap > 1000) this.gap = 1;
        }

        if (this.t % (this.speed * 10) === 0) {
            this.ctx.fillRect(
                BA.random(0, this.w),
                BA.random(0, this.h),
                this.gap,
                this.gap
            );
        }

        if (this.t % (this.speed * 70) === 0) {
            this.rotate = -this.rotate;
            this.ctx.fillStyle = this.ctx.strokeStyle = BA.randomColor(
                5,
                255,
                0.02,
                0.02
            );
        }

        this.t++;

        requestAnimationFrame(this.draw);
    }
}
