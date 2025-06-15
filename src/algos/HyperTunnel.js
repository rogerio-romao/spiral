import AL from '../AlgorithmLoader.js';

export default class HyperTunnel extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.side = AL.random(25, Math.min(this.w, this.h));
        this.rotate = AL.random(95, 175);
    }

    setupDrawingStyles() {
        this.ctx.strokeStyle = AL.randomColor(5, 255, 0.25, 0.25);
        if (this.side > Math.min(this.w, this.h) / 2) {
            this.ctx.fillStyle = AL.randomColor(5, 255, 0.02, 0.02);
        } else {
            this.ctx.fillStyle = AL.randomColor(5, 255, 0.2, 0.2);
        }
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.beginPath();
            this.ctx.moveTo(this.w / 2, this.h / 2);
            this.ctx.lineTo(
                this.w / 2 - this.side / 2,
                this.h / 2 - this.side / 2
            );
            this.ctx.stroke();
            this.ctx.moveTo(this.w / 2, this.h / 2);
            this.ctx.lineTo(
                this.w / 2 + this.side / 2,
                this.h / 2 - this.side / 2
            );
            this.ctx.stroke();
            this.ctx.lineTo(
                this.w / 2 - this.side / 2,
                this.h / 2 - this.side / 2
            );
            this.ctx.stroke();
            this.ctx.fill();

            this.ctx.translate(this.w / 2, this.h / 2);
            this.ctx.rotate((this.rotate * Math.PI) / 180);
            this.ctx.translate(-this.w / 2, -this.h / 2);
        }

        if (this.t % (this.speed * (360 / this.rotate)) === 0) {
            this.side = AL.random(25, Math.min(this.w, this.h));

            this.ctx.strokeStyle = AL.randomColor(5, 255, 0.25, 0.25);
            if (this.side > Math.min(this.w, this.h) / 2) {
                this.ctx.fillStyle = AL.randomColor(5, 255, 0.02, 0.02);
            } else {
                this.ctx.fillStyle = AL.randomColor(5, 255, 0.2, 0.2);
            }
        }

        if (this.t % (this.speed * 75) === 0) {
            this.rotate = AL.random(95, 175);
            this.side = AL.random(25, Math.max(this.w, this.h));

            this.ctx.strokeStyle = AL.randomColor(5, 255, 0.25, 0.25);
            if (this.side > Math.min(this.w, this.h) / 2) {
                this.ctx.fillStyle = AL.randomColor(5, 255, 0.02, 0.02);
            } else {
                this.ctx.fillStyle = AL.randomColor(5, 255, 0.1, 0.1);
            }
        }

        this.t++;

        requestAnimationFrame(this.draw);
    }
}
