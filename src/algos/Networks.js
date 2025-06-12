import BA from '../BaseAlgorithm.js';

export default class Networks extends BA {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.drawAmount = 0.01;
        this.x = this.w / 2;
        this.y = this.h / 2;
        this.rot = BA.random(1, 71);
        this.size = BA.random(30, 200);
        this.sizeIncrease = Math.random() * BA.random(0, 5);
    }

    setupDrawingStyles() {
        this.ctx.strokeStyle = BA.randomColor();
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.arc(
                this.x,
                this.y,
                this.size,
                0,
                this.drawAmount * Math.PI * 2
            );
            this.ctx.stroke();

            this.drawAmount += 0.001;
            this.size += this.sizeIncrease;
            this.ctx.beginPath();
        }

        this.ctx.translate(this.w / 2, this.h / 2);
        this.ctx.rotate(this.rot);
        this.ctx.translate(-this.w / 2, -this.h / 2);

        if (this.t % (this.speed * 480) === 0) {
            this.drawAmount = 0.01;
            this.x = BA.random(0, this.w);
            this.y = BA.random(0, this.h);
            this.rot = BA.random(1, 71);
            this.size = BA.random(30, 200);
            this.sizeIncrease = Math.random() * BA.random(0, 5);

            this.ctx.strokeStyle = BA.randomColor();
        }

        this.t++;

        requestAnimationFrame(this.draw);
    }
}
