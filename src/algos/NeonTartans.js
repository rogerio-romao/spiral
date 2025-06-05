import BA from '../BaseAlgorithm.js';

export default class NeonTartans extends BA {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.lineX = BA.random(0, this.h);
        this.lineY = BA.random(0, this.w);
        this.length = BA.random(50, Math.min(this.w, this.h) / 1.5);
        this.color1 = BA.randomColor();
        this.color2 = BA.randomColor();
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.stagger = this.stagger % 3;

            if (this.stagger === 0) {
                this.ctx.beginPath();
                this.ctx.moveTo(0, this.lineX);
                this.ctx.lineTo(this.w, this.lineX);
                this.ctx.shadowBlur = 5;
                this.ctx.shadowColor = this.ctx.strokeStyle = this.color1;
                this.ctx.stroke();
            }

            if (this.stagger === 1) {
                this.ctx.beginPath();
                this.ctx.moveTo(this.lineY, 0);
                this.ctx.lineTo(this.lineY, this.h);
                this.ctx.shadowBlur = 0;
                this.ctx.shadowColor = this.ctx.strokeStyle = this.color2;
                this.ctx.stroke();
            }

            if (this.stagger === 2) {
                this.ctx.shadowBlur = 30;
                this.ctx.beginPath();
                this.ctx.lineWidth = 2;
                this.ctx.arc(
                    this.w / 2,
                    this.h / 2,
                    this.length,
                    this.length,
                    this.w,
                    this.h
                );
                this.ctx.stroke();
                this.ctx.lineWidth = 1;
            }

            this.stagger++;
        }

        if (this.t % (this.speed * 15) === 0) {
            this.ctx.translate(this.w / 2, this.h / 2);
            this.ctx.rotate((30 * Math.PI) / 180);
            this.ctx.translate(-this.w / 2, -this.h / 2);
            this.length = BA.random(30, this.h / 2);
        }

        if (this.t % (this.speed * 180) === 0) {
            this.color1 = BA.randomColor(0, 255, 1, 1);
            this.color2 = BA.randomColor(0, 255, 1, 1);
        }

        this.lineX = BA.random(0, this.h);
        this.lineY = BA.random(0, this.w);

        this.t++;

        requestAnimationFrame(this.draw);
    }
}
