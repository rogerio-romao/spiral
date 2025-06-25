import AL from '../AlgorithmLoader.js';

export default class AlienFlowers extends AL {
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
        this.ctx.shadowColor = this.ctx.strokeStyle = AL.randomColor(
            5,
            255,
            0.1,
            0.1
        );
        this.ctx.shadowOffsetX =
            this.ctx.shadowOffsetY =
            this.ctx.lineWidth =
                AL.random(3, 36);
        this.ctx.lineJoin = 'bevel';
        this.ctx.setLineDash([AL.random(1, 100), AL.random(5, 200)]);
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
                    AL.random(0, this.w / 2),
                    AL.random(0, this.h / 2),
                    AL.random(0, this.w / 4),
                    AL.random(0, this.h / 4),
                    0,
                    0
                );
                this.ctx.stroke();
            }

            if (this.stagger === 1) {
                this.ctx.moveTo(this.w / 2, this.h / 2);
                this.ctx.bezierCurveTo(
                    AL.random(this.w / 2, this.w),
                    AL.random(0, this.h / 2),
                    AL.random(this.w * 0.75, this.w),
                    AL.random(0, this.h * 0.25),
                    this.w,
                    0
                );
                this.ctx.stroke();
            }

            if (this.stagger === 2) {
                this.ctx.moveTo(this.w / 2, this.h / 2);
                this.ctx.bezierCurveTo(
                    AL.random(this.w / 2, this.w),
                    AL.random(this.h / 2, this.h),
                    AL.random(this.w * 0.75, this.w),
                    AL.random(this.h * 0.75, this.h),
                    this.w,
                    this.h
                );
                this.ctx.stroke();
            }

            if (this.stagger === 3) {
                this.ctx.moveTo(this.w / 2, this.h / 2);
                this.ctx.bezierCurveTo(
                    AL.random(0, this.w / 2),
                    AL.random(this.h / 2, this.h),
                    AL.random(0, this.w * 0.25),
                    AL.random(this.h * 0.75, this.h),
                    0,
                    this.h
                );
                this.ctx.stroke();
            }

            this.stagger++;
        }

        this.t++;

        if (this.t % (this.speed * 16) === 0) {
            this.rotateCanvasDegrees(AL.random(1, 359));
        }

        if (this.t % (this.speed * 32) === 0) {
            this.ctx.beginPath();
            this.ctx.globalCompositeOperation = AL.pickRandomElement(
                this.modes
            );
        }

        if (this.t % (this.speed * 64) === 0) {
            this.ctx.beginPath();
            this.ctx.shadowColor = this.ctx.strokeStyle = AL.randomColor(
                5,
                255,
                0.1,
                0.1
            );
            this.ctx.shadowOffsetX =
                this.ctx.shadowOffsetY =
                this.ctx.lineWidth =
                    AL.random(3, 36);
        }

        if (this.t % (this.speed * 256) === 0) {
            this.ctx.setLineDash([AL.random(1, 100), AL.random(5, 200)]);
        }

        requestAnimationFrame(this.draw);
    }
}
