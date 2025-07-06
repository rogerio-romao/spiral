import AL from '../AlgorithmLoader.js';

export default class Discos extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.color1 = AL.randomColor(5, 255, 0.5, 0.5);
        this.color2 = AL.randomColor(5, 255, 0.5, 0.5);
        this.startAngle = AL.random(0, 100);
        this.radius = AL.random(10, this.h);
        this.endAngle = Math.PI;
        this.anti = false;
    }

    setupDrawingStyles() {
        this.ctx.fillStyle = this.color1;
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.stagger = this.stagger % 3;

            if (this.stagger === 0) {
                this.ctx.moveTo(this.w / 2, this.h / 2);
                this.ctx.beginPath();
                this.ctx.strokeStyle = this.color1;
                this.ctx.lineWidth = AL.random(0, 100);
                this.ctx.arc(
                    this.w / 2,
                    this.h / 2,
                    this.radius,
                    this.startAngle,
                    this.endAngle,
                    this.anti
                );
                this.ctx.stroke();
            }

            if (this.stagger === 1) {
                this.ctx.beginPath();
                this.ctx.strokeStyle = this.color2;
                this.anti = !this.anti;
                this.radius = AL.random(0, this.h);
                this.ctx.arc(
                    this.w / 2,
                    this.h / 2,
                    this.radius,
                    this.startAngle,
                    this.endAngle,
                    this.anti
                );
                this.ctx.stroke();
            }

            if (this.stagger === 2) {
                this.ctx.beginPath();
                this.radius = AL.random(0, this.h);
                this.ctx.fillRect(this.w / 2, this.h / 2, this.w, 2);
                this.ctx.stroke();
            }

            this.ctx.closePath();

            this.stagger++;
        }

        this.t++;

        if (this.t % (this.speed * 40) === 0) {
            this.rotateCanvasDegrees(30);
        }

        if (this.t % (this.speed * 200) === 0) {
            this.color1 = this.ctx.fillStyle = AL.randomColor(5, 255, 0.5, 0.5);
            this.color2 = AL.randomColor(5, 255, 0.5, 0.5);
        }

        requestAnimationFrame(this.draw);
    }
}
