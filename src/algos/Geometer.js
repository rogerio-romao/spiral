import BA from '../BaseAlgorithm.js';

export default class Geometer extends BA {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.change = 0;
        this.rate = BA.random(25, 250);
        this.rotate = BA.random(23, 179);
    }

    setupDrawingStyles() {
        this.ctx.shadowColor = 'black';
        this.ctx.strokeStyle = BA.randomColor();
        this.ctx.lineWidth = BA.random(2, 7);
        this.ctx.shadowBlur = 1;
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.lineTo(this.w / 2 + this.change, this.h / 2 + this.change);
            this.ctx.stroke();

            this.change += this.rate;
            if (
                Math.abs(this.change + this.rate) >
                Math.max(this.w / 2, this.h / 2 || this.change + this.rate <= 0)
            ) {
                this.rate = -this.rate;
            }

            this.ctx.translate(this.w / 2, this.h / 2);
            this.ctx.rotate((this.rotate * Math.PI) / 180);
            this.ctx.translate(-this.w / 2, -this.h / 2);
        }

        if (this.t % (this.speed * 180) === 0) {
            this.change = 0;
            this.rate = BA.random(25, 250);
            this.rotate = BA.random(23, 179);
            this.ctx.beginPath();
            this.ctx.lineWidth = BA.random(2, 7);

            let color = Math.random();
            if (color < 0.2) {
                this.ctx.strokeStyle = 'white';
                this.ctx.shadowColor = 'black';
            } else if (color < 0.4) {
                this.ctx.strokeStyle = 'black';
                this.ctx.shadowColor = 'white';
            } else {
                this.ctx.strokeStyle = BA.randomColor();
                this.ctx.shadowColor = 'black';
            }
        }

        this.t++;

        requestAnimationFrame(this.draw);
    }
}
