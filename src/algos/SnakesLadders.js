import AL from '../AlgorithmLoader.js';

export default class SnakesLadders extends AL {
    constructor() {
        super();

        this.name = 'Snakes n Ladders';

        this.initializeBaseProperties();
        this.initializeProperties();
        this.setupConstantStyles();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeBaseProperties() {
        this.currCol = 0;
        this.currRow = 0;
    }

    initializeProperties() {
        this.div = AL.random(3, 17);
        this.div2 = AL.random(3, 17);
        this.rotate = AL.random(1, 83);
        this.colSize = AL.w / this.div;
        this.rowSize = AL.h / this.div2;
    }

    setupConstantStyles() {
        AL.ctx.shadowBlur = 3;
    }

    setupDrawingStyles() {
        AL.ctx.fillStyle = AL.randomColor(0, 255, 0.12, 0.37);
        AL.ctx.strokeStyle = AL.ctx.shadowColor = AL.randomColor(0, 255, 0.65, 1);
    }

    draw() {
        if (this.t % this.speed === 0) {
            AL.ctx.strokeRect(
                this.colSize * this.currCol,
                this.rowSize * this.currRow,
                this.colSize,
                this.rowSize,
            );

            this.currCol += 1;

            if (this.currCol > this.div - 1) {
                this.currCol = 0;

                this.rotateCanvasRadians(this.rotate);

                this.currRow += 1;
                if (this.currRow > this.div2 - 1) {
                    this.currRow = 0;
                }
            }
        }

        this.t += 1;

        if (this.t % (this.speed * 720) === 0) {
            this.initializeProperties();
            this.fillScreen();
            this.setupDrawingStyles();
            AL.ctx.beginPath();
        }

        this.requestFrame();
    }
}
