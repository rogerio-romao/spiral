import AL from '../AlgorithmLoader.js';

export default class FadeIn extends AL {
    constructor() {
        super();

        this.name = 'Fade In';

        this.initializeProperties();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeProperties() {
        this.rotate = AL.random(1, 359);
        this.x1 = AL.random(0, AL.w);
        this.y1 = AL.random(0, AL.h);
        this.x2 = AL.random(0, AL.w);
        this.y2 = AL.random(0, AL.h);
        this.ox = AL.random(0, AL.w);
        this.oy = AL.random(0, AL.h);
        this.dx = AL.random(0, AL.w);
        this.dy = AL.random(0, AL.h);
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
        AL.ctx.strokeStyle = AL.randomColor();
        AL.ctx.globalAlpha = 0.15;
        AL.ctx.lineWidth = 0.2;
    }

    draw() {
        if (this.t % this.speed === 0) {
            AL.ctx.moveTo(this.ox, this.oy);
            this.ox += this.c1;
            this.oy += this.c2;
            AL.ctx.bezierCurveTo(this.x1, this.y1, this.x2, this.y2, this.dx, this.dy);
            AL.ctx.stroke();

            this.x1 += this.c3;
            this.y1 += this.c4;
            this.x2 += this.c5;
            this.y2 += this.c6;
            this.dx += this.c7;
            this.dy += this.c8;
        }

        this.t += 1;

        this.rotateCanvasRadians(this.rotate);

        if (this.t % (this.speed * 150) === 0) {
            this.initializeProperties();

            AL.ctx.strokeStyle = AL.randomColor();
            AL.ctx.beginPath();
        }

        this.requestFrame();
    }
}
