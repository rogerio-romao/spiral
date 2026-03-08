import AL from '../AlgorithmLoader.js';

export default class Fruits extends AL {
    constructor() {
        super();

        this.name = 'Fruits';

        this.initializeBaseProperties();
        this.initializeProperties();
        this.setupConstantStyles();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeBaseProperties() {
        this.cellSizes = [100, 150, 200, 250, 300];
    }

    initializeProperties() {
        this.row = 0;
        this.col = 0;
        this.size = AL.random(10, 100);
        this.cell = AL.pickRandomElement(this.cellSizes);
    }

    setupConstantStyles() {
        AL.ctx.strokeStyle = 'black';
    }

    setupDrawingStyles() {
        AL.ctx.fillStyle = AL.randomColor(0, 255, 0.1, 0.33);
    }

    draw() {
        if (this.t % this.speed === 0) {
            AL.ctx.arc(
                this.col * this.cell - this.cell,
                this.row * this.cell - this.cell,
                this.size,
                0,
                2 * Math.PI,
            );
            AL.ctx.stroke();
            AL.ctx.fill();
            AL.ctx.beginPath();

            this.col += 1;
            if (this.col * this.cell - this.cell * 2 > AL.w) {
                this.col = 0;
                this.row += 1;
            }
            if (this.row * this.cell - this.cell * 2 > AL.h) {
                this.initializeProperties();
                this.setupDrawingStyles();
                AL.ctx.beginPath();
            }
        }

        this.t += 1;

        this.requestFrame();
    }
}
