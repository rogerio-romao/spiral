import AL from '../AlgorithmLoader.js';

export default class Maelstrom extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.name = 'Maelstrom';

        this.initializeProperties();
        this.setupConstantStyles();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeProperties() {
        this.cp1 = AL.random(0, this.w);
        this.cp2 = AL.random(0, this.h);
        this.x1 = AL.random(0, this.w);
        this.y1 = AL.random(0, this.h);
        this.angle = AL.random(1, 200);
    }

    setupConstantStyles() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.225)';
        this.ctx.lineWidth = 2;
    }

    setupDrawingStyles() {
        this.ctx.strokeStyle = AL.randomColor(0, 255, 0.7, 1);
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.moveTo(this.w / 2, this.h / 2);
            this.ctx.quadraticCurveTo(this.cp1, this.cp2, this.x1++, this.y1++);
            this.ctx.stroke();

            this.rotateCanvasDegrees(this.angle);
        }

        this.t += 1;

        if (this.t % (this.speed * 300) === 0) {
            this.initializeProperties();
            this.setupDrawingStyles();
            this.fillScreen();
            this.ctx.beginPath();
        }

        this.requestFrame();
    }
}
