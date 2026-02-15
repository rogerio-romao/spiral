import AL from '../AlgorithmLoader.js';

export default class Microscope extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.name = 'Microscope';

        this.initializeBaseProperties();
        this.initializeProperties();
        this.setupConstantStyles();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeBaseProperties() {
        this.rotate = AL.random(1, 20);
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
    }

    initializeProperties() {
        this.radiusX = AL.random(35, 415);
        this.radiusY = AL.random(35, 415);
        this.rows = Math.ceil(this.h / this.radiusY) + 5;
        this.cols = Math.ceil(this.w / this.radiusX) + 5;
    }

    setupConstantStyles() {
        this.ctx.shadowBlur = 6;
    }

    setupDrawingStyles() {
        this.ctx.shadowColor = this.ctx.strokeStyle = AL.randomColor(
            0,
            255,
            0.5,
            0.5
        );
    }

    draw() {
        if (this.t % this.speed === 0) {
            for (let i = 0; i <= this.rows; i++) {
                this.ctx.globalCompositeOperation = AL.pickRandomElement(
                    this.modes
                );

                this.rotateCanvasRadians(this.rotate);

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

        this.t++;

        if (this.t % (this.speed * 50) === 0) {
            this.setupDrawingStyles();
        }

        if (this.t % (this.speed * 100) === 0) {
            this.initializeProperties();
        }

        this.requestFrame();
    }
}
