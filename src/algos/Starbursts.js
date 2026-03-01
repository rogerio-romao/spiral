import AL from '../AlgorithmLoader.js';

export default class Starbursts extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.name = 'Starbursts';

        this.initializeProperties();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeProperties() {
        this.length = AL.random(50, Math.min(this.w, this.h) / 1.5);
        this.startAngle = AL.random(0, 100);
        this.endAngle = AL.random(101, 360);
        this.rotate = AL.random(1, 6);
        this.maxLength = this.length;
        this.gap = AL.random(4, 120);
        this.maxGap = this.gap;
    }

    setupDrawingStyles() {
        this.ctx.strokeStyle = AL.randomColor(5, 255, 0.8, 0.8);
        this.ctx.fillStyle = AL.randomColor(5, 255, 0.1, 0.1);
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.stagger %= 3;

            if (this.stagger === 0) {
                this.ctx.arc(
                    this.w / 2,
                    this.h / 2 - this.length,
                    this.maxGap / 2,
                    this.startAngle,
                    this.endAngle,
                );
            }

            if (this.stagger === 1) {
                this.ctx.lineTo(
                    this.w / 2 + this.length,
                    this.h / 2 - this.length,
                );
            }

            if (this.stagger === 2) {
                this.ctx.beginPath();
                this.ctx.arc(
                    this.w / 2 + this.length,
                    this.h / 2 - 2 * this.length,
                    this.maxGap,
                    this.startAngle,
                    this.endAngle,
                );
                this.ctx.fill();
            }

            this.ctx.stroke();
            this.rotateCanvasRadians(this.rotate);

            this.length -= this.gap;
            if (this.length < -this.maxLength) {
                this.length = AL.random(7, 100);
                this.maxLength = 2 * this.length;
                this.gap = AL.random(2, 30);
                this.maxGap = 2 * this.gap;
            }

            this.stagger++;
        }

        this.t++;

        if (this.t % (this.speed * 420) === 0) {
            this.ctx.closePath();
            this.ctx.beginPath();
            this.setupDrawingStyles();
            if (Math.random() < 0.15) {
                this.ctx.fillStyle = 'rgb(0,0,0)';
            }
            this.rotateCanvasRadians(Math.random() * Math.PI);
        }

        this.requestFrame();
    }
}
