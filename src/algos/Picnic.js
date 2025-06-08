import BA from '../BaseAlgorithm.js';

export default class Picnic extends BA {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.radius = BA.random(10, 450);
        this.rows = Math.ceil(this.h / 150) + 2;
        this.cols = Math.ceil(this.w / 150) + 2;
    }

    setupDrawingStyles() {
        this.ctx.globalCompositeOperation = 'source-over';
        this.ctx.strokeStyle = BA.randomColor(10, 255, 0.2, 0.5);
        this.ctx.lineWidth = BA.random(1, 25);
    }

    draw() {
        if (this.t % this.speed === 0) {
            for (let i = 0; i <= this.rows; i++) {
                for (let j = 0; j <= this.cols; j++) {
                    this.ctx.beginPath();
                    this.ctx.arc(
                        225 * j - 225,
                        225 * i - 225,
                        this.radius,
                        0,
                        2 * Math.PI
                    );
                    this.ctx.stroke();
                }
            }
        }

        if (this.t % (this.speed * 30) === 0) {
            this.radius = BA.random(10, 450);

            this.ctx.lineWidth = BA.random(1, 25);
            this.ctx.strokeStyle = BA.randomColor(10, 255, 0.2, 0.5);
            this.ctx.globalCompositeOperation = 'source-over';
        }

        if (this.t * (this.speed * 90) === 0) {
            this.ctx.globalCompositeOperation = 'overlay';
        }

        if (this.t % (this.speed * 150) === 0) {
            this.ctx.globalCompositeOperation = 'color';
        }

        if (this.t % (this.speed * 240) === 0) {
            this.ctx.globalCompositeOperation = 'luminosity';
        }

        if (this.t % (this.speed * 570) === 0) {
            this.ctx.globalCompositeOperation = 'hue';
        }

        this.t++;

        requestAnimationFrame(this.draw);
    }
}
