import BA from '../BaseAlgorithm.js';

export default class BehindBars extends BA {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.rows = Math.ceil(this.h / 50) + 2;
        this.cols = Math.ceil(this.w / 50) + 2;
        this.rotate = BA.random(1, 60);
    }

    setupDrawingStyles() {
        this.ctx.strokeStyle = BA.randomColor();
        this.ctx.lineWidth = BA.random(3, 75);
        this.ctx.shadowColor = BA.randomColor();
        this.ctx.globalCompositeOperation = 'overlay';
        this.ctx.shadowBlur = this.ctx.lineWidth > 30 ? 30 : this.ctx.lineWidth;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'bevel';
    }

    draw() {
        if (this.t % this.speed === 0) {
            for (let i = 0; i <= this.rows; i++) {
                for (let j = 0; j <= this.cols; j++) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(200 * j - 200, 200 * i - 200);
                    this.ctx.lineTo(200 * j, 200 * i);
                    this.ctx.stroke();
                }
            }
        }

        if (this.t % (this.speed * 15) === 0) {
            this.ctx.globalCompositeOperation = 'overlay';
            this.ctx.strokeStyle = BA.randomColor();
            this.ctx.translate(this.w / 2, this.h / 2);
            this.ctx.rotate(this.rotate);
            this.ctx.translate(-this.w / 2, -this.h / 2);
        }

        if (this.t % (this.speed * 180) === 0) {
            this.rotate = BA.random(1, 60);

            this.ctx.globalCompositeOperation = 'source-over';
            this.ctx.lineWidth = BA.random(3, 75);
            this.ctx.shadowBlur =
                this.ctx.lineWidth > 30 ? 30 : this.ctx.lineWidth;
            this.ctx.shadowColor = BA.randomColor();
        }

        this.t++;

        requestAnimationFrame(this.draw);
    }
}
