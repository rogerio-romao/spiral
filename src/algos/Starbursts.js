import BA from '../BaseAlgorithm.js';

export default class Starbursts extends BA {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.length = BA.random(50, Math.min(this.w, this.h) / 1.5);
        this.maxLength = this.length;
        this.gap = BA.random(4, 120);
        this.maxGap = this.gap;
        this.startAngle = BA.random(0, 100);
        this.endAngle = BA.random(101, 360);
        this.rot1 = BA.random(1, 6);
    }

    setupDrawingStyles() {
        this.ctx.fillStyle = BA.randomColor(5, 255, 0.1, 0.1);
        this.ctx.strokeStyle = BA.randomColor(5, 255, 0.8, 0.8);
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.stagger = this.stagger % 3;

            if (this.stagger === 0) {
                this.ctx.arc(
                    this.w / 2,
                    this.h / 2 - this.length,
                    this.maxGap / 2,
                    this.startAngle,
                    this.endAngle
                );
            }

            if (this.stagger === 1) {
                this.ctx.lineTo(
                    this.w / 2 + this.length,
                    this.h / 2 - this.length
                );
            }

            if (this.stagger === 2) {
                this.ctx.beginPath();
                this.ctx.arc(
                    this.w / 2 + this.length,
                    this.h / 2 - 2 * this.length,
                    this.maxGap,
                    this.startAngle,
                    this.endAngle
                );
                this.ctx.fill();
            }

            this.ctx.stroke();
            this.ctx.translate(this.w / 2, this.h / 2);
            this.ctx.rotate(this.rot1);
            this.ctx.translate(-this.w / 2, -this.h / 2);

            this.length -= this.gap;
            if (this.length < -this.maxLength) {
                this.length = BA.random(7, 100);
                this.maxLength = 2 * this.length;
                this.gap = BA.random(2, 30);
                this.maxGap = 2 * this.gap;
            }

            this.stagger++;
        }

        if (this.t % (this.speed * 420) === 0) {
            this.ctx.closePath();
            this.ctx.beginPath();
            this.ctx.strokeStyle = BA.randomColor(5, 255, 0.8, 0.8);
            this.ctx.fillStyle = BA.randomColor(5, 255, 0.1, 0.1);
            if (Math.random() < 0.15) this.ctx.fillStyle = 'rgb(0,0,0)';
            this.ctx.translate(this.w / 2, this.h / 2);
            this.ctx.rotate(Math.random() * Math.PI);
            this.ctx.translate(-this.w / 2, -this.h / 2);
        }

        this.t++;

        requestAnimationFrame(this.draw);
    }
}
