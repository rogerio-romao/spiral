import BA from '../BaseAlgorithm.js';

export default class AngelHair extends BA {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.x1 = BA.random(0, this.w);
        this.y1 = BA.random(0, this.h);
        this.x2 = BA.random(0, this.w);
        this.y2 = BA.random(0, this.h);
        this.rotate = BA.random(2, 359);
        this.radius1 = BA.random(20, 300);
        this.radius2 = BA.random(20, 300);

        this.speed = 3;
    }

    setupDrawingStyles() {
        this.ctx.lineWidth = 0.25;
        this.ctx.setLineDash([1, 4]);
        this.ctx.strokeStyle = BA.randomColor(120, 255, 0.66, 0.95);
        this.ctx.globalCompositeOperation = 'hard-light';
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.stagger = this.stagger % 4;

            if (this.stagger === 0) {
                this.ctx.moveTo(this.y2, this.x1);
            }

            if (this.stagger === 1) {
                this.ctx.arcTo(
                    this.w / 2,
                    this.h,
                    this.x1,
                    this.y1,
                    this.radius1
                );
                this.ctx.stroke();
            }

            if (this.stagger === 2) {
                this.ctx.arcTo(
                    this.w,
                    this.h / 2,
                    this.x2,
                    this.y2,
                    this.radius2
                );
                this.ctx.stroke();
            }

            if (this.stagger === 3) {
                this.ctx.translate(this.w / 2, this.h / 2);
                this.ctx.rotate(this.rotate);
                this.ctx.translate(-this.w / 2, -this.h / 2);
            }
        }

        if (this.t % (this.speed * 360) === 0) {
            this.x1 = BA.random(0, this.w);
            this.y1 = BA.random(0, this.h);
            this.x2 = BA.random(0, this.w);
            this.y2 = BA.random(0, this.h);
            this.radius1 = BA.random(20, 300);
            this.radius2 = BA.random(20, 300);
            this.rotate = (BA.random(2, 359) * Math.PI) / 180;

            if (Math.random() < 0.075) {
                this.ctx.strokeStyle = 'white';
            } else {
                this.ctx.strokeStyle = BA.randomColor(120, 255, 0.66, 0.95);
            }
            this.ctx.beginPath();
        }

        this.stagger++;

        this.t++;

        requestAnimationFrame(this.draw);
    }
}
