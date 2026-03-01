import AL from '../AlgorithmLoader.js';

export default class Swirls extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.name = 'Swirls';

        this.initializeProperties();
        this.setupConstantStyles();

        this.requestFrame();
    }

    initializeProperties() {
        this.x1 = AL.random(0, this.w);
        this.y1 = AL.random(0, this.h);
        this.x2 = AL.random(0, this.w);
        this.y2 = AL.random(0, this.h);
        this.x3 = AL.random(0, this.w);
        this.y3 = AL.random(0, this.h);
        this.rotate = AL.random(1, 10);
        this.numColors = 7;
        this.mode = 'hue';
        this.colors = AL.generateHSLAPalette(this.numColors, this.mode);
        this.colorIndex = 0;
    }

    setupConstantStyles() {
        this.ctx.lineWidth = 2;
        this.ctx.shadowColor = 'rgba(5, 5, 5, 0.7)';
        this.ctx.shadowBlur = 3;
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.moveTo(this.x3, this.y3);
            this.ctx.quadraticCurveTo(this.x2, this.y2, this.x1, this.y1);
            this.ctx.stroke();

            this.ctx.strokeStyle = this.colors[this.colorIndex];
            this.colorIndex = (this.colorIndex + 1) % this.colors.length;

            this.rotateCanvasRadians(this.rotate);
        }

        this.t += 1;

        if (this.t % (this.speed * 240) === 0) {
            this.ctx.closePath();
            this.initializeProperties();
            this.ctx.beginPath();
        }

        if (this.t % (this.speed * 600) === 0) {
            this.colors = AL.generateHSLAPalette(this.numColors, this.mode);
        }

        this.requestFrame();
    }
}
