import BA from '../BaseAlgorithm.js';

export default class Rounded extends BA {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.rounded1 = BA.random(15, 50);
        this.rounded2 = BA.random(15, 50);
        this.rounded3 = BA.random(15, 50);
        this.rounded4 = BA.random(15, 50);
        this.side1 = BA.random(0, this.w / 4);
        this.side2 = BA.random(0, this.h / 4);
        this.rotate = (BA.random(1, 359) * Math.PI) / 180;
    }

    setupDrawingStyles() {
        this.ctx.strokeStyle = BA.randomColor(50, 255, 0.5, 1);
        this.ctx.filter = 'contrast(2)';
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.translate(this.w / 2, this.h / 2);
            this.ctx.rotate(this.rotate);
            this.ctx.roundRect(
                this.side1,
                this.side2,
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
        }

        if (this.t % (this.speed * 125) === 0) {
            this.rounded1 = BA.random(15, 50);
            this.rounded2 = BA.random(15, 50);
            this.rounded3 = BA.random(15, 50);
            this.rounded4 = BA.random(15, 50);
            this.side1 = BA.random(0, this.w / 4);
            this.side2 = BA.random(0, this.h / 4);
            this.rotate = (BA.random(1, 359) * Math.PI) / 180;
            this.ctx.beginPath();
            this.ctx.strokeStyle = BA.randomColor(50, 255, 0.5, 1);
        }

        this.t++;

        requestAnimationFrame(this.draw);
    }
}
