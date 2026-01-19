import AL from '../AlgorithmLoader.js';

export default class FadeIn extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.name = 'Fade In';

        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.rotate = AL.random(1, 359);
        this.x1 = AL.random(0, this.w);
        this.y1 = AL.random(0, this.h);
        this.x2 = AL.random(0, this.w);
        this.y2 = AL.random(0, this.h);
        this.ox = AL.random(0, this.w);
        this.oy = AL.random(0, this.h);
        this.dx = AL.random(0, this.w);
        this.dy = AL.random(0, this.h);
        this.c1 = AL.random(-2, 2);
        this.c2 = AL.random(-2, 2);
        this.c3 = AL.random(-2, 2);
        this.c4 = AL.random(-2, 2);
        this.c5 = AL.random(-2, 2);
        this.c6 = AL.random(-2, 2);
        this.c7 = AL.random(-2, 2);
        this.c8 = AL.random(-2, 2);
    }

    setupDrawingStyles() {
        this.ctx.strokeStyle = AL.randomColor();
        this.ctx.globalAlpha = 0.15;
        this.ctx.lineWidth = 0.2;
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

        this.t++;

        this.rotateCanvasRadians(this.rotate);

        if (this.t % (this.speed * 150) === 0) {
            this.initializeProperties();

            this.ctx.strokeStyle = AL.randomColor();
            this.ctx.beginPath();
        }

        requestAnimationFrame(this.draw);
    }
}
