import BA from '../BaseAlgorithm.js';

export default class Thread extends BA {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.offset = BA.random(30, this.h * 0.75);
        this.angle = 0;
        this.radius = BA.random(25, 350);
        this.rotate = BA.random(1, 35);
    }

    setupDrawingStyles() {
        this.ctx.strokeStyle = BA.randomColor();
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    }

    draw() {
        if (this.t % this.speed === 0) {
            let y = this.h / 2 + Math.sin(this.angle) * this.offset;
            this.angle += this.speed;

            this.ctx.beginPath();
            this.ctx.arc(this.w / 2, y, this.radius, 0, 2 * Math.PI);
            this.ctx.stroke();
        }

        this.ctx.translate(this.w / 2, this.h / 2);
        this.ctx.rotate(this.rotate);
        this.ctx.translate(-this.w / 2, -this.h / 2);

        if (this.t % (this.speed * 450) === 0) {
            this.angle = 0;
            this.rotate = BA.random(1, 35);
            this.radius = BA.random(25, 350);
            this.offset = BA.random(30, this.h * 0.75);

            this.ctx.fillRect(-this.w, -this.h, 3 * this.w, 3 * this.h);
            this.ctx.strokeStyle = BA.randomColor(20, 255, 0.15, 1);
        }

        this.t++;

        requestAnimationFrame(this.draw);
    }
}
