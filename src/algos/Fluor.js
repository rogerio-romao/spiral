import AL from '../AlgorithmLoader.js';

export default class Fluor extends AL {
    constructor() {
        super();

        this.name = 'Fluor';

        this.initializeProperties();
        this.setupConstantStyles();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeProperties() {
        this.rotate = AL.random(1, 359);
        this.x1 = AL.random(0, AL.w);
        this.y1 = AL.random(0, AL.h);
        this.x2 = AL.random(0, AL.w);
        this.y2 = AL.random(0, AL.h);
        this.ox = AL.random(0, AL.w);
        this.oy = AL.random(0, AL.h);
        this.dx = AL.random(0, AL.w);
        this.dy = AL.random(0, AL.h);
    }

    setupConstantStyles() {
        AL.ctx.globalCompositeOperation = 'overlay';
        AL.ctx.shadowBlur = 4;
        AL.ctx.lineWidth = 2;
    }

    setupDrawingStyles() {
        AL.ctx.strokeStyle = AL.ctx.shadowColor = AL.randomColor();
    }

    draw() {
        if (this.t % this.speed === 0) {
            AL.ctx.moveTo(this.ox, this.oy);
            AL.ctx.bezierCurveTo(this.x1, this.y1, this.x2, this.y2, this.dx, this.dy);
            AL.ctx.stroke();
        }

        this.t += 1;

        this.rotateCanvasDegrees(this.rotate);

        if (this.t % (this.speed * 180) === 0) {
            this.initializeProperties();
            this.setupDrawingStyles();
            AL.ctx.beginPath();
        }

        this.requestFrame();
    }
}
