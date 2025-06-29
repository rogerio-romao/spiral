import AL from '../AlgorithmLoader.js';

export default class Rims extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.radius = AL.random(30, this.h);
        this.radius2 = AL.random(10, this.radius);
        this.rot = AL.random(1, 6);
        this.startAngle = AL.random(0, 100);
        this.endAngle = AL.random(101, 360);
        this.gap = AL.random(4, 100);
    }

    setupDrawingStyles() {
        this.ctx.fillStyle = AL.randomColor(5, 255, 0.01, 0.01);
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
                    this.rot,
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
                    this.rot,
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
                    -this.rot,
                    this.w / 2,
                    this.h / 2
                );
            }
        }

        this.ctx.fill();
        this.ctx.stroke();

        this.t++;

        this.rotateCanvasRadians(this.rot);

        if (this.t % (this.speed * 150) === 0) {
            this.initializeProperties();
            this.speed = AL.random(1, 10);

            this.ctx.beginPath();
            this.ctx.fillStyle = AL.randomColor(5, 255, 0.01, 0.01);
        }

        requestAnimationFrame(this.draw);
    }
}
