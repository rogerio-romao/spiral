import AL from '../AlgorithmLoader.js';

export default class Blur extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeBaseProperties();
        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeBaseProperties() {
        this.speed *= 2;
    }

    initializeProperties() {
        this.radius = AL.random(25, Math.max(this.w, this.h) / 2);
        this.angle = 0;
        this.circles = AL.random(8, 25);
        this.size = AL.random(8, 40);
        this.factor = AL.random(3, 20);
        this.rotate = AL.random(1, 71);
    }

    setupConstantStyles() {
        this.ctx.lineWidth = 0.25;
    }

    setupDrawingStyles() {
        this.ctx.strokeStyle = AL.randomColor(0, 255, 0.5, 1);
    }

    draw() {
        if (this.t % this.speed === 0) {
            for (let i = 0; i < this.circles * 2; i++) {
                this.angle = (i * Math.PI * 2) / this.circles;
                const x = this.w / 2 + Math.cos(this.angle) * this.radius;
                const y = this.h / 2 + Math.sin(this.angle) * this.radius;

                this.ctx.beginPath();
                this.ctx.arc(x, y, this.size + i * this.factor, 0, 2 * Math.PI);
                this.ctx.stroke();
            }
        }

        this.rotateCanvasRadians(this.rotate);

        this.t++;

        if (this.t % (this.speed * 90) === 0) {
            this.initializeProperties();
            this.setupDrawingStyles();
        }

        if (this.t % (this.speed * 630) === 0) {
            this.ctx.strokeStyle = 'black';
        }

        requestAnimationFrame(this.draw);
    }
}
