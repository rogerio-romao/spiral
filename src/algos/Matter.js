import BA from '../BaseAlgorithm.js';

export default class Matter extends BA {
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
        this.rotate =
            this.rotations[Math.floor(Math.random() * this.rotations.length)];

        this.x1 = this.w / 2;
        this.y1 = this.h / 2;
        this.radius1 = BA.random(5, 150);
        this.x2 = BA.random(0, this.w);
        this.y2 = BA.random(0, this.h);
        this.radius2 = BA.random(5, 150);
        this.x3 = BA.random(0, this.w);
        this.y3 = BA.random(0, this.h);
        this.radius3 = BA.random(5, 150);
    }

    setupDrawingStyles() {
        this.ctx.fillStyle = BA.randomColor(10, 255, 0.02, 0.07);
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.beginPath();
            this.ctx.arc(this.x1, this.y1, this.radius1, 0, 2 * Math.PI);
            this.ctx.fill();
            this.ctx.beginPath();
            this.ctx.arc(this.x2, this.y2, this.radius2, 0, 2 * Math.PI);
            this.ctx.fill();
            this.ctx.beginPath();
            this.ctx.arc(this.x3, this.y3, this.radius3, 0, 2 * Math.PI);
            this.ctx.fill();
        }

        this.ctx.translate(this.w / 2, this.h / 2);
        this.ctx.rotate(this.rotate);
        this.ctx.translate(-this.w / 2, -this.h / 2);

        if (this.t % (this.speed * 120) === 0) {
            this.x1 = BA.random(0, this.w);
            this.y1 = BA.random(0, this.h);
            this.radius1 = BA.random(5, 150);
            this.x2 = BA.random(0, this.w);
            this.y2 = BA.random(0, this.h);
            this.radius2 = BA.random(5, 150);
            this.x3 = BA.random(0, this.w);
            this.y3 = BA.random(0, this.h);
            this.radius3 = BA.random(5, 150);
            this.rotate = BA.random(1, 61);

            this.ctx.fillStyle = BA.randomColor(10, 255, 0.02, 0.07);
        }

        this.t++;

        requestAnimationFrame(this.draw);
    }
}
