import BA from '../BaseAlgorithm.js';

export default class SquareNebulas extends BA {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.length = BA.random(50, Math.min(this.w, this.h) / 1.5);
        this.maxLength = this.length;
        this.gap = BA.random(4, 100);
    }

    setupDrawingStyles() {
        this.ctx.fillStyle = BA.randomColor(5, 255, 0.025, 0.025);
        this.ctx.strokeStyle = BA.randomColor(5, 255, 0.8, 0.8);
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.stagger = this.stagger % 3;

            if (this.stagger === 0) {
                this.ctx.beginPath();
                this.ctx.moveTo(this.w / 2, this.h / 2);
                this.ctx.fillRect(
                    BA.random(0, this.w),
                    BA.random(0, this.h),
                    this.length,
                    this.length
                );
                this.ctx.stroke();
                this.ctx.closePath();
            }

            if (this.stagger === 1) {
                this.ctx.strokeRect(
                    this.w / 2,
                    this.h / 2,
                    this.length / 2,
                    this.length / 2
                );
                this.ctx.stroke();
                this.ctx.closePath();
            }

            if (this.stagger === 2) {
                this.ctx.fillRect(
                    BA.random(this.w / 2, this.w / 2 + this.length),
                    BA.random(this.h / 2, this.h / 2 + this.length),
                    this.length / 8,
                    this.length / 8
                );
                this.ctx.fill();
                this.ctx.closePath();
                this.ctx.translate(this.w / 2, this.h / 2);
                this.ctx.rotate(Math.random() * Math.PI);
                this.ctx.translate(-this.w / 2, -this.h / 2);
            }

            this.ctx.moveTo(this.w / 2, this.h / 2);
            this.ctx.translate(this.w / 2, this.h / 2);
            this.ctx.rotate(Math.random() * Math.PI);
            this.ctx.translate(-this.w / 2, -this.h / 2);

            this.length -= this.gap;
            if (this.length < -this.maxLength) {
                this.length = BA.random(this.maxLength / 2, this.w / 3);
                this.maxLength = 2 * this.length;
                this.gap = BA.random(2, 100);
            }

            this.stagger++;
        }

        if (this.t % (this.speed * 300) === 0) {
            this.ctx.closePath();
            this.ctx.beginPath();
            this.ctx.strokeStyle = BA.randomColor(5, 255, 0.8, 0.8);
            this.ctx.fillStyle = BA.randomColor(5, 255, 0.025, 0.025);
            this.ctx.translate(this.w / 2, this.h / 2);
            this.ctx.rotate(Math.random() * Math.PI);
            this.ctx.translate(-this.w / 2, -this.h / 2);
        }

        this.t++;

        requestAnimationFrame(this.draw);
    }
}
