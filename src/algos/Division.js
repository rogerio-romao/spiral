import AL from '../AlgorithmLoader.js';

export default class Division extends AL {
    constructor() {
        super();

        this.name = 'Division';

        this.initializeProperties();
        this.setupConstantStyles();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeProperties() {
        this.radius = AL.random(25, Math.min(AL.w, AL.h) / 2);
        this.circles = [6, 8, 10, 12, 16, 20, 24, 32, 40, 48];
        this.size = AL.pickRandomElement(this.circles);
        this.angle = 0;
    }

    setupConstantStyles() {
        AL.ctx.shadowColor = 'white';
        AL.ctx.shadowBlur = 7;
    }

    setupDrawingStyles() {
        AL.ctx.strokeStyle = AL.randomColor();
        AL.ctx.shadowColor = 'white';
        AL.ctx.fillStyle = AL.randomColor();
    }

    draw() {
        if (this.t % this.speed === 0) {
            for (let i = 0; i < this.circles.length; i++) {
                this.angle = (i * Math.PI * 2) / this.circles.length;
                const x = AL.w / 2 + Math.cos(this.angle) * this.radius;
                const y = AL.h / 2 + Math.sin(this.angle) * this.radius;

                AL.ctx.beginPath();
                AL.ctx.arc(x, y, this.size, 0, 2 * Math.PI);
                AL.ctx.fill();
                AL.ctx.stroke();
            }
        }

        this.t += 1;

        if (this.t % (this.speed * 40) === 0) {
            this.initializeProperties();
        }

        if (this.t % (this.speed * 400) === 0) {
            this.setupDrawingStyles();
        }

        this.requestFrame();
    }
}
