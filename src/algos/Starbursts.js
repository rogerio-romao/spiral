import AL from '../AlgorithmLoader.js';

export default class Starbursts extends AL {
    constructor() {
        super();

        this.name = 'Starbursts';

        this.initializeProperties();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeProperties() {
        this.length = AL.random(50, Math.min(AL.w, AL.h) / 1.5);
        this.startAngle = AL.random(0, 100);
        this.endAngle = AL.random(101, 360);
        this.rotate = AL.random(1, 6);
        this.maxLength = this.length;
        this.gap = AL.random(4, 120);
        this.maxGap = this.gap;
    }

    setupDrawingStyles() {
        AL.ctx.strokeStyle = AL.randomColor(5, 255, 0.8, 0.8);
        AL.ctx.fillStyle = AL.randomColor(5, 255, 0.1, 0.1);
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.stagger %= 3;

            if (this.stagger === 0) {
                AL.ctx.arc(
                    AL.w / 2,
                    AL.h / 2 - this.length,
                    this.maxGap / 2,
                    this.startAngle,
                    this.endAngle,
                );
            }

            if (this.stagger === 1) {
                AL.ctx.lineTo(AL.w / 2 + this.length, AL.h / 2 - this.length);
            }

            if (this.stagger === 2) {
                AL.ctx.beginPath();
                AL.ctx.arc(
                    AL.w / 2 + this.length,
                    AL.h / 2 - 2 * this.length,
                    this.maxGap,
                    this.startAngle,
                    this.endAngle,
                );
                AL.ctx.fill();
            }

            AL.ctx.stroke();
            this.rotateCanvasRadians(this.rotate);

            this.length -= this.gap;
            if (this.length < -this.maxLength) {
                this.length = AL.random(7, 100);
                this.maxLength = 2 * this.length;
                this.gap = AL.random(2, 30);
                this.maxGap = 2 * this.gap;
            }

            this.stagger += 1;
        }

        this.t += 1;

        if (this.t % (this.speed * 420) === 0) {
            AL.ctx.closePath();
            AL.ctx.beginPath();
            this.setupDrawingStyles();
            if (Math.random() < 0.15) {
                AL.ctx.fillStyle = 'rgb(0,0,0)';
            }
            this.rotateCanvasRadians(Math.random() * Math.PI);
        }

        this.requestFrame();
    }
}
