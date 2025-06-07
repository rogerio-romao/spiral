import BA from '../BaseAlgorithm.js';

export default class Spikey extends BA {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.rounded1 = BA.random(75, 475);
        this.rounded2 = BA.random(75, 475);
        this.rounded3 = BA.random(75, 475);
        this.rounded4 = BA.random(75, 475);
        this.side1 = BA.random(0, this.w);
        this.side2 = BA.random(0, this.h);
        this.side3 = BA.random(0, this.w);
        this.side4 = BA.random(0, this.h);
        this.rotate = (BA.random(2, 358) * Math.PI) / 180;
    }

    setupDrawingStyles() {
        this.ctx.beginPath();
        this.ctx.moveTo(this.w / 2, this.h / 2);
        this.ctx.strokeStyle = BA.randomColor(60, 255, 1, 1);
        this.ctx.lineWidth = 0.1;
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.stagger = this.stagger % 2;

            if (this.stagger === 0) {
                this.ctx.translate(this.w / 2, this.h / 2);
                this.ctx.rotate(this.rotate);
                this.ctx.roundRect(
                    this.side1--,
                    this.side2--,
                    this.side1--,
                    this.side2--,
                    {
                        upperLeft: this.rounded1++,
                        upperRight: this.rounded2++,
                        lowerLeft: this.rounded3++,
                        lowerRight: this.rounded4++,
                    },
                    false,
                    true
                );
                this.ctx.translate(-this.w / 2, -this.h / 2);
            }

            if (this.stagger === 1) {
                this.ctx.translate(this.w / 2, this.h / 2);
                this.ctx.rotate(this.rotate);
                this.ctx.roundRect(
                    this.side3++,
                    this.side4++,
                    this.side3++,
                    this.side4++,
                    {
                        upperLeft: this.rounded3--,
                        upperRight: this.rounded4--,
                        lowerLeft: this.rounded2--,
                        lowerRight: this.rounded1--,
                    },
                    false,
                    true
                );
                this.ctx.translate(-this.w / 2, -this.h / 2);
            }

            this.stagger++;
        }

        if (this.t % (this.speed * 400) === 0) {
            this.ctx.canvas.width = this.ctx.canvas.height = 0;
            this.ctx.canvas.width = this.w;
            this.ctx.canvas.height = this.h;
            this.rounded1 = BA.random(75, 475);
            this.rounded2 = BA.random(75, 475);
            this.rounded3 = BA.random(75, 475);
            this.rounded4 = BA.random(75, 475);
            this.side1 = BA.random(0, this.w / 4);
            this.side2 = BA.random(0, this.h / 4);
            this.ctx.beginPath();
            this.ctx.strokeStyle = BA.randomColor(0, 255, 0.15, 0.6);
            this.rotate = (BA.random(2, 358) * Math.PI) / 180;
        }

        this.t++;

        requestAnimationFrame(this.draw);
    }
}
