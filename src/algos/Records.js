import AL from '../AlgorithmLoader.js';

export default class Records extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.name = 'Records';

        this.initializeProperties();
        this.setupConstantStyles();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeProperties() {
        this.angle = 0;
        this.rotate = AL.random(1, 45);
        this.offset = AL.random(50, 330);
        this.angleChange = Math.random() * 7;
        this.radius = AL.random(50, Math.min(this.w, this.h) / 2);
    }

    setupConstantStyles() {
        this.ctx.lineWidth = 2;
    }

    setupDrawingStyles() {
        this.ctx.strokeStyle = this.ctx.fillStyle = AL.randomColor();
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.beginPath();
            this.ctx.arc(
                this.w / 2,
                this.h / 2,
                this.radius,
                0,
                Math.random() * Math.PI,
            );
            this.ctx.stroke();

            this.angle += this.angleChange;
            this.radius = Math.abs(
                this.radius + Math.sin(this.angle) * this.offset,
            );
        }

        this.t += 1;

        this.rotateCanvasRadians(this.rotate);

        if (this.t % (this.speed * 120) === 0) {
            this.initializeProperties();

            this.ctx.beginPath();
            this.ctx.arc(this.w / 2, this.h / 2, this.radius, 0, 2 * Math.PI);
            this.ctx.fill();

            this.setupDrawingStyles();
        }

        this.requestFrame();
    }
}
