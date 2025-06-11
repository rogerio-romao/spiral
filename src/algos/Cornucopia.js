import BA from '../BaseAlgorithm.js';

export default class Cornucopia extends BA {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.x = BA.random(0, this.w);
        this.y = BA.random(0, this.h);
        this.width = BA.random(15, 240);
        this.height = BA.random(15, 150);
        this.ul = BA.random(4, 35);
        this.ur = BA.random(4, 35);
        this.dl = BA.random(4, 35);
        this.dr = BA.random(4, 35);
        this.rotate = BA.random(1, 25);
    }

    setupDrawingStyles() {
        this.ctx.strokeStyle = BA.randomColor();
        this.ctx.fillStyle = BA.randomColor(0, 255, 0.025, 0.09);
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.roundRect(
                this.x,
                this.y,
                this.width++,
                this.height--,
                {
                    upperLeft: this.ul--,
                    upperRight: this.ur++,
                    lowerLeft: this.dl++,
                    lowerRight: this.dr--,
                },
                true,
                false
            );
        }

        if (this.t % (this.speed * 210) === 0) {
            this.x = BA.random(0, this.w);
            this.y = BA.random(0, this.h);
            this.rotate = BA.random(1, 25);
            this.width = BA.random(15, 240);
            this.height = BA.random(15, 150);
            this.ul = BA.random(4, 35);
            this.ur = BA.random(4, 35);
            this.dl = BA.random(4, 35);
            this.dr = BA.random(4, 35);

            this.ctx.strokeStyle = BA.randomColor();
            this.ctx.fillStyle = BA.randomColor(0, 255, 0.025, 0.09);
        }

        this.ctx.translate(this.w / 2, this.h / 2);
        this.ctx.rotate(this.rotate);
        this.ctx.translate(-this.w / 2, -this.h / 2);

        this.t++;

        requestAnimationFrame(this.draw);
    }
}
