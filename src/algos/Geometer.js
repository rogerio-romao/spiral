import AL from '../AlgorithmLoader.js';

export default class Geometer extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.name = 'Geometer';

        this.initializeProperties();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeProperties() {
        this.change = 0;
        this.rate = AL.random(25, 250);
        this.rotate = AL.random(23, 179);
    }

    setupDrawingStyles() {
        this.ctx.strokeStyle = AL.randomColor();
        this.ctx.lineWidth = AL.random(2, 7);
        this.ctx.shadowColor = 'black';
        this.ctx.shadowBlur = 1;
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.lineTo(this.w / 2 + this.change, this.h / 2 + this.change);
            this.ctx.stroke();

            this.change += this.rate;
            if (
                Math.abs(this.change + this.rate) >
                Math.max(this.w / 2, this.h / 2 || this.change + this.rate <= 0)
            ) {
                this.rate = -this.rate;
            }

            this.rotateCanvasRadians(this.rotate);
        }

        this.t += 1;

        if (this.t % (this.speed * 180) === 0) {
            this.initializeProperties();

            this.ctx.beginPath();
            this.ctx.lineWidth = AL.random(2, 7);

            const color = Math.random();
            if (color < 0.2) {
                this.ctx.strokeStyle = 'white';
                this.ctx.shadowColor = 'black';
            } else if (color < 0.4) {
                this.ctx.strokeStyle = 'black';
                this.ctx.shadowColor = 'white';
            } else {
                this.ctx.strokeStyle = AL.randomColor();
                this.ctx.shadowColor = 'black';
            }
        }

        this.requestFrame();
    }
}
