import AL from '../AlgorithmLoader.js';

export default class Sushi extends AL {
    constructor() {
        super();

        this.name = 'Sushi';

        this.initializeProperties();
        this.setupConstantStyles();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeProperties() {
        this.gap = 4;
        this.radius = 40;
        this.rows = Math.round(AL.h / (this.radius + this.gap));
        this.cols = Math.round(AL.w / (this.radius + this.gap));
    }

    setupConstantStyles() {
        AL.ctx.strokeStyle = 'white';
        AL.ctx.globalCompositeOperation = 'difference';
    }

    setupDrawingStyles() {
        AL.ctx.lineWidth = AL.random(3, 17);
        AL.ctx.fillStyle = AL.randomColor();
    }

    draw() {
        if (this.t % this.speed === 0) {
            for (let i = 0; i <= this.rows; i++) {
                for (let j = 0; j <= this.cols; j++) {
                    AL.ctx.beginPath();
                    AL.ctx.arc(
                        100 * j - 50,
                        100 * i - 50,
                        this.radius,
                        Math.random(),
                        Math.random() * 2 * Math.PI,
                    );
                    AL.ctx.stroke();
                    AL.ctx.fill();
                }
            }
        }

        this.t += 1;

        if (this.t % (this.speed * 30) === 0) {
            this.radius = AL.random(10, 46);
            this.setupDrawingStyles();
        }

        this.requestFrame();
    }
}
