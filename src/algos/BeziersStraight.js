import AL from '../AlgorithmLoader.js';

export default class BeziersStraight extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.x = AL.random(0, this.w);
        this.y = AL.random(0, this.h);
        this.cp1X = AL.random(0, this.w);
        this.cp1Y = AL.random(0, this.h);
        this.cp2X = AL.random(0, this.w);
        this.cp2Y = AL.random(0, this.h);
        this.rot = AL.random(2, 25);
    }

    setupDrawingStyles() {
        this.ctx.strokeStyle = AL.randomColor(5, 255, 0.2, 0.2);
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.stagger = this.stagger % 3;

            if (this.stagger === 0) {
                this.ctx.bezierCurveTo(
                    this.cp1X,
                    this.cp1Y,
                    this.cp2X,
                    this.cp2Y,
                    this.x,
                    this.y
                );
                this.ctx.stroke();
            }

            if (this.stagger === 1) {
                this.ctx.moveTo(this.w / 2, this.h / 2);
                this.ctx.bezierCurveTo(
                    this.cp2X,
                    this.cp2Y,
                    this.cp1X,
                    this.cp1Y,
                    this.x,
                    this.y
                );
                this.ctx.stroke();
            }

            if (this.stagger === 2) {
                this.ctx.moveTo(this.w / 2, this.h / 2);
                this.ctx.bezierCurveTo(
                    this.cp2Y,
                    this.cp1X,
                    this.cp1Y,
                    this.cp2X,
                    this.y,
                    this.x
                );
                this.ctx.stroke();

                this.rotateCanvasRadians(this.rot);
            }

            this.stagger++;
        }

        this.t++;

        if (this.t % (this.speed * 280) === 0) {
            this.ctx.closePath();
            this.ctx.beginPath();
            this.initializeProperties();
            this.setupDrawingStyles();
            this.rotateCanvasRadians(this.rot);
        }

        requestAnimationFrame(this.draw);
    }
}
