import BA from '../BaseAlgorithm.js';

export default class Spinner extends BA {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.color1 = BA.randomColor(0, 255, 1, 1);
        this.color2 = BA.randomColor(0, 255, 1, 1);
        this.side = Math.min(this.w, this.h);
        this.gap1 = BA.random(15, 150);
        this.gap2 = BA.random(-150, -15);
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.translate(this.w / 2, this.h / 2);
            this.ctx.rotate((this.gap1 * Math.PI) / 180);
            this.ctx.lineWidth = 2;
            this.ctx.globalCompositeOperation = 'hard-light';
            this.ctx.globalAlpha = 0.08;
            this.ctx.shadowColor = this.ctx.fillStyle = this.color1;
            this.ctx.shadowBlur = 8;
            this.ctx.fillRect(
                this.w / 2 - this.side / 2,
                this.h / 2 - this.side / 2,
                this.side,
                this.side
            );

            this.ctx.translate(-this.w / 2, -this.h / 2);
            this.ctx.lineWidth = 3;
            this.ctx.globalAlpha = 0.2;
            this.ctx.shadowBlur = 0;
            this.ctx.globalCompositeOperation = 'difference';
            this.ctx.fillStyle = this.color2;
            this.ctx.fillRect(
                this.w / 2,
                this.h / 2,
                this.gap1 * 2,
                this.gap2 * 2
            );
        }

        if (this.t % (this.speed * 50) === 0) {
            this.side = BA.random(200, Math.max(this.w, this.h) / 2);
            this.gap1 = BA.random(15, 150);
            this.gap2 = BA.random(-150, -15);
            this.color2 = BA.randomColor(0, 255, 1, 1);
        }

        if (this.t % (this.speed * 100) === 0) {
            this.ctx.beginPath();
            this.color1 = BA.randomColor(0, 255, 1, 1);
        }

        this.t++;

        requestAnimationFrame(this.draw);
    }
}
