import AL from '../AlgorithmLoader.js';

export default class Boxes extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.rows = AL.random(3, 17);
        this.cols = AL.random(3, 17);
        this.width = this.w / this.cols;
        this.height = this.h / this.rows;
        this.angles = [15, 20, 24, 30, 36, 45, 48, 72, 80, 90];
        this.rot = this.angles[AL.random(0, this.angles.length)];
    }

    setupDrawingStyles() {
        this.ctx.strokeStyle = 'black';
        this.ctx.fillStyle = AL.randomColor(0, 255, 0.075, 0.075);
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

        this.t++;

        this.rotateCanvasRadians(this.rot);

        if (this.t % (this.speed * 100) === 0) {
            this.rows = AL.random(3, 17);
            this.cols = AL.random(3, 17);
            this.width = this.w / this.cols;
            this.height = this.h / this.rows;
        }

        if (this.t % (this.speed * 200) === 0) {
            this.rot = this.angles[AL.random(0, this.angles.length)];
        }

        if (this.t % (this.speed * 400) === 0) {
            this.ctx.fillStyle = AL.randomColor(0, 255, 0.075, 0.075);
        }

        requestAnimationFrame(this.draw);
    }
}
