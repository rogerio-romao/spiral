import BA from '../BaseAlgorithm.js';

export default class GasClouds extends BA {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.width = BA.random(0, this.w / 2);
        this.height = BA.random(0, this.h / 2);
        this.ul = BA.random(0, 300);
        this.ur = BA.random(0, 300);
        this.dl = BA.random(0, 300);
        this.dr = BA.random(0, 300);
        this.x = 0;
        this.y = 0;
        this.rotate = BA.random(1, 200);
    }

    setupDrawingStyles() {
        this.ctx.strokeStyle = BA.randomColor(0, 150, 0.2, 0.5);
        this.ctx.fillStyle = BA.randomColor(25, 255, 0.02, 0.04);
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.roundRect(
                this.x++,
                this.y++,
                this.width,
                this.height,
                {
                    upperLeft: this.ul,
                    upperRight: this.ur,
                    lowerLeft: this.dl,
                    lowerRight: this.dr,
                },
                true,
                false
            );
        }

        if (this.t % (this.speed * 240) === 0) {
            this.width = BA.random(0, this.w / 2);
            this.height = BA.random(0, this.h / 2);
            this.ul = BA.random(0, 300);
            this.ur = BA.random(0, 300);
            this.dl = BA.random(0, 300);
            this.dr = BA.random(0, 300);
            this.x = 0;
            this.y = 0;
            this.rotate = BA.random(1, 200);

            this.ctx.strokeStyle = BA.randomColor(0, 150, 0.2, 0.5);
            this.ctx.fillStyle = BA.randomColor(25, 255, 0.02, 0.04);
        }

        this.ctx.translate(this.w / 2, this.h / 2);
        this.ctx.rotate(this.rotate);
        this.ctx.translate(-this.w / 2, -this.h / 2);

        this.t++;

        requestAnimationFrame(this.draw);
    }
}
