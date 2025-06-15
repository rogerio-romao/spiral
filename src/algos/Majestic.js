import AL from '../AlgorithmLoader.js';

export default class Majestic extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.rotations = [
            1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13, 14, 15, 17, 19, 20, 21, 22,
            23, 25, 26, 28, 29, 30, 31, 32, 33, 34, 35, 37, 38, 39, 40, 41, 42,
            43, 44, 45,
        ];
        this.rotate = this.rotations[AL.random(0, this.rotations.length)];

        this.x = AL.random(0, this.w);
        this.y = AL.random(0, this.h);
        this.width = AL.random(30, this.w - 100);
        this.height = AL.random(30, this.h - 100);
        this.ul = AL.random(10, this.w);
        this.ur = AL.random(10, this.h);
        this.ll = AL.random(10, this.h);
        this.lr = AL.random(10, this.w);
    }

    setupDrawingStyles() {
        this.ctx.strokeStyle = AL.randomColor();
        this.ctx.fillStyle = AL.randomColor(0, 255, 0.01, 0.05);
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.roundRect(
                this.x,
                this.y,
                this.width,
                this.height,
                {
                    upperLeft: this.ul,
                    upperRight: this.ur,
                    lowerLeft: this.ll,
                    lowerRight: this.lr,
                },
                true,
                true
            );
        }

        this.ctx.translate(this.w / 2, this.h / 2);
        this.ctx.rotate((this.rotate * Math.PI) / 180);
        this.ctx.translate(-this.w / 2, -this.h / 2);

        if (this.t % (this.speed * 180) === 0) {
            this.width = AL.random(30, this.w - 100);
            this.height = AL.random(30, this.h - 100);
            this.x = AL.random(0, this.w);
            this.y = AL.random(0, this.h);
            this.ul = AL.random(10, this.w);
            this.ur = AL.random(10, this.h);
            this.ll = AL.random(10, this.h);
            this.lr = AL.random(10, this.w);
            this.rotate = this.rotations[AL.random(0, this.rotations.length)];

            this.ctx.fillRect(-this.w, -this.h, 3 * this.w, 3 * this.h);
            this.ctx.strokeStyle = AL.randomColor();
            this.ctx.fillStyle = AL.randomColor(0, 255, 0.01, 0.05);
        }

        this.t++;

        requestAnimationFrame(this.draw);
    }
}
