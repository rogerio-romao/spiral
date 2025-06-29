import AL from '../AlgorithmLoader.js';

export default class Records extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.offset = AL.random(50, 330);
        this.angleChange = Math.random() * 7;
        this.angle = 0;
        this.radius = AL.random(50, Math.min(this.w, this.h) / 2);
        this.rotate = AL.random(1, 45);
    }

    setupDrawingStyles() {
        this.ctx.strokeStyle = this.ctx.fillStyle = AL.randomColor();
        this.ctx.lineWidth = 2;
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.beginPath();
            this.ctx.arc(
                this.w / 2,
                this.h / 2,
                this.radius,
                0,
                Math.random() * Math.PI
            );
            this.ctx.stroke();

            this.angle += this.angleChange;
            this.radius = Math.abs(
                this.radius + Math.sin(this.angle) * this.offset
            );
        }

        this.t++;

        this.rotateCanvasRadians(this.rotate);

        if (this.t % (this.speed * 120) === 0) {
            this.initializeProperties();

            this.ctx.beginPath();
            this.ctx.arc(this.w / 2, this.h / 2, this.radius, 0, 2 * Math.PI);
            this.ctx.fill();
            this.ctx.strokeStyle = this.ctx.fillStyle = AL.randomColor();
        }

        requestAnimationFrame(this.draw);
    }
}
