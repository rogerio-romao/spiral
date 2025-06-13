import BA from '../BaseAlgorithm.js';

export default class Hive extends BA {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.rows = BA.random(3, 10);
        this.height = this.h / this.rows;
        this.angles = [9, 10, 12, 16, 20, 30, 36, 45, 60];
        this.rot = this.angles[BA.random(1, this.angles.length)];
    }

    setupDrawingStyles() {
        this.ctx.globalCompositeOperation = 'overlay';
        this.ctx.strokeStyle = BA.randomColor();
        this.ctx.shadowColor = BA.randomColor();
        this.ctx.shadowBlur = 7;
        this.ctx.lineWidth = BA.random(7, 18);
    }

    draw() {
        if (this.t % this.speed === 0) {
            for (let i = 0; i <= this.rows; i++) {
                this.ctx.strokeRect(
                    BA.random(0, this.w),
                    i * this.height,
                    BA.random(0, this.w),
                    this.height
                );
            }
        }

        this.ctx.translate(this.w / 2, this.h / 2);
        this.ctx.rotate((this.rot * Math.PI) / 180);
        this.ctx.translate(-this.w / 2, -this.h / 2);

        if (this.t % (this.speed * 125) === 0) {
            this.rows = BA.random(3, 10);
            this.rot = this.angles[BA.random(1, this.angles.length)];
            this.height = this.h / this.rows;

            this.ctx.strokeStyle = BA.randomColor();
            this.ctx.shadowColor = BA.randomColor();
            this.ctx.globalCompositeOperation = 'overlay';
        }

        if (this.t % (this.speed * 500) === 0) {
            this.ctx.globalCompositeOperation = 'difference';
        }

        if (this.t % (this.speed * 1500) === 0) {
            this.ctx.globalCompositeOperation = 'hard-light';
        }

        this.t++;

        requestAnimationFrame(this.draw);
    }
}
