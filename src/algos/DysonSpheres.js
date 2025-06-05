import BaseAlgorithm from '../BaseAlgorithm.js';

export default class DysonSpheres extends BaseAlgorithm {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.length = this.random(60, Math.max(this.h / 2, this.h - 60));
        this.height = this.random(20, this.h / 2 - 40);
        this.rot1 = this.random(1, 6);
    }

    setupDrawingStyles() {
        this.ctx.shadowBlur = 11;
        this.ctx.shadowOffsetX = 1;
        this.ctx.shadowOffsetY = 1;
        this.ctx.shadowColor = this.ctx.strokeStyle = this.randomColor(
            5,
            255,
            0.33,
            0.33
        );
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.ellipse(
                this.w / 2,
                this.h / 2,
                this.length,
                this.height,
                this.rot1,
                0,
                0
            );
            this.ctx.stroke();
        }

        if (this.t % (this.speed * 170) === 0) {
            this.ctx.beginPath();

            let color = Math.random();
            if (color < 0.2) {
                this.ctx.shadowBlur = 1;
                this.ctx.shadowOffsetX = 0;
                this.ctx.shadowOffsetY = 0;
                this.ctx.shadowColor = this.ctx.strokeStyle = 'black';
            } else if (color < 0.4) {
                this.ctx.shadowBlur = 1;
                this.ctx.shadowOffsetX = 0;
                this.ctx.shadowOffsetY = 0;
                this.ctx.shadowColor = this.ctx.strokeStyle = 'white';
            } else {
                this.ctx.shadowBlur = 11;
                this.ctx.shadowColor = this.ctx.strokeStyle = this.randomColor(
                    5,
                    255,
                    0.33,
                    0.33
                );
            }

            this.length = this.random(60, Math.max(this.h / 2, this.h - 60));
            this.height = this.random(20, this.h / 2 - 40);
        }

        this.rot1 = this.random(0, 360);

        this.t++;

        requestAnimationFrame(this.draw);
    }
}
