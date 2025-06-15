import AL from '../AlgorithmLoader.js';

export default class Comets extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.change = 0;
        this.rate = AL.random(1, 7);
        this.rotate = AL.random(3, 13);

        this.speed = 1;
    }

    setupDrawingStyles() {
        this.ctx.shadowColor = this.ctx.strokeStyle = AL.randomColor();
        this.ctx.lineWidth = AL.random(3, 12);
        this.ctx.shadowBlur = this.ctx.lineWidth;
        this.ctx.beginPath();
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.stagger = this.stagger % 4;

            if (this.stagger === 0) {
                this.ctx.lineTo(this.w / 2 + this.change, this.h / 2);
            }

            if (this.stagger === 1) {
                this.ctx.stroke();
            }

            if (this.stagger === 2) {
                this.change += this.rate;
                this.ctx.translate(this.w / 2, this.h / 2);
                this.ctx.rotate((this.rotate * Math.PI) / 180);
                this.ctx.translate(-this.w / 2, -this.h / 2);
            }
        }

        if (this.t % (this.speed * 720) === 0) {
            this.change = 0;
            this.rate = AL.random(1, 7);
            this.rotate = AL.random(3, 13);

            this.ctx.lineWidth = AL.random(3, 12);
            this.ctx.shadowBlur = this.ctx.lineWidth;
            this.ctx.beginPath();
            this.ctx.shadowColor = this.ctx.strokeStyle = AL.randomColor();
        }

        this.stagger++;

        this.t++;

        requestAnimationFrame(this.draw);
    }
}
