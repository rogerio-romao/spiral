import AL from '../AlgorithmLoader.js';

export default class Picnic extends AL {
    constructor() {
        super();

        this.name = 'Picnic';

        this.initializeBaseProperties();
        this.initializeProperties();
        this.setupConstantStyles();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeBaseProperties() {
        this.rows = Math.ceil(AL.h / 150) + 2;
        this.cols = Math.ceil(AL.w / 150) + 2;
    }

    initializeProperties() {
        this.radius = AL.random(10, 450);
    }

    setupConstantStyles() {
        AL.ctx.globalCompositeOperation = 'source-over';
    }

    setupDrawingStyles() {
        AL.ctx.lineWidth = AL.random(1, 25);
        AL.ctx.strokeStyle = AL.randomColor(10, 255, 0.2, 0.5);
    }

    draw() {
        if (this.t % this.speed === 0) {
            for (let i = 0; i <= this.rows; i++) {
                for (let j = 0; j <= this.cols; j++) {
                    AL.ctx.beginPath();
                    AL.ctx.arc(225 * j - 225, 225 * i - 225, this.radius, 0, 2 * Math.PI);
                    AL.ctx.stroke();
                }
            }
        }

        this.t += 1;

        if (this.t % (this.speed * 30) === 0) {
            this.initializeProperties();
            this.setupDrawingStyles();
            AL.ctx.globalCompositeOperation = 'source-over';
        }

        if (this.t * (this.speed * 90) === 0) {
            AL.ctx.globalCompositeOperation = 'overlay';
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
