import AL from '../AlgorithmLoader.js';

export default class Onion extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.radius = AL.random(45, 500);
        this.x = AL.random(0, this.w);
        this.y = AL.random(0, this.h);
        this.angle = AL.random(2, 50);
    }

    setupDrawingStyles() {
        this.ctx.strokeStyle = 'black';
        this.ctx.fillStyle = AL.randomColor(0, 255, 0.005, 0.015);
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.beginPath();
            this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
            this.ctx.stroke();
            this.ctx.fill();
            this.ctx.closePath();
        }

        this.ctx.translate(this.w / 2, this.h / 2);
        this.ctx.rotate((this.angle / 180) * Math.PI);
        this.ctx.translate(-this.w / 2, -this.h / 2);

        if (this.t % (this.speed * 135) === 0) {
            this.radius = AL.random(50, 500);
            this.x = AL.random(0, this.w);
            this.y = AL.random(0, this.h);

            this.ctx.beginPath();
            this.ctx.fillStyle = AL.randomColor(0, 255, 0.005, 0.015);
        }

        if (this.t % (this.speed * 540) === 0) {
            this.angle = AL.random(2, 50);
        }

        this.t++;

        requestAnimationFrame(this.draw);
    }
}
