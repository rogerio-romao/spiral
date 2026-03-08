import AL from '../AlgorithmLoader.js';

export default class Geometer extends AL {
    constructor() {
        super();

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
        AL.ctx.strokeStyle = AL.randomColor();
        AL.ctx.lineWidth = AL.random(2, 7);
        AL.ctx.shadowColor = 'black';
        AL.ctx.shadowBlur = 1;
    }

    draw() {
        if (this.t % this.speed === 0) {
            AL.ctx.lineTo(AL.w / 2 + this.change, AL.h / 2 + this.change);
            AL.ctx.stroke();

            this.change += this.rate;
            if (Math.abs(this.change + this.rate) > Math.max(AL.w / 2, AL.h / 2)) {
                this.rate = -this.rate;
            }

            this.rotateCanvasRadians(this.rotate);
        }

        this.t += 1;

        if (this.t % (this.speed * 180) === 0) {
            this.initializeProperties();

            AL.ctx.beginPath();
            AL.ctx.lineWidth = AL.random(2, 7);

            const color = Math.random();
            if (color < 0.2) {
                AL.ctx.strokeStyle = 'white';
                AL.ctx.shadowColor = 'black';
            } else if (color < 0.4) {
                AL.ctx.strokeStyle = 'black';
                AL.ctx.shadowColor = 'white';
            } else {
                AL.ctx.strokeStyle = AL.randomColor();
                AL.ctx.shadowColor = 'black';
            }
        }

        this.requestFrame();
    }
}
