import BA from '../BaseAlgorithm.js';

export default class Halfsies extends BA {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.rot = BA.random(3, 37);
        this.radius = BA.random(40, 400);
        this.x = BA.random(this.w / 2 - this.radius, this.w / 2 + this.radius);
        this.y = BA.random(this.h / 2 - this.radius, this.h / 2 + this.radius);
        this.counter = false;
        this.width1 = BA.random(2, 11);
        this.width2 = BA.random(2, 11);
    }

    draw() {
        this.ctx.lineWidth = this.t % 2 ? this.width1 : this.width2;
        this.ctx.strokeStyle = this.t % 2 ? 'black' : 'white';
        this.counter = this.t % 2 ? true : false;
        this.ctx.globalCompositeOperation =
            this.t % 2 ? 'source-over' : 'difference';

        if (this.t % this.speed === 0) {
            this.ctx.beginPath();
            this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI, this.counter);
            this.ctx.stroke();
            this.ctx.closePath();
        }

        this.ctx.translate(this.w / 2, this.h / 2);
        this.ctx.rotate((this.rot * Math.PI) / 180);
        this.ctx.translate(-this.w / 2, -this.h / 2);

        if (this.t % (this.speed * 120) === 0) {
            this.rot = BA.random(3, 37);
            this.width1 = BA.random(2, 11);
            this.width2 = BA.random(2, 11);
            this.radius = BA.random(40, 400);
            this.x = BA.random(
                this.w / 2 - this.radius,
                this.w / 2 + this.radius
            );
            this.y = BA.random(
                this.h / 2 - this.radius,
                this.h / 2 + this.radius
            );

            this.ctx.beginPath();
        }

        this.t++;

        requestAnimationFrame(this.draw);
    }
}
