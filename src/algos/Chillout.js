import AL from '../AlgorithmLoader.js';

export default class Chillout extends AL {
    constructor() {
        super();

        this.name = 'Chillout';

        this.initializeProperties();
        this.setupConstantStyles();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeProperties() {
        this.x1 = AL.random(0, AL.w);
        this.y1 = AL.random(0, AL.h);
        this.x2 = AL.random(0, AL.w);
        this.y2 = AL.random(0, AL.h);
        this.x3 = AL.random(0, AL.w);
        this.y3 = AL.random(0, AL.h);
        this.rotate = AL.random(1, 10);
    }

    setupConstantStyles() {
        AL.ctx.filter = 'saturate(17.5%)';
    }

    setupDrawingStyles() {
        AL.ctx.lineWidth = AL.random(1, 5);
        AL.ctx.strokeStyle = AL.randomColor(0, 255, 0.4, 1);
    }

    draw() {
        if (this.t % this.speed === 0) {
            AL.ctx.moveTo(this.x3, this.y3);
            AL.ctx.quadraticCurveTo(this.x2, this.y2, this.x1, this.y1);
            AL.ctx.stroke();

            this.rotateCanvasRadians(this.rotate);
        }

        this.t += 1;

        if (this.t % (this.speed * 80) === 0) {
            this.initializeProperties();
            this.setupDrawingStyles();

            AL.ctx.beginPath();
        }

        this.requestFrame();
    }
}
