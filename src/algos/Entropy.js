import BA from '../BaseAlgorithm.js';

export default class Entropy extends BA {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.width = BA.random(50, this.w);
        this.height = BA.random(50, this.h);
        this.rotate = BA.random(1, 181);
        this.ul = BA.random(10, Math.min(this.w, this.h));
        this.ur = BA.random(10, Math.min(this.w, this.h));
        this.ll = BA.random(10, Math.min(this.w, this.h));
        this.lr = BA.random(10, Math.min(this.w, this.h));
    }

    setupDrawingStyles() {
        this.ctx.strokeStyle = BA.randomColor(0, 255, 1);
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.roundRect(0, 0, this.width++, this.height++, {
                upperLeft: this.ul--,
                upperRight: this.ur--,
                lowerLeft: this.ll--,
                lowerRight: this.lr--,
            });
            this.ctx.roundRect(this.w, this.h, this.height, this.width, {
                upperLeft: this.lr,
                upperRight: this.ll,
                lowerLeft: this.ur,
                lowerRight: this.ul,
            });
        }

        this.ctx.translate(this.w / 2, this.h / 2);
        this.ctx.rotate(this.rotate);
        this.ctx.translate(-this.w / 2, -this.h / 2);

        if (this.t % (this.speed * 405) === 0) {
            this.width = BA.random(50, this.w);
            this.height = BA.random(50, this.h);
            this.rotate = BA.random(1, 181);
            this.ul = BA.random(10, Math.min(this.w, this.h));
            this.ur = BA.random(10, Math.min(this.w, this.h));
            this.ll = BA.random(10, Math.min(this.w, this.h));
            this.lr = BA.random(10, Math.min(this.w, this.h));

            let colorRoll = Math.random();
            this.ctx.strokeStyle =
                colorRoll < 0.1
                    ? 'black'
                    : colorRoll < 0.2
                    ? 'white'
                    : BA.randomColor(0, 255, 1);
            this.ctx.beginPath();
        }

        this.t++;

        requestAnimationFrame(this.draw);
    }
}
