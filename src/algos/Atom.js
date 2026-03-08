import AL from '../AlgorithmLoader.js';

export default class Atom extends AL {
    constructor() {
        super();

        this.name = 'Atom';

        this.initializeProperties();
        this.setupConstantStyles();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeProperties() {
        this.change = 0;
        this.rate = AL.random(5, 105);
        this.rotate = AL.random(5, 24);
    }

    setupConstantStyles() {
        AL.ctx.shadowColor = 'black';
        AL.ctx.shadowBlur = 2;
        AL.ctx.lineWidth = 5;
    }

    setupDrawingStyles() {
        AL.ctx.strokeStyle = AL.randomColor(65, 255, 0.5, 1);
    }

    draw() {
        if (this.t % this.speed === 0) {
            AL.ctx.lineTo(AL.w / 2 + this.change, AL.h / 2);
            AL.ctx.stroke();

            this.change += this.rate;
            if (Math.abs(this.change) > Math.max(AL.w / 2, AL.h / 2)) {
                this.rate = -this.rate;
            }

            this.rotateCanvasDegrees(this.rotate);
        }

        this.t += 1;

        if (this.t % (this.speed * 450) === 0) {
            this.initializeProperties();
            this.setupDrawingStyles();
            AL.ctx.beginPath();
        }

        this.requestFrame();
    }
}
