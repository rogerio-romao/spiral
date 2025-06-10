import BA from '../BaseAlgorithm.js';

export default class Aperture extends BA {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.x = this.w / 2;
        this.y = BA.random(100, this.h - 100);
        this.width = BA.random(100, this.w - 100);
        this.height = BA.random(100, this.h - 100);
        this.round = BA.random(5, 100);
        this.white = true;
        this.rotate = BA.random(1, 70);
        this.incX = Math.random();
        this.incH = Math.random();
    }

    setupDrawingStyles() {
        this.ctx.strokeStyle = 'white';
        this.ctx.fillStyle = 'black';
        this.ctx.globalAlpha = 0.75;
        this.ctx.lineWidth = 4;
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.roundRect(
                this.x,
                this.y,
                this.width,
                this.height,
                {
                    upperLeft: this.round,
                    upperRight: this.round,
                    lowerLeft: this.round,
                    lowerRight: this.round,
                },
                true
            );
        }

        this.x += this.incX;
        this.height += this.incH;

        this.ctx.translate(this.w / 2, this.h / 2);
        this.ctx.rotate(this.rotate);
        this.ctx.translate(-this.w / 2, -this.h / 2);

        if (this.t % (this.speed * 300) === 0) {
            if (this.white) {
                this.ctx.strokeStyle = 'black';
                this.ctx.fillStyle = 'white';
            } else {
                this.ctx.strokeStyle = 'white';
                this.ctx.fillStyle = 'black';
            }
            this.white = !this.white;

            this.x = this.w / 2;
            this.y = BA.random(100, this.h - 100);
            this.rotate = BA.random(1, 70);
            this.width = BA.random(100, this.w - 100);
            this.height = BA.random(100, this.h - 100);
            this.round = BA.random(5, 100);
            this.incX = Math.random();
            this.incH = Math.random();

            this.ctx.beginPath();
        }

        this.t++;

        requestAnimationFrame(this.draw);
    }
}
