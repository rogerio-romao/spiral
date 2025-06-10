import BA from '../BaseAlgorithm.js';

export default class Progression extends BA {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.width = BA.random(40, this.w);
        this.height = BA.random(40, this.h);
        this.round = BA.random(1, 350);
        this.rotate = BA.random(1, 180);
    }

    setupDrawingStyles() {
        this.ctx.fillStyle = BA.randomColor(0, 255, 0.01, 0.03);
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.roundRect(
                this.w / 2,
                this.h / 2,
                this.width,
                this.height,
                {
                    upperLeft: this.round,
                    upperRight: this.round,
                    lowerLeft: this.round,
                    lowerRight: this.round,
                },
                true,
                false
            );
        }

        this.ctx.translate(this.w / 2, this.h / 2);
        this.ctx.rotate((this.rotate * Math.PI) / 180);
        this.ctx.translate(-this.w / 2, -this.h / 2);

        if (this.t % (this.speed * 180) === 0) {
            this.width = BA.random(40, this.w);
            this.height = BA.random(40, this.h);
            this.round = BA.random(1, 350);
            this.rotate = BA.random(1, 180);

            this.ctx.beginPath();
            this.ctx.fillStyle = BA.randomColor(0, 255, 0.01, 0.03);
        }

        this.t++;

        this.interval = requestAnimationFrame(this.draw);
    }
}
