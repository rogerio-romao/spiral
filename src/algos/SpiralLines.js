import AL from '../AlgorithmLoader.js';

export default class SpiralLines extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.name = 'Spiral Lines';

        this.initializeProperties();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeProperties() {
        this.cycles = 1;
        this.bw = Math.random();
        this.gap = AL.random(4, 100);
        this.rotate = AL.random(1, 359);
        this.radius = AL.random(10, this.h);
        this.length = AL.random(50, Math.min(this.w, this.h) / 1.5);
    }

    setupDrawingStyles() {
        this.ctx.strokeStyle = AL.randomColor(5, 255, 0.5, 0.5);
        this.ctx.moveTo(this.w / 2, this.h / 2);
        this.ctx.lineWidth = AL.random(1, 8);
        this.ctx.beginPath();
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.stagger %= 3;

            if (this.stagger === 0) {
                this.ctx.moveTo(
                    this.w / 2 - this.radius - this.length / 2,
                    this.h / 2 + this.length / 2,
                );
                this.ctx.lineTo(
                    this.w / 2 - this.radius - this.length / 2,
                    this.h / 2 - this.length / 2,
                );
                this.ctx.stroke();
            }

            if (this.stagger === 1) {
                this.ctx.lineTo(
                    this.w / 2 - this.radius - this.length,
                    this.h / 2,
                );
                this.ctx.stroke();
            }

            if (this.stagger === 2) {
                this.ctx.lineTo(
                    this.w / 2 - this.radius - this.length / 2,
                    this.h / 2 + this.length / 2,
                );
                this.ctx.stroke();
            }

            this.rotateCanvasDegrees(this.rotate);

            this.length += this.gap;
            if (this.length > Math.max(this.w, this.h)) {
                this.cycles += 1;
                this.length = this.gap;

                this.ctx.beginPath();
                this.ctx.strokeStyle = AL.randomColor(5, 255, 0.5, 0.5);
                this.ctx.arc(this.w / 2, this.h / 2, this.radius, 0, 360);

                this.bw = Math.random();
                this.radius = AL.random(5, 65);
                this.gap = AL.random(2, 30);
            }
        }

        this.t += 1;

        if (this.cycles % 9 === 0) {
            this.bw < 0.5
                ? (this.ctx.strokeStyle = 'rgba(255,255,255, .75)')
                : (this.ctx.strokeStyle = 'rgba(0,0,0, .75)');
        }

        this.requestFrame();
    }
}
