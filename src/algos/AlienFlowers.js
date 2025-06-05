import BA from '../BaseAlgorithm.js';

export default class AlienFlowers extends BA {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    setupDrawingStyles() {
        this.modes = [
            'hard-light',
            'color-dodge',
            'multiply',
            'overlay',
            'color-burn',
        ];

        this.ctx.globalCompositeOperation = 'source-over';
        this.ctx.shadowColor = this.ctx.strokeStyle = BA.randomColor(
            5,
            255,
            0.1,
            0.1
        );
        this.ctx.shadowOffsetX =
            this.ctx.shadowOffsetY =
            this.ctx.lineWidth =
                BA.random(3, 36);
        this.ctx.lineJoin = 'bevel';
        this.ctx.setLineDash([BA.random(1, 100), BA.random(5, 200)]);
        this.ctx.lineCap = 'round';
        this.ctx.shadowBlur = 5;
        this.ctx.beginPath();
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.stagger = this.stagger % 4;

            if (this.stagger === 0) {
                this.ctx.moveTo(this.w / 2, this.h / 2);
                this.ctx.bezierCurveTo(
                    BA.random(0, this.w / 2),
                    BA.random(0, this.h / 2),
                    BA.random(0, this.w / 4),
                    BA.random(0, this.h / 4),
                    0,
                    0
                );
                this.ctx.stroke();
            }

            if (this.stagger === 1) {
                this.ctx.moveTo(this.w / 2, this.h / 2);
                this.ctx.bezierCurveTo(
                    BA.random(this.w / 2, this.w),
                    BA.random(0, this.h / 2),
                    BA.random(this.w * 0.75, this.w),
                    BA.random(0, this.h * 0.25),
                    this.w,
                    0
                );
                this.ctx.stroke();
            }

            if (this.stagger === 2) {
                this.ctx.moveTo(this.w / 2, this.h / 2);
                this.ctx.bezierCurveTo(
                    BA.random(this.w / 2, this.w),
                    BA.random(this.h / 2, this.h),
                    BA.random(this.w * 0.75, this.w),
                    BA.random(this.h * 0.75, this.h),
                    this.w,
                    this.h
                );
                this.ctx.stroke();
            }

            if (this.stagger === 3) {
                this.ctx.moveTo(this.w / 2, this.h / 2);
                this.ctx.bezierCurveTo(
                    BA.random(0, this.w / 2),
                    BA.random(this.h / 2, this.h),
                    BA.random(0, this.w * 0.25),
                    BA.random(this.h * 0.75, this.h),
                    0,
                    this.h
                );
                this.ctx.stroke();
            }

            this.stagger++;
        }

        if (this.t % (this.speed * 16) === 0) {
            this.ctx.translate(this.w / 2, this.h / 2);
            this.ctx.rotate((BA.random(1, 359) * 180) / Math.PI);
            this.ctx.translate(-this.w / 2, -this.h / 2);
        }

        if (this.t % (this.speed * 32) === 0) {
            this.ctx.beginPath();
            this.ctx.globalCompositeOperation =
                this.modes[BA.random(0, this.modes.length)];
        }

        if (this.t % (this.speed * 64) === 0) {
            this.ctx.beginPath();
            this.ctx.shadowColor = this.ctx.strokeStyle = BA.randomColor(
                5,
                255,
                0.1,
                0.1
            );
            this.ctx.shadowOffsetX =
                this.ctx.shadowOffsetY =
                this.ctx.lineWidth =
                    BA.random(3, 36);
        }

        if (this.t % (this.speed * 256) === 0) {
            this.ctx.setLineDash([BA.random(1, 100), BA.random(5, 200)]);
        }

        this.t++;

        requestAnimationFrame(this.draw);
    }
}
