import BA from '../BaseAlgorithm.js';

export default class Slices extends BA {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.offsetX = BA.random(50, this.w / 2);
        this.offsetY = BA.random(50, this.h / 2);
        this.angleChange = Math.random() * 2 - 1;
        this.angle = 0;
        this.slice = Math.random();
        this.radius = BA.random(70, 220);
        this.rotate = BA.random(2, 90);
    }

    setupDrawingStyles() {
        this.ctx.strokeStyle = 'black';
        this.ctx.fillStyle = BA.randomColor(30, 255, 0.3, 0.9);
    }

    draw() {
        if (this.t % this.speed === 0) {
            const x = this.w / 2 + Math.sin(this.angle) * this.offsetX;
            const y = this.h / 2 + Math.cos(this.angle) * this.offsetY;
            this.angle += this.angleChange;

            this.ctx.beginPath();
            this.ctx.arc(x, y, this.radius, 0, this.slice * Math.PI);
            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.stroke();
        }

        this.ctx.translate(this.w / 2, this.h / 2);
        this.ctx.rotate((this.rotate * Math.PI) / 180);
        this.ctx.translate(-this.w / 2, -this.h / 2);

        if (this.t % (this.speed * 360) === 0) {
            this.offsetX = BA.random(50, this.w / 2);
            this.offsetY = BA.random(50, this.h / 2);
            this.angleChange = Math.random() * 2 - 1;
            this.slice = Math.random();
            this.angle = 0;
            this.radius = BA.random(70, 220);
            this.rotate = BA.random(1, 90);

            this.ctx.fillStyle = BA.randomColor(0, 255, 0.2, 0.9);
        }

        this.t++;

        requestAnimationFrame(this.draw);
    }
}
