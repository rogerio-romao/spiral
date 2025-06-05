import BaseAlgorithm from '../BaseAlgorithm.js';

export default class Rims extends BaseAlgorithm {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.radius = this.random(30, this.h);
        this.radius2 = this.random(10, this.radius);
        this.rot1 = this.random(1, 6);
        this.startAngle = this.random(0, 100);
        this.endAngle = this.random(101, 360);
        this.gap = this.random(4, 100);
    }

    setupDrawingStyles() {
        this.ctx.fillStyle = this.randomColor(5, 255, 0.01, 0.01);
        this.ctx.strokeStyle = ' black';
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.stagger = this.stagger % 3;

            if (this.stagger === 0) {
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

            if (this.stagger === 1) {
                this.ctx.ellipse(
                    this.w / 2,
                    this.h / 2,
                    this.radius2,
                    this.radius,
                    this.rot1,
                    this.startAngle + this.gap,
                    this.endAngle + this.gap
                );
            }

            if (this.stagger === 2) {
                this.ctx.ellipse(
                    this.startAngle + this.gap,
                    this.endAngle + this.gap,
                    this.radius,
                    this.radius2,
                    -this.rot1,
                    this.w / 2,
                    this.h / 2
                );
            }
        }

        this.ctx.fill();
        this.ctx.stroke();

        this.ctx.translate(this.w / 2, this.h / 2);
        this.ctx.rotate(this.rot1);
        this.ctx.translate(-this.w / 2, -this.h / 2);

        if (this.t % (this.speed * 150) === 0) {
            this.ctx.beginPath();
            this.ctx.fillStyle = this.randomColor(5, 255, 0.01, 0.01);
            this.radius = this.random(10, this.w);
            this.radius2 = this.random(10, this.h);
            this.startAngle = this.random(0, 50);
            this.endAngle = this.random(51, 360);
            this.gap = this.random(2, this.w / 4);
            this.speed = this.random(1, 10);
        }

        this.t++;

        requestAnimationFrame(this.draw);
    }
}
