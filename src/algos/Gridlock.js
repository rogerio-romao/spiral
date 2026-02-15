import AL from '../AlgorithmLoader.js';

export default class Gridlock extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.name = 'Gridlock';

        this.initializeProperties();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeProperties() {
        this.gap = AL.random(5, 70);
        this.increment = this.gap;
        this.isWhite = true;
    }

    setupDrawingStyles() {
        this.ctx.strokeStyle = 'white';
        this.ctx.moveTo(this.gap, this.gap);
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.lineTo(this.gap, this.h - this.gap);
            this.ctx.stroke();
            this.ctx.lineTo(this.w - this.gap, this.h - this.gap);
            this.ctx.stroke();
            this.ctx.lineTo(this.w - this.gap, this.gap);
            this.ctx.stroke();
            this.ctx.lineTo(this.gap + this.increment, this.gap);
            this.ctx.stroke();

            this.gap += this.increment;
        }

        this.t++;

        if (this.t % (this.speed * 150) === 0) {
            this.rotateCanvasRadians(AL.random(1, 99));

            this.gap = AL.random(5, 70);
            this.increment = this.gap;

            this.isWhite = !this.isWhite;
            if (this.isWhite) {
                this.ctx.strokeStyle = 'white';
            } else {
                this.ctx.strokeStyle = 'black';
            }

            this.ctx.lineWidth = AL.random(1, 7);
            this.ctx.beginPath();
        }

        this.requestFrame();
    }
}
