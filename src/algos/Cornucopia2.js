import AL from '../AlgorithmLoader.js';

export default class Cornucopia2 extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.x = AL.random(0, this.w);
        this.y = AL.random(0, this.h);
        this.width = AL.random(35, 440);
        this.height = AL.random(35, 350);
        this.ul = AL.random(4, 135);
        this.ulc = AL.random(-5, 5);
        this.ur = AL.random(4, 135);
        this.urc = AL.random(-5, 5);
        this.dl = AL.random(4, 135);
        this.dlc = AL.random(-5, 5);
        this.dr = AL.random(4, 135);
        this.drc = AL.random(-5, 5);
        this.rotate = AL.random(1, 75);
    }

    setupDrawingStyles() {
        this.ctx.strokeStyle = AL.randomColor(0, 255, 0.75, 1);
        this.ctx.fillStyle = AL.randomColor();
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
            this.x = AL.random(0, this.w);
            this.y = AL.random(0, this.h);
            this.width = AL.random(35, 440);
            this.height = AL.random(35, 350);
            this.ul = AL.random(4, 135);
            this.ulc = AL.random(-5, 5);
            this.urc = AL.random(-5, 5);
            this.dlc = AL.random(-5, 5);
            this.drc = AL.random(-5, 5);
            this.ur = AL.random(4, 135);
            this.dl = AL.random(4, 135);
            this.dr = AL.random(4, 135);
            this.rotate = AL.random(1, 75);

            this.ctx.strokeStyle = AL.randomColor(0, 255, 0.75, 1);
            this.ctx.fillStyle = AL.randomColor();
        }

        this.ctx.translate(this.w / 2, this.h / 2);
        this.ctx.rotate(this.rotate);
        this.ctx.translate(-this.w / 2, -this.h / 2);

        this.t++;

        requestAnimationFrame(this.draw.bind(this));
    }
}
