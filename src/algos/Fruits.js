import BA from '../BaseAlgorithm.js';

export default class Fruits extends BA {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.row = 0;
        this.col = 0;
        this.cellSizes = [50, 100, 150, 200, 250, 300];
        this.cell = this.cellSizes[BA.random(0, this.cellSizes.length)];
        this.size = BA.random(10, 100);
    }

    setupDrawingStyles() {
        this.ctx.strokeStyle = 'black';
        this.ctx.fillStyle = BA.randomColor(0, 255, 0.1, 0.33);
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.arc(
                this.col * this.cell - this.cell,
                this.row * this.cell - this.cell,
                this.size,
                0,
                2 * Math.PI
            );
            this.ctx.stroke();
            this.ctx.fill();
            this.ctx.beginPath();

            this.col++;
            if (this.col * this.cell - this.cell * 2 > this.w) {
                this.col = 0;
                this.row++;
            }
            if (this.row * this.cell - this.cell * 2 > this.h) {
                this.ctx.beginPath();
                this.col = 0;
                this.row = 0;
                this.cell = this.cellSizes[BA.random(0, this.cellSizes.length)];
                this.size = BA.random(10, 100);
                this.ctx.beginPath();
                this.ctx.fillStyle = BA.randomColor(0, 255, 0.1, 0.33);
            }
        }

        this.t++;

        requestAnimationFrame(this.draw);
    }
}
