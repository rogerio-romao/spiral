import AL from '../AlgorithmLoader.js';

export default class DysonSpheres extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.length = AL.random(60, Math.max(this.h / 2, this.h - 60));
        this.height = AL.random(20, this.h / 2 - 40);
        this.rotate = AL.random(1, 6);
    }

    setupDrawingStyles() {
        this.ctx.shadowBlur = 11;
        this.ctx.shadowOffsetX = 1;
        this.ctx.shadowOffsetY = 1;
        this.ctx.shadowColor = this.ctx.strokeStyle = AL.randomColor(
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
                this.rotate,
                0,
                0
            );
            this.ctx.stroke();
        }

        this.t++;

        if (this.t % (this.speed * 170) === 0) {
            this.ctx.beginPath();

            const color = Math.random();
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
                this.ctx.shadowColor = this.ctx.strokeStyle = AL.randomColor(
                    5,
                    255,
                    0.33,
                    0.33
                );
            }

            this.length = AL.random(60, Math.max(this.h / 2, this.h - 60));
            this.height = AL.random(20, this.h / 2 - 40);
        }

        this.rotate = AL.random(0, 360);

        requestAnimationFrame(this.draw);
    }
}
