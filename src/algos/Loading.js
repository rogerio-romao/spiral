import AL from '../AlgorithmLoader.js';

export default class Loading extends AL {
    constructor() {
        super();

        this.name = 'Loading';

        this.initializeBaseProperties();
        this.initializeProperties();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeBaseProperties() {
        this.counterClockwise = false;
        this.color = AL.randomColor(120, 230, 1, 1);
    }

    initializeProperties() {
        this.rotate = AL.random(2, 45);
        this.width1 = AL.random(4, 51);
        this.width2 = AL.random(4, 51);
        this.radius = AL.random(30, Math.max(AL.w, AL.h) / 2);
    }

    setupDrawingStyles() {
        AL.ctx.fillStyle = 'black';
        this.fillScreen();
    }

    draw() {
        AL.ctx.lineWidth = this.t % 2 ? this.width1 : this.width2;
        AL.ctx.strokeStyle = this.t % 2 ? 'black' : this.color;
        this.counterClockwise = this.t % 2 === 1;
        AL.ctx.globalCompositeOperation = this.t % 2 ? 'source-over' : 'difference';

        if (this.t % this.speed === 0) {
            AL.ctx.beginPath();
            AL.ctx.arc(AL.w / 2, AL.h / 2, this.radius, 0, Math.PI, this.counterClockwise);
            AL.ctx.stroke();
        }

        this.t += 1;

        this.rotateCanvasDegrees(this.rotate);

        if (this.t % (this.speed * 45) === 0) {
            this.initializeProperties();
        }

        this.requestFrame();
    }
}
