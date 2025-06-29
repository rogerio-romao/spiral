import AL from '../AlgorithmLoader.js';

export default class Quadrants extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.radius = AL.random(5, 250);
    }

    setupDrawingStyles() {
        this.ctx.strokeStyle = this.ctx.fillStyle = AL.randomColor(
            0,
            255,
            0.3,
            0.3
        );
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.stagger = this.stagger % 5;

            if (this.stagger === 0) {
                this.ctx.arc(this.w / 4, this.h / 4, this.radius, 0, 360);
                this.ctx.stroke();
                this.ctx.beginPath();
            }

            if (this.stagger === 1) {
                this.ctx.arc(this.w * 0.75, this.h / 4, this.radius, 0, 360);
                this.ctx.stroke();
                this.ctx.beginPath();
            }

            if (this.stagger === 2) {
                this.ctx.arc(this.w / 4, this.h * 0.75, this.radius, 0, 360);
                this.ctx.stroke();
                this.ctx.beginPath();
            }

            if (this.stagger === 3) {
                this.ctx.arc(this.w * 0.75, this.h * 0.75, this.radius, 0, 360);
                this.ctx.stroke();
                this.ctx.beginPath();
            }

            if (this.stagger === 4) {
                this.ctx.arc(this.w / 2, this.h / 2, this.radius, 0, 360);
                this.ctx.stroke();
                this.ctx.beginPath();
            }

            this.stagger++;
        }

        this.t++;

        if (this.t % (this.speed * 15) === 0) {
            this.radius = AL.random(10, 350);
        }

        if (this.t % (this.speed * 45) === 0) {
            this.setupDrawingStyles();
        }

        if (this.t % (this.speed * 225) === 0) {
            this.ctx.lineWidth = AL.random(1, 40);
            this.ctx.strokeStyle = this.ctx.fillStyle = 'black';
        }

        requestAnimationFrame(this.draw);
    }
}
