import BA from '../BaseAlgorithm.js';

export default class Boxes extends BA {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.rows = BA.random(3, 17);
        this.height = this.h / this.rows;
        this.cols = BA.random(3, 17);
        this.width = this.w / this.cols;
        this.angles = [15, 20, 24, 30, 36, 45, 48, 72, 80, 90];
        this.rot = this.angles[BA.random(0, this.angles.length)];
    }

    setupDrawingStyles() {
        this.ctx.strokeStyle = 'black';
        this.ctx.fillStyle = BA.randomColor(0, 255, 0.075, 0.075);
    }

    draw() {
        if (this.t % this.speed === 0) {
            for (let i = 0; i <= this.rows; i++) {
                this.ctx.fillRect(
                    i * this.width,
                    i * this.height,
                    this.width / 2,
                    this.height / 2
                );
                this.ctx.strokeRect(
                    i * this.width,
                    i * this.height,
                    this.width / 2,
                    this.height / 2
                );
            }
        }

        this.ctx.translate(this.w / 2, this.h / 2);
        this.ctx.rotate((this.rot * Math.PI) / 180);
        this.ctx.translate(-this.w / 2, -this.h / 2);

        if (this.t % (this.speed * 100) === 0) {
            this.cols = BA.random(3, 17);
            this.width = this.w / this.cols;
            this.rows = BA.random(3, 17);
            this.height = this.h / this.rows;
        }

        if (this.t % (this.speed * 200) === 0) {
            this.rot = this.angles[BA.random(0, this.angles.length)];
        }

        if (this.t % (this.speed * 400) === 0) {
            this.ctx.fillStyle = BA.randomColor(0, 255, 0.075, 0.075);
        }

        this.t++;

        requestAnimationFrame(this.draw);
    }
}
