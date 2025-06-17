import AL from '../AlgorithmLoader.js';

export default class Atom extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.change = 0;
        this.rate = AL.random(5, 105);
        this.rotate = AL.random(5, 24);
    }

    setupDrawingStyles() {
        this.ctx.shadowBlur = 2;
        this.ctx.shadowColor = 'black';
        this.ctx.lineWidth = 5;
        this.ctx.strokeStyle = AL.randomColor(65, 255, 0.5, 1);
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.lineTo(this.w / 2 + this.change, this.h / 2);
            this.ctx.stroke();

            this.change += this.rate;
            if (
                Math.abs(this.change) >
                Math.max(this.w / 2, this.h / 2 || this.change + this.rate <= 0)
            ) {
                this.rate = -this.rate;
            }

            this.rotateCanvasRadians(this.rotate);
        }

        this.t++;

        if (this.t % (this.speed * 450) === 0) {
            this.initializeProperties();

            this.ctx.beginPath();
            this.ctx.strokeStyle = AL.randomColor(65, 255, 0.5, 1);
        }

        requestAnimationFrame(this.draw);
    }
}
