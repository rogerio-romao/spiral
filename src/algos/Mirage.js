import BA from '../BaseAlgorithm.js';

export default class Mirage extends BA {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.width = BA.random(100, this.w);
        this.height = BA.random(100, this.h);
        this.ul = BA.random(10, 300);
        this.ur = BA.random(10, 300);
        this.ll = BA.random(10, 300);
        this.lr = BA.random(10, 300);
        this.rotate = BA.random(1, 50);
    }

    setupDrawingStyles() {
        this.ctx.fillStyle = BA.randomColor(0, 255, 0.01, 0.05);
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.roundRect(
                this.w / 2 - this.width / 2,
                this.h / 2 - this.height / 2,
                this.width,
                this.height,
                {
                    upperLeft: this.ul,
                    upperRight: this.ur,
                    lowerLeft: this.ll,
                    lowerRight: this.lr,
                },
                true,
                false
            );
        }

        this.ctx.translate(this.w / 2, this.h / 2);
        this.ctx.rotate(this.rotate);
        this.ctx.translate(-this.w / 2, -this.h / 2);

        if (this.t % (this.speed * 200) === 0) {
            this.width = BA.random(100, this.w);
            this.height = BA.random(100, this.h);
            this.ul = BA.random(10, 300);
            this.ur = BA.random(10, 300);
            this.ll = BA.random(10, 300);
            this.lr = BA.random(10, 300);
            this.rotate = BA.random(1, 50);

            this.ctx.fillRect(-this.w, -this.h, 3 * this.w, 3 * this.h);
            this.ctx.fillStyle = BA.randomColor(0, 255, 0.01, 0.05);
        }

        this.t++;

        requestAnimationFrame(this.draw);
    }
}
