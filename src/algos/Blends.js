import BA from '../BaseAlgorithm.js';

export default class Blends extends BA {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.x = BA.random(0, this.w);
        this.y = BA.random(0, this.h);
        this.x2 = BA.random(0, this.w);
        this.y2 = BA.random(0, this.h);
        this.length = BA.random(30, 250);
        this.rotation = BA.random(2, 140);
        this.color1 = BA.randomColor(0, 255, 0.025, 0.075);
        this.color2 = BA.randomColor(0, 255, 0.025, 0.075);
        this.currentShape = BA.random(0, 3);
    }

    setupDrawingStyles() {
        this.ctx.lineWidth = 3;
        this.ctx.strokeStyle = BA.randomColor();
    }

    draw() {
        if (this.t % this.speed === 0) {
            if (this.currentShape === 0) {
                this.ctx.fillStyle = this.color2;
                this.ctx.fillRect(this.x++, this.y, this.length++, this.length);
            } else if (this.currentShape === 1) {
                this.ctx.fillStyle = this.color1;
                this.ctx.beginPath();
                this.ctx.arc(this.x2, this.y2++, this.length, 0, 2 * Math.PI);
                this.ctx.fill();
            } else {
                this.ctx.strokeStyle = this.color2;
                this.ctx.beginPath();
                this.ctx.moveTo(this.x, this.y);
                this.ctx.lineTo(this.x2, this.y2);
                this.ctx.stroke();
            }

            this.currentShape++;
            if (this.currentShape > 2) this.currentShape = 0;

            this.ctx.translate(this.w / 2, this.h / 2);
            this.ctx.rotate((this.rotation * Math.PI) / 180);
            this.ctx.translate(-this.w / 2, -this.h / 2);
        }

        if (this.t % (this.speed * 270) === 0) {
            this.rotation = BA.random(2, 140);
            this.x = BA.random(0, this.w);
            this.y = BA.random(0, this.h);
            this.x2 = BA.random(0, this.w);
            this.y2 = BA.random(0, this.h);
            this.length = BA.random(30, 250);

            this.ctx.beginPath();
            this.color1 = BA.randomColor(0, 255, 0.025, 0.075);
            this.color2 = BA.randomColor(0, 255, 0.025, 0.075);
            this.ctx.strokeStyle = BA.randomColor();
        }

        this.t++;

        requestAnimationFrame(this.draw);
    }
}
