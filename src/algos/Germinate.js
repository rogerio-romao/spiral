import BA from '../BaseAlgorithm.js';

export default class Germinate extends BA {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.angles = [
            5, 6, 8, 9, 10, 12, 15, 16, 18, 20, 24, 32, 35, 36, 42, 44, 45, 48,
            50, 55, 64, 65, 66, 70, 72, 75, 95, 100,
        ];
        this.rotate = this.angles[BA.random(0, this.angles.length)];

        this.width = BA.random(35, this.w * 0.8);
        this.height = BA.random(35, this.h * 0.8);
        this.ul = BA.random(4, 115);
        this.ur = BA.random(4, 115);
        this.dl = BA.random(4, 115);
        this.dr = BA.random(4, 115);
        this.wc = BA.random(-5, 6);
        this.hc = BA.random(-5, 6);
        this.rc = BA.random(-7, 8);
    }

    setupDrawingStyles() {
        this.ctx.strokeStyle = this.ctx.shadowColor = BA.randomColor(
            0,
            255,
            1,
            1
        );
        this.ctx.fillStyle = BA.randomColor(0, 255, 0.2, 0.2);
        this.ctx.shadowBlur = 2;
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.roundRect(
                this.w / 2,
                this.h / 2,
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
        }

        if (this.t % (this.speed * 4) === 0) {
            this.ul += this.rc;
            this.ur += this.wc;
            this.dr += this.hc;
            this.dl -= this.rc;
        }

        if (this.t % (this.speed * 12) === 0) {
            this.width -= this.wc;
            this.height += this.hc;
        }

        if (this.t % (this.speed * 280) === 0) {
            this.ctx.strokeStyle = this.ctx.shadowColor = BA.randomColor(
                0,
                255,
                1,
                1
            );
            this.ctx.fillStyle = BA.randomColor(0, 255, 0.2, 0.2);
            this.ctx.fillRect(-this.w, -this.h, 3 * this.w, 3 * this.h);

            this.width = BA.random(35, this.w * 0.8);
            this.height = BA.random(35, this.h * 0.8);
            this.ul = BA.random(4, 115);
            this.ur = BA.random(4, 115);
            this.dl = BA.random(4, 115);
            this.dr = BA.random(4, 115);
            this.wc = BA.random(-5, 6);
            this.hc = BA.random(-5, 6);
            this.rc = BA.random(-7, 8);
            this.rotate = this.angles[BA.random(0, this.angles.length)];
        }

        this.ctx.translate(this.w / 2, this.h / 2);
        this.ctx.rotate((this.rotate * Math.PI) / 180);
        this.ctx.translate(-this.w / 2, -this.h / 2);

        this.t++;

        requestAnimationFrame(this.draw);
    }
}
