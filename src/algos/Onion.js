import AL from '../AlgorithmLoader.js';

export default class Onion extends AL {
    constructor() {
        super();

        this.name = 'Onion';

        this.initializeBaseProperties();
        this.initializeProperties();
        this.setupConstantStyles();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeBaseProperties() {
        this.angle = AL.random(2, 50);
    }

    initializeProperties() {
        this.x = AL.random(0, AL.w);
        this.y = AL.random(0, AL.h);
        this.radius = AL.random(45, 500);
    }

    setupConstantStyles() {
        AL.ctx.strokeStyle = 'black';
    }

    setupDrawingStyles() {
        AL.ctx.fillStyle = AL.randomColor(0, 255, 0.005, 0.015);
    }

    draw() {
        if (this.t % this.speed === 0) {
            AL.ctx.beginPath();
            AL.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
            AL.ctx.stroke();
            AL.ctx.fill();
            AL.ctx.closePath();
        }

        this.t += 1;

        this.rotateCanvasDegrees(this.angle);

        if (this.t % (this.speed * 135) === 0) {
            this.initializeProperties();
            this.setupDrawingStyles();
            AL.ctx.beginPath();
        }

        if (this.t % (this.speed * 540) === 0) {
            this.angle = AL.random(2, 50);
        }

        this.requestFrame();
    }
}
