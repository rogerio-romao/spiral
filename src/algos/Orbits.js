import BA from '../BaseAlgorithm.js';

export default class Orbits extends BA {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.radius = BA.random(30, this.h);
        this.radius2 = BA.random(10, this.radius);
        this.rot1 = BA.random(1, 6);
        this.startAngle = BA.random(0, 100);
        this.endAngle = BA.random(101, 360);
    }

    setupDrawingStyles() {
        this.ctx.strokeStyle = BA.randomColor(5, 255, 0.2, 0.2);
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.ellipse(
                this.w / 2,
                this.h / 2,
                this.radius,
                this.radius2,
                this.rot1,
                this.startAngle,
                this.endAngle
            );
        }
        this.ctx.stroke();

        this.ctx.translate(this.w / 2, this.h / 2);
        this.ctx.rotate(this.rot1);
        this.ctx.translate(-this.w / 2, -this.h / 2);

        if (this.t % (this.speed * 150) === 0) {
            this.ctx.beginPath();
            this.ctx.strokeStyle = BA.randomColor(5, 255, 0.2, 0.2);
            this.radius = BA.random(30, this.h);
            this.radius2 = BA.random(10, this.radius);
            this.startAngle = BA.random(0, 50);
            this.rot1 = BA.random(-3, 3);
        }

        this.t++;

        requestAnimationFrame(this.draw);
    }
}
