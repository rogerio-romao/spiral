import BA from '../BaseAlgorithm.js';

export default class FadeIn extends BA {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.x1 = BA.random(0, this.w);
        this.y1 = BA.random(0, this.h);
        this.c1 = BA.random(-2, 2);
        this.c2 = BA.random(-2, 2);
        this.x2 = BA.random(0, this.w);
        this.y2 = BA.random(0, this.h);
        this.c3 = BA.random(-2, 2);
        this.c4 = BA.random(-2, 2);
        this.ox = BA.random(0, this.w);
        this.oy = BA.random(0, this.h);
        this.c5 = BA.random(-2, 2);
        this.c6 = BA.random(-2, 2);
        this.dx = BA.random(0, this.w);
        this.dy = BA.random(0, this.h);
        this.c7 = BA.random(-2, 2);
        this.c8 = BA.random(-2, 2);
        this.rotate = BA.random(1, 359);
    }

    setupDrawingStyles() {
        this.ctx.strokeStyle = BA.randomColor();
        this.ctx.lineWidth = 0.2;
        this.ctx.globalAlpha = 0.15;
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.moveTo(this.ox, this.oy);
            this.ox += this.c1;
            this.oy += this.c2;
            this.ctx.bezierCurveTo(
                this.x1,
                this.y1,
                this.x2,
                this.y2,
                this.dx,
                this.dy
            );
            this.ctx.stroke();

            this.x1 += this.c3;
            this.y1 += this.c4;
            this.x2 += this.c5;
            this.y2 += this.c6;
            this.dx += this.c7;
            this.dy += this.c8;
        }

        this.ctx.translate(this.w / 2, this.h / 2);
        this.ctx.rotate(this.rotate);
        this.ctx.translate(-this.w / 2, -this.h / 2);

        if (this.t % (this.speed * 150) === 0) {
            this.x1 = BA.random(0, this.w);
            this.y1 = BA.random(0, this.h);
            this.c1 = BA.random(-2, 2);
            this.c2 = BA.random(-2, 2);
            this.x2 = BA.random(0, this.w);
            this.y2 = BA.random(0, this.h);
            this.c3 = BA.random(-2, 2);
            this.c4 = BA.random(-2, 2);
            this.ox = BA.random(0, this.w);
            this.oy = BA.random(0, this.h);
            this.c5 = BA.random(-2, 2);
            this.c6 = BA.random(-2, 2);
            this.dx = BA.random(0, this.w);
            this.dy = BA.random(0, this.h);
            this.c7 = BA.random(-2, 2);
            this.c8 = BA.random(-2, 2);
            this.rotate = BA.random(1, 359);

            this.ctx.beginPath();
            this.ctx.strokeStyle = BA.randomColor();
        }

        this.t++;

        requestAnimationFrame(this.draw);
    }
}
