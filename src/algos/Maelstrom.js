import AL from '../AlgorithmLoader.js';

export default class Maelstrom extends AL {
    constructor() {
        super();

        this.name = 'Maelstrom';

        this.initializeProperties();
        this.setupConstantStyles();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeProperties() {
        this.cp1 = AL.random(0, AL.w);
        this.cp2 = AL.random(0, AL.h);
        this.x1 = AL.random(0, AL.w);
        this.y1 = AL.random(0, AL.h);
        this.angle = AL.random(1, 200);
    }

    setupConstantStyles() {
        AL.ctx.fillStyle = 'rgba(0, 0, 0, 0.225)';
        AL.ctx.lineWidth = 2;
    }

    setupDrawingStyles() {
        AL.ctx.strokeStyle = AL.randomColor(0, 255, 0.7, 1);
    }

    draw() {
        if (this.t % this.speed === 0) {
            AL.ctx.moveTo(AL.w / 2, AL.h / 2);
            AL.ctx.quadraticCurveTo(this.cp1, this.cp2, this.x1, this.y1);
            AL.ctx.stroke();

            this.x1 += 1;
            this.y1 += 1;

            this.rotateCanvasDegrees(this.angle);
        }

        this.t += 1;

        if (this.t % (this.speed * 300) === 0) {
            this.initializeProperties();
            this.setupDrawingStyles();
            this.fillScreen();
            AL.ctx.beginPath();
        }

        this.requestFrame();
    }
}
