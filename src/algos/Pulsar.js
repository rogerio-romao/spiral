import BA from '../BaseAlgorithm.js';

export default class Pulsar extends BA {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.cp1x = BA.random(0, this.w);
        this.cp1y = BA.random(0, this.h);
        this.cp2x = BA.random(0, this.w);
        this.cp2y = BA.random(0, this.h);
        this.x = BA.random(0, this.w);
        this.y = BA.random(0, this.h);
        this.rot1 = BA.random(1, 90);
        this.rot2 = BA.random(1, 90);
        this.pulse1 = BA.random(50, 300);
        this.pulse2 = BA.random(30, 200);
    }

    setupDrawingStyles() {
        this.ctx.lineWidth = 5;
        this.ctx.strokeStyle = this.ctx.shadowColor = BA.randomColor();
        this.ctx.shadowBlur = 2;
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.clearRect(-this.w, -this.h, 3 * this.w, 3 * this.h);

            for (let i = 0; i < 20; i++) {
                this.drawBezier(i * 15);
                this.drawBezier(i * -15);
            }
        }

        this.ctx.translate(this.w / 2, this.h / 2);
        this.ctx.rotate((this.rot1 * Math.PI) / 180);
        this.ctx.translate(-this.w / 2, -this.h / 2);

        if (this.t % (this.speed * 160) === 0) {
            this.cp1x = BA.random(0, this.w);
            this.cp1y = BA.random(0, this.h);
            this.cp2x = BA.random(0, this.w);
            this.cp2y = BA.random(0, this.h);
            this.x = BA.random(0, this.w);
            this.y = BA.random(0, this.h);
            this.rot1 = BA.random(1, 90);
            this.rot2 = BA.random(1, 90);
            this.pulse1 = BA.random(50, 300);
            this.pulse2 = BA.random(30, 200);
            this.ctx.strokeStyle = this.ctx.shadowColor = BA.randomColor();
        }

        this.t++;

        requestAnimationFrame(this.draw);
    }

    drawBezier(rot) {
        this.ctx.beginPath();
        this.ctx.moveTo(
            this.w / 2 + Math.sin(this.t) * this.pulse1,
            this.h / 2 + Math.cos(this.t) * this.pulse2
        );
        this.ctx.translate(this.w / 2, this.h / 2);
        this.ctx.rotate((rot * Math.PI) / 180);
        this.ctx.bezierCurveTo(
            this.cp1x + rot,
            this.cp1y + this.pulse1,
            this.cp2x - rot,
            this.cp2y - this.pulse2,
            this.x,
            this.y
        );
        this.ctx.stroke();
        this.ctx.closePath();
        this.ctx.translate(-this.w / 2, -this.h / 2);
    }
}
