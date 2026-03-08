import AL from '../AlgorithmLoader.js';

export default class Plaid extends AL {
    constructor() {
        super();

        this.name = 'Plaid';

        this.initializeBaseProperties();
        this.initializeProperties();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeBaseProperties() {
        this.rows = Math.ceil(AL.h / 100) + 2;
        this.cols = Math.ceil(AL.w / 100) + 2;
    }

    initializeProperties() {
        this.side1 = AL.random(20, 300);
        this.side2 = AL.random(20, 300);
    }

    setupDrawingStyles() {
        AL.ctx.globalAlpha = 0.3;
        AL.ctx.lineWidth = AL.random(1, 13);
        AL.ctx.globalCompositeOperation = 'source-over';
        AL.ctx.fillStyle = AL.randomColor(10, 255, 0.2, 0.7);
        AL.ctx.strokeStyle = AL.randomColor(10, 255, 0.2, 0.7);
    }

    draw() {
        if (this.t % this.speed === 0) {
            for (let i = 0; i <= this.rows; i++) {
                this.rotateCanvasDegrees(45);

                for (let j = 0; j <= this.cols; j++) {
                    AL.ctx.beginPath();
                    AL.ctx.strokeRect(150 * j - 150, 150 * i - 150, this.side1, this.side2);
                    AL.ctx.fillRect(150 * j - 150, 150 * i - 150, this.side1, this.side2);
                }
            }
        }

        this.t += 1;

        if (this.t % (this.speed * 30) === 0) {
            this.initializeProperties();
            AL.ctx.lineWidth = AL.random(1, 13);
            AL.ctx.globalCompositeOperation = 'overlay';
            AL.ctx.fillStyle = AL.randomColor(10, 255, 0.2, 0.7);
        }

        if (this.t % (this.speed * 60) === 0) {
            AL.ctx.strokeStyle = AL.randomColor(10, 255, 0.2, 0.7);
        }

        if (this.t % (this.speed * 90) === 0) {
            AL.ctx.globalCompositeOperation = 'source-over';
        }

        if (this.t % (this.speed * 150) === 0) {
            AL.ctx.globalCompositeOperation = 'color';
        }

        if (this.t % (this.speed * 240) === 0) {
            AL.ctx.globalCompositeOperation = 'luminosity';
        }

        if (this.t % (this.speed * 570) === 0) {
            AL.ctx.globalCompositeOperation = 'hue';
        }

        this.requestFrame();
    }
}
