import BA from '../BaseAlgorithm.js';

export default class Blur extends BA {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.radius = BA.random(25, Math.max(this.w, this.h) / 2);
        this.angle = 0;
        this.circles = BA.random(8, 25);
        this.size = BA.random(8, 40);
        this.factor = BA.random(3, 20);
        this.rotate = BA.random(1, 71);
        this.speed *= 2;
    }

    setupDrawingStyles() {
        this.ctx.strokeStyle = BA.randomColor(0, 255, 0.5, 1);
        this.ctx.lineWidth = 0.25;
    }

    draw() {
        if (this.t % this.speed === 0) {
            for (let i = 0; i < this.circles * 2; i++) {
                this.angle = (i * Math.PI * 2) / this.circles;
                const x = this.w / 2 + Math.cos(this.angle) * this.radius;
                const y = this.h / 2 + Math.sin(this.angle) * this.radius;

                this.ctx.beginPath();
                this.ctx.arc(x, y, this.size + i * this.factor, 0, 2 * Math.PI);
                this.ctx.stroke();
            }
        }

        this.ctx.translate(this.w / 2, this.h / 2);
        this.ctx.rotate(this.rotate);
        this.ctx.translate(-this.w / 2, -this.h / 2);

        if (this.t % (this.speed * 90) === 0) {
            this.radius = BA.random(25, Math.max(this.w, this.h) / 2);
            this.angle = 0;
            this.size = BA.random(8, 40);
            this.factor = BA.random(3, 20);
            this.rotate = BA.random(1, 71);
            this.circles = BA.random(8, 25);

            this.ctx.strokeStyle = BA.randomColor(0, 255, 0.5, 1);
        }

        if (this.t % (this.speed * 630) === 0) {
            this.ctx.strokeStyle = 'black';
        }

        this.t++;

        requestAnimationFrame(this.draw);
    }
}
