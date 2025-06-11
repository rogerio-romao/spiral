import BA from '../BaseAlgorithm.js';

export default class Cornucopia2 extends BA {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.x = BA.random(0, this.w);
        this.y = BA.random(0, this.h);
        this.width = BA.random(35, 440);
        this.height = BA.random(35, 350);
        this.ul = BA.random(4, 135);
        this.ulc = BA.random(-5, 5);
        this.ur = BA.random(4, 135);
        this.urc = BA.random(-5, 5);
        this.dl = BA.random(4, 135);
        this.dlc = BA.random(-5, 5);
        this.dr = BA.random(4, 135);
        this.drc = BA.random(-5, 5);
        this.rotate = BA.random(1, 75);
    }

    setupDrawingStyles() {
        this.ctx.strokeStyle = BA.randomColor(0, 255, 0.75, 1);
        this.ctx.fillStyle = BA.randomColor();
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
                    lowerLeft: this.dl,
                    lowerRight: this.dr,
                },
                false,
                true
            );

            this.ul += this.ulc;
            this.ur += this.urc;
            this.dl += this.dlc;
            this.dr += this.drc;
        }

        if (this.t % (this.speed * 450) === 0) {
            this.x = BA.random(0, this.w);
            this.y = BA.random(0, this.h);
            this.width = BA.random(35, 440);
            this.height = BA.random(35, 350);
            this.ul = BA.random(4, 135);
            this.ulc = BA.random(-5, 5);
            this.urc = BA.random(-5, 5);
            this.dlc = BA.random(-5, 5);
            this.drc = BA.random(-5, 5);
            this.ur = BA.random(4, 135);
            this.dl = BA.random(4, 135);
            this.dr = BA.random(4, 135);
            this.rotate = BA.random(1, 75);

            this.ctx.strokeStyle = BA.randomColor(0, 255, 0.75, 1);
            this.ctx.fillStyle = BA.randomColor();
        }

        this.ctx.translate(this.w / 2, this.h / 2);
        this.ctx.rotate(this.rotate);
        this.ctx.translate(-this.w / 2, -this.h / 2);

        this.t++;

        requestAnimationFrame(this.draw.bind(this));
    }
}
