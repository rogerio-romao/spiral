import AL from '../AlgorithmLoader.js';

export default class Cornucopia extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.x = AL.random(0, this.w);
        this.y = AL.random(0, this.h);
        this.width = AL.random(15, 240);
        this.height = AL.random(15, 150);
        this.ul = AL.random(4, 35);
        this.ur = AL.random(4, 35);
        this.dl = AL.random(4, 35);
        this.dr = AL.random(4, 35);
        this.rotate = AL.random(1, 25);
    }

    setupDrawingStyles() {
        this.ctx.strokeStyle = AL.randomColor();
        this.ctx.fillStyle = AL.randomColor(0, 255, 0.025, 0.09);
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
            this.x = AL.random(0, this.w);
            this.y = AL.random(0, this.h);
            this.rotate = AL.random(1, 25);
            this.width = AL.random(15, 240);
            this.height = AL.random(15, 150);
            this.ul = AL.random(4, 35);
            this.ur = AL.random(4, 35);
            this.dl = AL.random(4, 35);
            this.dr = AL.random(4, 35);

            this.ctx.strokeStyle = AL.randomColor();
            this.ctx.fillStyle = AL.randomColor(0, 255, 0.025, 0.09);
        }

        this.ctx.translate(this.w / 2, this.h / 2);
        this.ctx.rotate(this.rotate);
        this.ctx.translate(-this.w / 2, -this.h / 2);

        this.t++;

        requestAnimationFrame(this.draw);
    }
}
