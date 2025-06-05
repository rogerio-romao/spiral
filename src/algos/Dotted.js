import BA from '../BaseAlgorithm.js';

export default class Dotted extends BA {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.vx1 = BA.random(0, this.w);
        this.vx2 = BA.random(0, this.w);
        this.vx3 = BA.random(0, this.w);
        this.vy1 = BA.random(0, this.h);
        this.vy2 = BA.random(0, this.h);
        this.vy3 = BA.random(0, this.h);
    }

    setupDrawingStyles() {
        this.ctx.globalCompositeOperation = 'overlay';
        this.ctx.strokeStyle = BA.randomColor(5, 255, 0.75, 0.75);
        this.ctx.fillStyle = BA.randomColor(5, 255, 0.015, 0.015);
        this.ctx.setLineDash([14, 6]);
        this.ctx.lineWidth = 2;
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.stagger = this.stagger % 3;

            if (this.stagger === 0) {
                this.ctx.moveTo(this.w / 2, this.h / 2);
                this.ctx.lineTo(this.vx2, this.vy2);
                this.ctx.stroke();
            }

            if (this.stagger === 1) {
                this.ctx.lineTo(this.vx3, this.vy3);
                this.ctx.stroke();
            }

            if (this.stagger === 2) {
                this.ctx.lineTo(this.vx1, this.vy1);
                this.ctx.stroke();

                this.ctx.beginPath();
                this.vx1 = BA.random(0, this.w);
                this.vx2 = BA.random(0, this.w);
                this.vx3 = BA.random(0, this.w);
                this.vy1 = BA.random(0, this.h);
                this.vy2 = BA.random(0, this.h);
                this.vy3 = BA.random(0, this.h);
            }

            this.stagger++;
        }

        if (this.t % (this.speed * 5) === 0) {
            this.ctx.fillRect(0, 0, this.w, this.h);
        }

        if (this.t % (this.speed * 70) === 0) {
            this.ctx.setLineDash([BA.random(1, 20), BA.random(7, 50)]);
            this.ctx.lineWidth = BA.random(1, 29);
        }

        if (this.t % (this.speed * 200) === 0) {
            this.ctx.fillStyle = BA.randomColor(5, 255, 0.015, 0.015);
        }

        if (this.t % (this.speed * 280) === 0) {
            this.ctx.strokeStyle = BA.randomColor(5, 255, 0.75, 0.75);
        }

        this.t++;

        requestAnimationFrame(this.draw);
    }
}
