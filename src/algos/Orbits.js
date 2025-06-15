import AL from '../AlgorithmLoader.js';

export default class Orbits extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.radius = AL.random(30, this.h);
        this.radius2 = AL.random(10, this.radius);
        this.rot1 = AL.random(1, 6);
        this.startAngle = AL.random(0, 100);
        this.endAngle = AL.random(101, 360);
    }

    setupDrawingStyles() {
        this.ctx.strokeStyle = AL.randomColor(5, 255, 0.2, 0.2);
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
            this.ctx.strokeStyle = AL.randomColor(5, 255, 0.2, 0.2);
            this.radius = AL.random(30, this.h);
            this.radius2 = AL.random(10, this.radius);
            this.startAngle = AL.random(0, 50);
            this.rot1 = AL.random(-3, 3);
        }

        this.t++;

        requestAnimationFrame(this.draw);
    }
}
