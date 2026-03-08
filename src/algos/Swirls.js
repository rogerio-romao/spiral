import AL from '../AlgorithmLoader.js';

export default class Swirls extends AL {
    constructor() {
        super();

        this.name = 'Swirls';

        this.initializeProperties();
        this.setupConstantStyles();

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
        this.numColors = 7;
        this.colors = AL.generateHSLAPalette(this.numColors, 'hue');
        this.colorIndex = 0;
    }

    setupConstantStyles() {
        AL.ctx.lineWidth = 2;
        AL.ctx.shadowColor = 'rgba(5, 5, 5, 0.7)';
        AL.ctx.shadowBlur = 3;
    }

    draw() {
        if (this.t % this.speed === 0) {
            AL.ctx.moveTo(this.x3, this.y3);
            AL.ctx.quadraticCurveTo(this.x2, this.y2, this.x1, this.y1);
            AL.ctx.stroke();

            AL.ctx.strokeStyle = this.colors[this.colorIndex];
            this.colorIndex = (this.colorIndex + 1) % this.colors.length;

            this.rotateCanvasRadians(this.rotate);
        }

        this.t += 1;

        if (this.t % (this.speed * 240) === 0) {
            AL.ctx.closePath();
            this.initializeProperties();
            AL.ctx.beginPath();
        }

        if (this.t % (this.speed * 600) === 0) {
            this.colors = AL.generateHSLAPalette(this.numColors, 'hue');
        }

        this.requestFrame();
    }
}
