import AL from '../AlgorithmLoader.js';

export default class Gridlock extends AL {
    constructor() {
        super();

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
        AL.ctx.strokeStyle = 'white';
        AL.ctx.moveTo(this.gap, this.gap);
    }

    draw() {
        if (this.t % this.speed === 0) {
            AL.ctx.lineTo(this.gap, AL.h - this.gap);
            AL.ctx.stroke();
            AL.ctx.lineTo(AL.w - this.gap, AL.h - this.gap);
            AL.ctx.stroke();
            AL.ctx.lineTo(AL.w - this.gap, this.gap);
            AL.ctx.stroke();
            AL.ctx.lineTo(this.gap + this.increment, this.gap);
            AL.ctx.stroke();

            this.gap += this.increment;
        }

        this.t += 1;

        if (this.t % (this.speed * 150) === 0) {
            this.rotateCanvasRadians(AL.random(1, 99));

            this.gap = AL.random(5, 70);
            this.increment = this.gap;

            this.isWhite = !this.isWhite;
            AL.ctx.strokeStyle = this.isWhite ? 'white' : 'black';

            AL.ctx.lineWidth = AL.random(1, 7);
            AL.ctx.beginPath();
        }

        this.requestFrame();
    }
}
