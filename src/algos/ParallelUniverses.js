import BA from '../BaseAlgorithm.js';

export default class ParallelUniverses extends BA {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.rounded1 = BA.random(5, 250);
        this.rounded2 = BA.random(5, 250);
        this.rounded3 = BA.random(5, 250);
        this.rounded4 = BA.random(5, 250);
        this.x1 = BA.random(0, this.w);
        this.y1 = BA.random(0, this.h);
        this.x2 = BA.random(0, this.w);
        this.y2 = BA.random(0, this.h);
        this.x3 = BA.random(0, this.w);
        this.y3 = BA.random(0, this.h);
        this.x4 = BA.random(0, this.w);
        this.y4 = BA.random(0, this.h);
        this.side1 = BA.random(20, this.w);
        this.side2 = BA.random(20, this.h);
        this.side3 = BA.random(20, this.w);
        this.side4 = BA.random(20, this.h);
        this.side5 = BA.random(20, this.w);
        this.side6 = BA.random(20, this.h);
        this.side7 = BA.random(20, this.w);
        this.side8 = BA.random(20, this.h);
        this.rotate = BA.random(1, 11);
        this.color1 = BA.randomColor(0, 255, 0.05, 0.1);
        this.color2 = BA.randomColor(0, 255, 0.05, 0.1);
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.stagger = this.stagger % 4;

            if (this.stagger === 0) {
                this.ctx.fillStyle = this.color1;
                this.ctx.roundRect(
                    this.x1++,
                    this.y1++,
                    this.side1++,
                    this.side2++,
                    {
                        upperLeft: this.rounded1++,
                        upperRight: this.rounded1++,
                        lowerLeft: this.rounded1++,
                        lowerRight: this.rounded1++,
                    },
                    true,
                    false
                );
            }

            if (this.stagger === 1) {
                this.ctx.fillStyle = this.color2;
                this.ctx.roundRect(
                    this.x2--,
                    this.y2--,
                    this.side3--,
                    this.side4--,
                    {
                        upperLeft: this.rounded2++,
                        upperRight: this.rounded2++,
                        lowerLeft: this.rounded2++,
                        lowerRight: this.rounded2++,
                    },
                    true,
                    false
                );
            }

            if (this.stagger === 2) {
                this.ctx.fillStyle = this.color1;
                this.ctx.roundRect(
                    this.x3++,
                    this.y3++,
                    this.side5++,
                    this.side6++,
                    {
                        upperLeft: this.rounded3--,
                        upperRight: this.rounded3--,
                        lowerLeft: this.rounded3--,
                        lowerRight: this.rounded3--,
                    },
                    true,
                    false
                );
            }

            if (this.stagger === 3) {
                this.ctx.fillStyle = this.color2;
                this.ctx.roundRect(
                    this.x4,
                    this.y4,
                    this.side7,
                    this.side8,
                    {
                        upperLeft: this.rounded4++,
                        upperRight: this.rounded4++,
                        lowerLeft: this.rounded4--,
                        lowerRight: this.rounded4--,
                    },
                    true,
                    false
                );
            }

            this.ctx.translate(this.w / 2, this.h / 2);
            this.ctx.rotate(this.rotate);
            this.ctx.translate(-this.w / 2, -this.h / 2);
        }

        if (this.t % (this.speed * 200) === 0) {
            this.rounded1 = BA.random(5, 250);
            this.rounded2 = BA.random(5, 250);
            this.rounded3 = BA.random(5, 250);
            this.rounded4 = BA.random(5, 250);
            this.x1 = BA.random(0, this.w / 2);
            this.y1 = BA.random(0, this.h / 2);
            this.x2 = BA.random(this.w / 2, this.w);
            this.y2 = BA.random(0, this.h / 2);
            this.x3 = BA.random(this.w / 2, this.w);
            this.y3 = BA.random(this.h / 2, this.h);
            this.x4 = BA.random(0, this.w / 2);
            this.y4 = BA.random(this.h / 2, this.h);
            this.side1 = BA.random(20, this.w);
            this.side2 = BA.random(20, this.h);
            this.side3 = BA.random(20, this.w);
            this.side4 = BA.random(20, this.h);
            this.side5 = BA.random(20, this.w);
            this.side6 = BA.random(20, this.h);
            this.side7 = BA.random(20, this.w);
            this.side8 = BA.random(20, this.h);
            this.rotate = BA.random(1, 11);
            this.color1 = BA.randomColor(0, 255, 0.05, 0.1);
            this.color2 = BA.randomColor(0, 255, 0.05, 0.1);
        }

        this.stagger++;

        this.t++;

        requestAnimationFrame(this.draw);
    }
}
