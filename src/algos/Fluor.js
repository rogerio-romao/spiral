import AL from '../AlgorithmLoader.js';

export default class Fluor extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.name = 'Fluor';

        this.initializeProperties();
        this.setupConstantStyles();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeProperties() {
        this.rotate = AL.random(1, 359);
        this.x1 = AL.random(0, this.w);
        this.y1 = AL.random(0, this.h);
        this.x2 = AL.random(0, this.w);
        this.y2 = AL.random(0, this.h);
        this.ox = AL.random(0, this.w);
        this.oy = AL.random(0, this.h);
        this.dx = AL.random(0, this.w);
        this.dy = AL.random(0, this.h);
    }

    setupConstantStyles() {
        this.ctx.globalCompositeOperation = 'overlay';
        this.ctx.shadowBlur = 4;
        this.ctx.lineWidth = 2;
    }

    setupDrawingStyles() {
        this.ctx.strokeStyle = this.ctx.shadowColor = AL.randomColor();
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.moveTo(this.ox, this.oy);
            this.ctx.bezierCurveTo(
                this.x1,
                this.y1,
                this.x2,
                this.y2,
                this.dx,
                this.dy
            );
            this.ctx.stroke();
        }

        this.t++;

        this.rotateCanvasDegrees(this.rotate);

        if (this.t % (this.speed * 180) === 0) {
            this.initializeProperties();
            this.setupDrawingStyles();
            this.ctx.beginPath();
        }

        this.requestFrame();
    }
}
