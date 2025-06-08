import BA from '../BaseAlgorithm.js';

export default class PietriDish extends BA {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.y = 0;
        this.x = 0;
        this.size = BA.random(15, 115);
        this.rotate = BA.random(1, 90);
    }

    setupDrawingStyles() {
        this.ctx.globalCompositeOperation = 'overlay';
        this.ctx.shadowColor = BA.randomColor(100, 255, 0.75, 1);
        this.ctx.fillStyle = BA.randomColor();
        this.ctx.strokeStyle = BA.randomColor();
        this.ctx.lineWidth = BA.random(2, 18);
        this.ctx.shadowBlur = 35;
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.beginPath();
            this.ctx.arc(
                this.x - this.size / 2,
                this.y - this.size / 2,
                this.size / 2,
                0,
                2 * Math.PI
            );
            this.ctx.stroke();
            this.ctx.fill();

            this.x += this.size;
            if (this.x > this.w) {
                this.x = 0;
                this.y += this.size;
            }
            if (this.y > this.h) {
                this.x = 0;
                this.y = 0;
                this.size = BA.random(15, 115);
            }
        }

        if (this.t % (this.speed * 150) === 0) {
            this.rotate = BA.random(1, 90);

            if (Math.random() < 0.2) {
                this.ctx.fillStyle = 'black';
            } else {
                this.ctx.fillStyle = BA.randomColor();
            }

            this.ctx.lineWidth = BA.random(2, 18);
            this.ctx.shadowColor = BA.randomColor(100, 255, 0.75, 1);
        }

        if (this.t % (this.speed * 450) === 0) {
            this.ctx.beginPath();
            this.size = BA.random(15, 85);
            this.ctx.strokeStyle = BA.randomColor();
        }

        this.ctx.translate(this.w / 2, this.h / 2);
        this.ctx.rotate((this.rotate * Math.PI) / 180);
        this.ctx.translate(-this.w / 2, -this.h / 2);

        this.t++;

        requestAnimationFrame(this.draw);
    }
}
