import AL from '../AlgorithmLoader.js';

export default class TheFan extends AL {
    constructor() {
        super();

        this.name = 'The Fan';

        this.initializeProperties();
        this.setupConstantStyles();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeProperties() {
        this.rotate = AL.random(1, 359);
        this.x1 = AL.random(0, AL.w / 2);
        this.y1 = AL.random(0, AL.h / 2);
        this.ox = AL.random(0, AL.w / 2);
        this.oy = AL.random(0, AL.h / 2);
        this.x2 = AL.random(AL.w / 2, AL.w);
        this.y2 = AL.random(AL.h / 2, AL.h);
        this.dx = AL.random(AL.w / 2, AL.w);
        this.dy = AL.random(AL.h / 2, AL.h);
    }

    setupConstantStyles() {
        AL.ctx.globalCompositeOperation = 'luminosity';
        AL.ctx.filter = 'saturate(500%)';
        AL.ctx.shadowColor = 'black';
        AL.ctx.shadowBlur = 4;
    }

    setupDrawingStyles() {
        AL.ctx.strokeStyle = AL.randomColor();
    }

    draw() {
        if (this.t % this.speed === 0) {
            AL.ctx.moveTo(this.ox, this.oy);
            AL.ctx.bezierCurveTo(this.x1, this.y1, this.x2, this.y2, this.dx, this.dy);

            this.ox += 1;
            this.dy += 1;

            AL.ctx.stroke();
        }

        this.t += 1;

        this.rotateCanvasRadians(this.rotate);

        if (this.t % (this.speed * 240) === 0) {
            this.initializeProperties();
            this.setupDrawingStyles();
            AL.ctx.beginPath();
        }

        this.requestFrame();
    }
}
