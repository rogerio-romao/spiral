import AL from '../AlgorithmLoader.js';

export default class Blur extends AL {
    constructor() {
        super();

        this.name = 'Blur';

        this.initializeBaseProperties();
        this.initializeProperties();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeBaseProperties() {
        this.speed *= 2;
    }

    initializeProperties() {
        this.angle = 0;
        this.size = AL.random(8, 40);
        this.factor = AL.random(3, 20);
        this.rotate = AL.random(1, 71);
        this.circles = AL.random(8, 25);
        this.radius = AL.random(25, Math.max(AL.w, AL.h) / 2);
    }

    setupConstantStyles() {
        AL.ctx.lineWidth = 0.25;
    }

    setupDrawingStyles() {
        AL.ctx.strokeStyle = AL.randomColor(0, 255, 0.5, 1);
    }

    draw() {
        if (this.t % this.speed === 0) {
            for (let i = 0; i < this.circles * 2; i++) {
                this.angle = (i * Math.PI * 2) / this.circles;
                const x = AL.w / 2 + Math.cos(this.angle) * this.radius;
                const y = AL.h / 2 + Math.sin(this.angle) * this.radius;

                AL.ctx.beginPath();
                AL.ctx.arc(x, y, this.size + i * this.factor, 0, 2 * Math.PI);
                AL.ctx.stroke();
            }
        }

        this.rotateCanvasRadians(this.rotate);

        this.t += 1;

        if (this.t % (this.speed * 90) === 0) {
            this.initializeProperties();
            this.setupDrawingStyles();
        }

        if (this.t % (this.speed * 630) === 0) {
            AL.ctx.strokeStyle = 'black';
        }

        this.requestFrame();
    }
}
