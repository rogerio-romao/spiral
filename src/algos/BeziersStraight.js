import BaseAlgorithm from '../BaseAlgorithm.js';

export default class BeziersStraight extends BaseAlgorithm {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.x = this.random(0, this.w);
        this.y = this.random(0, this.h);
        this.cp1X = this.random(0, this.w);
        this.cp1Y = this.random(0, this.h);
        this.cp2X = this.random(0, this.w);
        this.cp2Y = this.random(0, this.h);
        this.rot = this.random(1, 21);
    }

    setupDrawingStyles() {
        this.ctx.strokeStyle = this.randomColor(5, 255, 0.2, 0.2);
    }

    draw = () => {
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

                this.ctx.translate(this.w / 2, this.h / 2);
                this.ctx.rotate(this.rot);
                this.ctx.translate(-this.w / 2, -this.h / 2);
            }

            this.stagger++;
        }

        if (this.t % (this.speed * 280) === 0) {
            this.ctx.closePath();
            this.ctx.beginPath();
            this.ctx.strokeStyle = this.randomColor(5, 255, 0.2, 0.2);
            this.ctx.translate(this.w / 2, this.h / 2);
            this.ctx.rotate(this.random(0, 3) * Math.PI);
            this.ctx.translate(-this.w / 2, -this.h / 2);
            this.cp2Y = this.random(0, this.h);
        }

        this.t++;

        requestAnimationFrame(this.draw);
    };
}
