import AL from '../AlgorithmLoader.js';

export default class SquareNebulas extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.length = AL.random(50, Math.min(this.w, this.h) / 1.5);
        this.maxLength = this.length;
        this.gap = AL.random(4, 100);
    }

    setupDrawingStyles() {
        this.ctx.fillStyle = AL.randomColor(5, 255, 0.025, 0.025);
        this.ctx.strokeStyle = AL.randomColor(5, 255, 0.8, 0.8);
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.stagger = this.stagger % 3;

            if (this.stagger === 0) {
                this.ctx.beginPath();
                this.ctx.moveTo(this.w / 2, this.h / 2);
                this.ctx.fillRect(
                    AL.random(0, this.w),
                    AL.random(0, this.h),
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
                    AL.random(this.w / 2, this.w / 2 + this.length),
                    AL.random(this.h / 2, this.h / 2 + this.length),
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
                this.length = AL.random(this.maxLength / 2, this.w / 3);
                this.maxLength = 2 * this.length;
                this.gap = AL.random(2, 100);
            }

            this.stagger++;
        }

        if (this.t % (this.speed * 300) === 0) {
            this.ctx.closePath();
            this.ctx.beginPath();
            this.ctx.strokeStyle = AL.randomColor(5, 255, 0.8, 0.8);
            this.ctx.fillStyle = AL.randomColor(5, 255, 0.025, 0.025);
            this.ctx.translate(this.w / 2, this.h / 2);
            this.ctx.rotate(Math.random() * Math.PI);
            this.ctx.translate(-this.w / 2, -this.h / 2);
        }

        this.t++;

        requestAnimationFrame(this.draw);
    }
}
