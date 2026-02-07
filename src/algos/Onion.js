import AL from '../AlgorithmLoader.js';

export default class Onion extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.name = 'Onion';

        this.initializeBaseProperties();
        this.initializeProperties();
        this.setupConstantStyles();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeBaseProperties() {
        this.angle = AL.random(2, 50);
    }

    initializeProperties() {
        this.x = AL.random(0, this.w);
        this.y = AL.random(0, this.h);
        this.radius = AL.random(45, 500);
    }

    setupConstantStyles() {
        this.ctx.strokeStyle = 'black';
    }

    setupDrawingStyles() {
        this.ctx.fillStyle = AL.randomColor(0, 255, 0.005, 0.015);
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.beginPath();
            this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
            this.ctx.stroke();
            this.ctx.fill();
            this.ctx.closePath();
        }

        this.t++;

        this.rotateCanvasDegrees(this.angle);

        if (this.t % (this.speed * 135) === 0) {
            this.initializeProperties();
            this.setupDrawingStyles();
            this.ctx.beginPath();
        }

        if (this.t % (this.speed * 540) === 0) {
            this.angle = AL.random(2, 50);
        }

        requestAnimationFrame(this.draw);
    }
}
