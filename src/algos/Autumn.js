import BA from '../BaseAlgorithm.js';

export default class Autumn extends BA {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.y = 0;
        this.x = 0;
        this.size = BA.random(13, 110);
        this.rotate = BA.random(1, 90);
    }

    setupDrawingStyles() {
        this.ctx.fillStyle = BA.randomColor(0, 255, 0.1, 0.6);
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.beginPath();
            this.ctx.arc(this.x, this.y, this.size, 0, Math.PI);
            this.ctx.fill();

            this.x += this.size;
            if (this.x > this.w) {
                this.x = 0;
                this.y += this.size;
                this.size = BA.random(15, 110);
            }
            if (this.y > this.h) {
                this.x = 0;
                this.y = 0;
                this.rotate = BA.random(1, 90);

                this.ctx.fillStyle = BA.randomColor(0, 255, 0.1, 0.6);
            }
        }

        this.ctx.translate(this.w / 2, this.h / 2);
        this.ctx.rotate((this.rotate * Math.PI) / 180);
        this.ctx.translate(-this.w / 2, -this.h / 2);

        this.t++;

        requestAnimationFrame(this.draw);
    }
}
