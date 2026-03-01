import AL from '../AlgorithmLoader.js';

export default class Division extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.name = 'Division';

        this.initializeProperties();
        this.setupConstantStyles();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeProperties() {
        this.radius = AL.random(25, Math.min(this.w, this.h) / 2);
        this.circles = AL.random(5, 30);
        this.size = AL.random(3, 24);
        this.angle = 0;
    }

    setupConstantStyles() {
        this.ctx.shadowColor = 'white';
        this.ctx.shadowBlur = 7;
    }

    setupDrawingStyles() {
        this.ctx.strokeStyle = AL.randomColor();
        this.ctx.shadowColor = 'white';
        this.ctx.fillStyle = AL.randomColor();
    }

    draw() {
        if (this.t % this.speed === 0) {
            for (let i = 0; i < this.circles; i++) {
                this.angle = (i * Math.PI * 2) / this.circles;
                const x = this.w / 2 + Math.cos(this.angle) * this.radius;
                const y = this.h / 2 + Math.sin(this.angle) * this.radius;

                this.ctx.beginPath();
                this.ctx.arc(x, y, this.size, 0, 2 * Math.PI);
                this.ctx.fill();
                this.ctx.stroke();
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
