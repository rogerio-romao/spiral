import BA from '../BaseAlgorithm.js';

export default class Organic extends BA {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.rounded1 = BA.random(10, 180);
        this.rounded2 = BA.random(10, 180);
        this.rounded3 = BA.random(10, 180);
        this.rounded4 = BA.random(10, 180);
        this.decrease = 0.99;
        this.side1 = this.w / 2;
        this.side2 = this.h / 2;
        this.rotate = (BA.random(5, 40) * Math.PI) / 180;
    }

    setupDrawingStyles() {
        this.ctx.lineWidth = BA.random(6, 36);
        this.ctx.strokeStyle = BA.randomColor(0, 255, 0.1, 0.45);
        this.ctx.fillStyle = BA.randomColor(0, 255, 0.1, 0.45);
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.translate(this.w / 2, this.h / 2);
            this.ctx.rotate(this.rotate);
            this.ctx.roundRect(
                this.ctx.lineWidth - 2,
                this.ctx.lineWidth - 2,
                this.side1,
                this.side2,
                {
                    upperLeft: this.rounded1,
                    upperRight: this.rounded2,
                    lowerLeft: this.rounded3,
                    lowerRight: this.rounded4,
                },
                true,
                true
            );
            this.ctx.translate(-this.w / 2, -this.h / 2);
            this.side1 *= this.decrease;
            this.side2 *= this.decrease;
            if (this.side1 < 10 || this.side2 < 10) this.decrease = 1.01;
            if (this.side1 > this.w || this.side2 > this.h)
                this.decrease = 0.99;
        }

        if (this.t % (this.speed * 250) === 0) {
            this.rounded1 = BA.random(10, 180);
            this.rounded2 = BA.random(10, 180);
            this.rounded3 = BA.random(10, 180);
            this.rounded4 = BA.random(10, 180);
            this.ctx.beginPath();
            this.ctx.lineWidth = BA.random(6, 36);
            this.ctx.strokeStyle = BA.randomColor(0, 255, 0.1, 0.45);
            this.ctx.fillStyle = BA.randomColor(0, 255, 0.1, 0.45);
            this.rotate = (BA.random(5, 40) * Math.PI) / 180;
        }

        this.t++;

        requestAnimationFrame(this.draw);
    }
}
