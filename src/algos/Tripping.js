import AL from '../AlgorithmLoader.js';

export default class Tripping extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.x1 = AL.random(0, this.w);
        this.y1 = AL.random(0, this.h);
        this.x2 = AL.random(0, this.w);
        this.y2 = AL.random(0, this.h);
        this.width = AL.random(50, this.w);
        this.height = AL.random(50, this.h);
        this.rotate = AL.random(1, 360);
        this.ul = AL.random(10, Math.max(this.w, this.h));
        this.ur = AL.random(10, Math.max(this.w, this.h));
        this.ll = AL.random(10, Math.max(this.w, this.h));
        this.lr = AL.random(10, Math.max(this.w, this.h));
    }

    setupDrawingStyles() {
        this.ctx.strokeStyle = AL.randomColor(0, 255, 0.25, 0.5);
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
            this.x1 = AL.random(0, this.w);
            this.y1 = AL.random(0, this.h);
            this.x2 = AL.random(0, this.w);
            this.y2 = AL.random(0, this.h);
            this.width = AL.random(50, this.w);
            this.height = AL.random(50, this.h);
            this.rotate = AL.random(1, 360);
            this.ul = AL.random(10, Math.max(this.w, this.h));
            this.ur = AL.random(10, Math.max(this.w, this.h));
            this.ll = AL.random(10, Math.max(this.w, this.h));
            this.lr = AL.random(10, Math.max(this.w, this.h));

            this.ctx.beginPath();
            this.ctx.clearRect(-this.w, -this.h, 3 * this.w, 3 * this.h);
            this.ctx.strokeStyle = AL.randomColor(0, 255, 0.25, 0.5);
        }

        this.t++;

        requestAnimationFrame(this.draw);
    }
}
