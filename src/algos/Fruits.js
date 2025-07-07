import AL from '../AlgorithmLoader.js';

export default class Fruits extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeBaseProperties();
        this.initializeProperties();
        this.setupConstantStyles();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeBaseProperties() {
        this.cellSizes = [50, 100, 150, 200, 250, 300];
    }

    initializeProperties() {
        this.row = 0;
        this.col = 0;
        this.size = AL.random(10, 100);
        this.cell = AL.pickRandomElement(this.cellSizes);
    }

    setupConstantStyles() {
        this.ctx.strokeStyle = 'black';
    }

    setupDrawingStyles() {
        this.ctx.fillStyle = AL.randomColor(0, 255, 0.1, 0.33);
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
                this.initializeProperties();
                this.setupDrawingStyles();
                this.ctx.beginPath();
            }
        }

        this.t++;

        requestAnimationFrame(this.draw);
    }
}
