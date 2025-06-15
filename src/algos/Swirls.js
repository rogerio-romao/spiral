import AL from '../AlgorithmLoader.js';

export default class Swirls extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.x1 = AL.random(0, this.w);
        this.y1 = AL.random(0, this.h);
        this.x2 = AL.random(0, this.w);
        this.y2 = AL.random(0, this.h);
        this.x3 = AL.random(0, this.w);
        this.y3 = AL.random(0, this.h);
        this.rotate = AL.random(1, 10);
    }

    setupDrawingStyles() {
        this.ctx.strokeStyle = AL.randomColor(0, 255, 0.5, 0.8);
        this.ctx.lineWidth = 0.4;
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.moveTo(this.x3, this.y3);
            this.ctx.quadraticCurveTo(this.x2, this.y2, this.x1, this.y1);
            this.ctx.stroke();

            this.ctx.translate(this.w / 2, this.h / 2);
            this.ctx.rotate(this.rotate);
            this.ctx.translate(-this.w / 2, -this.h / 2);
        }

        if (this.t % (this.speed * 240) === 0) {
            this.x1 = AL.random(0, this.w);
            this.y1 = AL.random(0, this.h);
            this.x2 = AL.random(0, this.w);
            this.y2 = AL.random(0, this.h);
            this.x3 = AL.random(0, this.w);
            this.y3 = AL.random(0, this.h);

            this.ctx.beginPath();
            this.ctx.strokeStyle = AL.randomColor(0, 255, 0.5, 0.8);
            this.rotate = AL.random(1, 10);
        }

        this.t++;

        requestAnimationFrame(this.draw);
    }
}
