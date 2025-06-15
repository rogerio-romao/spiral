import AL from '../AlgorithmLoader.js';

export default class GasClouds extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.width = AL.random(0, this.w / 2);
        this.height = AL.random(0, this.h / 2);
        this.ul = AL.random(0, 300);
        this.ur = AL.random(0, 300);
        this.dl = AL.random(0, 300);
        this.dr = AL.random(0, 300);
        this.x = 0;
        this.y = 0;
        this.rotate = AL.random(1, 200);
    }

    setupDrawingStyles() {
        this.ctx.strokeStyle = AL.randomColor(0, 150, 0.2, 0.5);
        this.ctx.fillStyle = AL.randomColor(25, 255, 0.02, 0.04);
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
            this.width = AL.random(0, this.w / 2);
            this.height = AL.random(0, this.h / 2);
            this.ul = AL.random(0, 300);
            this.ur = AL.random(0, 300);
            this.dl = AL.random(0, 300);
            this.dr = AL.random(0, 300);
            this.x = 0;
            this.y = 0;
            this.rotate = AL.random(1, 200);

            this.ctx.strokeStyle = AL.randomColor(0, 150, 0.2, 0.5);
            this.ctx.fillStyle = AL.randomColor(25, 255, 0.02, 0.04);
        }

        this.ctx.translate(this.w / 2, this.h / 2);
        this.ctx.rotate(this.rotate);
        this.ctx.translate(-this.w / 2, -this.h / 2);

        this.t++;

        requestAnimationFrame(this.draw);
    }
}
