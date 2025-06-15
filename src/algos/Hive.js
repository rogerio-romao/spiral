import AL from '../AlgorithmLoader.js';

export default class Hive extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.rows = AL.random(3, 10);
        this.height = this.h / this.rows;
        this.angles = [9, 10, 12, 16, 20, 30, 36, 45, 60];
        this.rot = this.angles[AL.random(1, this.angles.length)];
    }

    setupDrawingStyles() {
        this.ctx.globalCompositeOperation = 'overlay';
        this.ctx.strokeStyle = AL.randomColor();
        this.ctx.shadowColor = AL.randomColor();
        this.ctx.shadowBlur = 7;
        this.ctx.lineWidth = AL.random(7, 18);
    }

    draw() {
        if (this.t % this.speed === 0) {
            for (let i = 0; i <= this.rows; i++) {
                this.ctx.strokeRect(
                    AL.random(0, this.w),
                    i * this.height,
                    AL.random(0, this.w),
                    this.height
                );
            }
        }

        this.ctx.translate(this.w / 2, this.h / 2);
        this.ctx.rotate((this.rot * Math.PI) / 180);
        this.ctx.translate(-this.w / 2, -this.h / 2);

        if (this.t % (this.speed * 125) === 0) {
            this.rows = AL.random(3, 10);
            this.rot = this.angles[AL.random(1, this.angles.length)];
            this.height = this.h / this.rows;

            this.ctx.strokeStyle = AL.randomColor();
            this.ctx.shadowColor = AL.randomColor();
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
