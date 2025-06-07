import BA from '../BaseAlgorithm.js';

export default class Offsets extends BA {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.length = BA.random(20, Math.max(this.w, this.h));
        this.rotate = BA.random(7, 27);
    }

    setupDrawingStyles() {
        this.ctx.shadowColor = BA.randomColor();
        this.ctx.shadowOffsetX = BA.random(-200, 200);
        this.ctx.shadowOffsetY = BA.random(-200, 200);
        this.ctx.shadowBlur = 3;
        this.ctx.fillStyle = BA.randomColor();
        this.ctx.strokeStyle = BA.randomColor(0, 255, 0.1, 0.1);
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.stagger = this.stagger % 2;

            if (this.stagger === 0) {
                this.ctx.lineTo(this.w / 2 - this.length, this.h / 2);
                this.ctx.stroke();
            }

            if (this.stagger === 1) {
                this.ctx.lineTo(this.w / 2, this.h / 2 - this.length);
                this.ctx.stroke();
            }

            this.ctx.translate(this.w / 2, this.h / 2);
            this.ctx.rotate(this.rotate);
            this.ctx.translate(-this.w / 2, -this.h / 2);

            this.stagger++;
        }

        if (this.t % (this.speed * 40) === 0) {
            this.ctx.fill();
            this.ctx.beginPath();
            this.ctx.fillStyle = BA.randomColor();
            this.length = BA.random(20, Math.max(this.w, this.h));
        }

        if (this.t % (this.speed * 200) === 0) {
            this.ctx.shadowColor = BA.randomColor();
            this.ctx.shadowOffsetX = BA.random(-200, 200);
            this.ctx.shadowOffsetY = BA.random(-200, 200);
        }

        if (this.t % (this.speed * 400) === 0) {
            this.ctx.strokeStyle = BA.randomColor(0, 255, 0.1, 0.1);
            this.rotate = BA.random(1, 37);
        }

        this.t++;

        requestAnimationFrame(this.draw);
    }
}
