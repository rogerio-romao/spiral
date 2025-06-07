import BA from '../BaseAlgorithm.js';

export default class Maelstrom extends BA {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.cp1 = BA.random(0, this.w);
        this.cp2 = BA.random(0, this.h);
        this.x1 = BA.random(0, this.w);
        this.y1 = BA.random(0, this.h);
        this.angle = BA.random(1, 200);
    }

    setupDrawingStyles() {
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = BA.randomColor(0, 255, 0.7, 1);
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.225)';
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.moveTo(this.w / 2, this.h / 2);
            this.ctx.quadraticCurveTo(this.cp1, this.cp2, this.x1++, this.y1++);
            this.ctx.stroke();

            this.ctx.translate(this.w / 2, this.h / 2);
            this.ctx.rotate((this.angle * Math.PI) / 180);
            this.ctx.translate(-this.w / 2, -this.h / 2);
        }

        if (this.t % (this.speed * 300) === 0) {
            this.cp1 = BA.random(0, this.w);
            this.cp2 = BA.random(0, this.h);
            this.x1 = BA.random(0, this.w);
            this.y1 = BA.random(0, this.h);
            this.angle = BA.random(1, 200);

            this.ctx.fillRect(-this.w, -this.h, 3 * this.w, 3 * this.h);
            this.ctx.beginPath();
            this.ctx.strokeStyle = BA.randomColor(0, 255, 0.7, 1);
        }

        this.t++;

        requestAnimationFrame(this.draw);
    }
}
