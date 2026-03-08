import AL from '../AlgorithmLoader.js';

export default class RotationPatterns extends AL {
    constructor() {
        super();

        this.name = 'Rotation Patterns';

        this.initializeBaseProperties();
        this.initializeProperties();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeBaseProperties() {
        this.rotate = AL.random(1, 50);
    }

    initializeProperties() {
        this.radiusX = AL.random(10, 250);
        this.radiusY = AL.random(10, 250);
        this.rows = Math.ceil(AL.h / this.radiusY) + 5;
        this.cols = Math.ceil(AL.w / this.radiusX) + 5;
    }

    setupDrawingStyles() {
        AL.ctx.lineWidth = 2;
        AL.ctx.globalAlpha = 0.33;
        AL.ctx.strokeStyle = 'black';
        AL.ctx.fillStyle = AL.randomColor(0, 255, 0.1, 0.5);
    }

    draw() {
        if (this.t % this.speed === 0) {
            for (let i = 0; i <= this.rows; i++) {
                this.rotateCanvasDegrees(this.rotate);

                for (let j = 0; j <= this.cols; j++) {
                    AL.ctx.strokeRect(
                        this.radiusX * j,
                        this.radiusY * i,
                        this.radiusX,
                        this.radiusY,
                    );
                }
            }
        }

        this.t += 1;

        if (this.t % (this.speed * 15) === 0) {
            AL.ctx.strokeStyle = AL.randomColor(0, 255, 0.1, 0.5);
        }

        if (this.t % (this.speed * 45) === 0) {
            this.initializeProperties();
        }

        if (this.t % (this.speed * 90) === 0) {
            AL.ctx.lineWidth = AL.random(2, 9);
        }

        this.requestFrame();
    }
}
