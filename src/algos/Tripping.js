import BA from '../BaseAlgorithm.js';

export default class Tripping extends BA {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.x1 = BA.random(0, this.w);
        this.y1 = BA.random(0, this.h);
        this.x2 = BA.random(0, this.w);
        this.y2 = BA.random(0, this.h);
        this.width = BA.random(50, this.w);
        this.height = BA.random(50, this.h);
        this.rotate = BA.random(1, 360);
        this.ul = BA.random(10, Math.max(this.w, this.h));
        this.ur = BA.random(10, Math.max(this.w, this.h));
        this.ll = BA.random(10, Math.max(this.w, this.h));
        this.lr = BA.random(10, Math.max(this.w, this.h));
    }

    setupDrawingStyles() {
        this.ctx.strokeStyle = BA.randomColor(0, 255, 0.25, 0.5);
        this.ctx.lineWidth = 0.5;
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.roundRect(
                this.x1++,
                this.y1++,
                this.width++,
                this.height++,
                {
                    upperLeft: this.ul--,
                    upperRight: this.ur--,
                    lowerLeft: this.ll--,
                    lowerRight: this.lr--,
                }
            );
            this.ctx.roundRect(this.x2--, this.y2--, this.height, this.width, {
                upperLeft: this.lr,
                upperRight: this.ll,
                lowerLeft: this.ur,
                lowerRight: this.ul,
            });
        }

        this.ctx.translate(this.w / 2, this.h / 2);
        this.ctx.rotate(this.rotate);
        this.ctx.translate(-this.w / 2, -this.h / 2);

        if (this.t % (this.speed * 500) === 0) {
            this.x1 = BA.random(0, this.w);
            this.y1 = BA.random(0, this.h);
            this.x2 = BA.random(0, this.w);
            this.y2 = BA.random(0, this.h);
            this.width = BA.random(50, this.w);
            this.height = BA.random(50, this.h);
            this.rotate = BA.random(1, 360);
            this.ul = BA.random(10, Math.max(this.w, this.h));
            this.ur = BA.random(10, Math.max(this.w, this.h));
            this.ll = BA.random(10, Math.max(this.w, this.h));
            this.lr = BA.random(10, Math.max(this.w, this.h));

            this.ctx.beginPath();
            this.ctx.clearRect(-this.w, -this.h, 3 * this.w, 3 * this.h);
            this.ctx.strokeStyle = BA.randomColor(0, 255, 0.25, 0.5);
        }

        this.t++;

        requestAnimationFrame(this.draw);
    }
}
