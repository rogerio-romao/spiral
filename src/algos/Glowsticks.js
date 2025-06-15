import AL from '../AlgorithmLoader.js';

export default class Glowsticks extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.dist = AL.random(10, 100);
        this.x = AL.random(0, this.w - this.dist);
        this.y = AL.random(this.dist, this.h);
        this.rot = AL.random(1, 200);
    }

    setupDrawingStyles() {
        this.ctx.strokeStyle = this.ctx.shadowColor = AL.randomColor();
        this.ctx.shadowBlur = 5;
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.moveTo(this.x++, this.y++);
            this.ctx.lineTo(this.x + this.dist, this.y - this.dist);
            this.ctx.stroke();

            if (this.x > this.w) this.x = 0;
            if (this.x < 0) this.x = this.w - this.dist;
            if (this.y > this.h) this.y = this.dist;
            if (this.y < 0) this.x = this.h;
        }

        if (this.t % (this.speed * 900) === 0) {
            this.initializeProperties();

            this.ctx.beginPath();
            this.ctx.clearRect(-this.w, -this.h, 3 * this.w, 3 * this.h);
            this.ctx.strokeStyle = this.ctx.shadowColor = AL.randomColor();
        }

        this.ctx.translate(this.w / 2, this.h / 2);
        this.ctx.rotate(this.rot);
        this.ctx.translate(-this.w / 2, -this.h / 2);

        this.t++;

        requestAnimationFrame(this.draw);
    }
}
