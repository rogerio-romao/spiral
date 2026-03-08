import AL from '../AlgorithmLoader.js';

export default class Solar extends AL {
    constructor() {
        super();

        this.name = 'Solar';

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
        this.rotate = AL.random(1, 359);
    }

    setupConstantStyles() {
        AL.ctx.globalCompositeOperation = 'hard-light';
        this.colors = AL.generateHSLAPalette(7, 'random');
        this.colorIndex = 0;
    }

    setupDrawingStyles() {
        AL.ctx.strokeStyle = this.colors[this.colorIndex];
        AL.ctx.lineWidth = AL.random(1, 4);
    }

    draw() {
        if (this.t % this.speed === 0) {
            AL.ctx.moveTo(0, 0);
            AL.ctx.bezierCurveTo(this.x1, this.y1, this.x2, this.y2, AL.w, AL.h);
            AL.ctx.stroke();
        }

        this.t += 1;

        this.rotateCanvasRadians(this.rotate);

        if (this.t % (this.speed * 120) === 0) {
            this.colorIndex = (this.colorIndex + 1) % this.colors.length;
            this.initializeProperties();
            this.setupDrawingStyles();
            AL.ctx.beginPath();
        }

        this.requestFrame();
    }
}
