import AL from '../AlgorithmLoader.js';

export default class RotationPatterns extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.radiusX = AL.random(10, 250);
        this.radiusY = AL.random(10, 250);
        this.rows = Math.ceil(this.h / this.radiusY) + 5;
        this.cols = Math.ceil(this.w / this.radiusX) + 5;
        this.rotate = (AL.random(1, 50) * Math.PI) / 180;
    }

    setupDrawingStyles() {
        this.ctx.globalAlpha = 0.33;
        this.ctx.strokeStyle = 'black';
        this.ctx.lineWidth = 2;
        this.ctx.fillStyle = AL.randomColor(0, 255, 0.1, 0.5);
    }

    draw() {
        if (this.t % this.speed === 0) {
            for (let i = 0; i <= this.rows; i++) {
                this.ctx.translate(this.w / 2, this.h / 2);
                this.ctx.rotate(this.rotate);
                this.ctx.translate(-this.w / 2, -this.h / 2);

                for (let j = 0; j <= this.cols; j++) {
                    this.ctx.strokeRect(
                        this.radiusX * j,
                        this.radiusY * i,
                        this.radiusX,
                        this.radiusY
                    );
                }
            }
        }

        if (this.t % (this.speed * 15) === 0) {
            this.ctx.strokeStyle = AL.randomColor(0, 255, 0.1, 0.5);
        }

        if (this.t % (this.speed * 45) === 0) {
            this.radiusX = AL.random(10, 250);
            this.radiusY = AL.random(10, 250);
            this.rows = Math.ceil(this.h / this.radiusY) + 5;
            this.cols = Math.ceil(this.w / this.radiusX) + 5;
        }

        if (this.t % (this.speed * 90) === 0) {
            this.ctx.lineWidth = AL.random(2, 9);
        }

        this.t++;

        requestAnimationFrame(this.draw);
    }
}
