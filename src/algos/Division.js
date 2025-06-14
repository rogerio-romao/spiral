import BA from '../BaseAlgorithm.js';

export default class Division extends BA {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.radius = BA.random(25, Math.min(this.w, this.h) / 2);
        this.angle = 0;
        this.circles = BA.random(5, 30);
        this.size = BA.random(3, 24);
    }

    setupDrawingStyles() {
        this.ctx.strokeStyle = BA.randomColor();
        this.ctx.shadowColor = 'white';
        this.ctx.fillStyle = BA.randomColor();
        this.ctx.shadowBlur = 7;
    }

    draw() {
        if (this.t % this.speed === 0) {
            for (let i = 0; i < this.circles; i++) {
                this.angle = (i * Math.PI * 2) / this.circles;
                const x = this.w / 2 + Math.cos(this.angle) * this.radius;
                const y = this.h / 2 + Math.sin(this.angle) * this.radius;

                this.ctx.beginPath();
                this.ctx.arc(x, y, this.size, 0, 2 * Math.PI);
                this.ctx.fill();
                this.ctx.stroke();
            }
        }

        if (this.t % (this.speed * 40) === 0) {
            this.radius = BA.random(25, Math.min(this.w, this.h) / 2);
            this.angle = 0;
            this.circles = BA.random(5, 30);
            this.size = BA.random(3, 24);
        }

        if (this.t % (this.speed * 400) === 0) {
            this.ctx.strokeStyle = BA.randomColor();
            this.ctx.fillStyle = BA.randomColor();
        }

        this.t++;

        requestAnimationFrame(this.draw);
    }
}
