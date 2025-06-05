import BA from '../BaseAlgorithm.js';

export default class Microscope extends BA {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.radiusX = BA.random(35, 415);
        this.radiusY = BA.random(35, 415);
        this.rows = Math.ceil(this.h / this.radiusY) + 5;
        this.cols = Math.ceil(this.w / this.radiusX) + 5;
        this.rotate = BA.random(1, 20);
    }

    setupDrawingStyles() {
        this.modes = [
            'xor',
            'difference',
            'hard-light',
            'color-burn',
            'color-dodge',
            'lighten',
            'darken',
            'overlay',
            'source-atop',
            'soft-light',
            'source-over',
            'luminosity',
            'exclusion',
        ];
        this.ctx.shadowColor = this.ctx.strokeStyle = BA.randomColor(
            0,
            255,
            0.5,
            0.5
        );
        this.ctx.shadowBlur = 6;
    }

    draw() {
        if (this.t % this.speed === 0) {
            for (let i = 0; i <= this.rows; i++) {
                this.ctx.globalCompositeOperation =
                    this.modes[BA.random(0, this.modes.length)];

                this.ctx.translate(this.w / 2, this.h / 2);
                this.ctx.rotate(this.rotate);
                this.ctx.translate(-this.w / 2, -this.h / 2);

                for (let j = 0; j <= this.cols; j++) {
                    this.ctx.beginPath();
                    this.ctx.ellipse(
                        this.radiusX * j,
                        this.radiusY * i,
                        this.radiusX,
                        this.radiusY,
                        0,
                        2 * Math.PI,
                        false
                    );
                    this.ctx.stroke();
                }
            }
        }

        if (this.t % (this.speed * 50) === 0) {
            this.ctx.shadowColor = this.ctx.strokeStyle = BA.randomColor(
                0,
                255,
                0.5,
                0.5
            );
        }

        if (this.t % (this.speed * 100) === 0) {
            this.radiusX = BA.random(35, 415);
            this.radiusY = BA.random(35, 415);
            this.rows = Math.ceil(this.h / this.radiusY) + 5;
            this.cols = Math.ceil(this.w / this.radiusX) + 5;
        }

        this.t++;

        requestAnimationFrame(this.draw);
    }
}
