import BA from '../BaseAlgorithm.js';

export default class Vortrix extends BA {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.x = BA.random(0, this.w);
        this.y = BA.random(0, this.h);
        this.size = BA.random(60, 400);
        this.rot = BA.random(1, 60);
    }

    setupDrawingStyles() {
        this.ctx.strokeStyle = this.ctx.shadowColor = BA.randomColor(
            0,
            255,
            0.5,
            1
        );
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
        this.ctx.shadowBlur = 10;
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.drawTriangle(this.x, this.y);
            this.size--;
        }

        this.ctx.translate(this.w / 2, this.h / 2);
        this.ctx.rotate(this.rot);
        this.ctx.translate(-this.w / 2, -this.h / 2);

        if (this.t % (this.speed * 360) === 0) {
            this.x = BA.random(0, this.w);
            this.y = BA.random(0, this.h);
            this.size = BA.random(60, 400);
            this.rot = BA.random(1, 60);

            this.ctx.strokeStyle = this.ctx.shadowColor = BA.randomColor(
                0,
                255,
                0.5,
                1
            );
        }

        this.t++;

        requestAnimationFrame(this.draw);
    }

    drawTriangle(x, y) {
        this.ctx.moveTo(x, y);
        this.ctx.beginPath();
        this.ctx.lineTo(x + this.size, y);
        this.ctx.lineTo(x, y + this.size);
        this.ctx.lineTo(x, y);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
    }
}
