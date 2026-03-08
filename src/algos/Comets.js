import AL from '../AlgorithmLoader.js';

export default class Comets extends AL {
    constructor() {
        super();

        this.name = 'Comets';

        this.initializeBaseProperties();
        this.initializeProperties();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeBaseProperties() {
        this.speed = 1;
    }

    initializeProperties() {
        this.change = 0;
        this.rate = AL.random(1, 7);
        this.rotate = AL.random(3, 13);
    }

    setupDrawingStyles() {
        AL.ctx.beginPath();
        AL.ctx.lineWidth = AL.random(3, 12);
        AL.ctx.shadowBlur = AL.ctx.lineWidth;
        AL.ctx.shadowColor = AL.ctx.strokeStyle = AL.randomColor();
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.stagger %= 4;

            if (this.stagger === 0) {
                AL.ctx.lineTo(AL.w / 2 + this.change, AL.h / 2);
            }

            if (this.stagger === 1) {
                AL.ctx.stroke();
            }

            if (this.stagger === 2) {
                this.change += this.rate;
                this.rotateCanvasDegrees(this.rotate);
            }
        }

        this.t += 1;

        this.stagger += 1;

        if (this.t % (this.speed * 1024) === 0) {
            this.initializeProperties();
            this.setupDrawingStyles();
        }

        this.requestFrame();
    }
}
