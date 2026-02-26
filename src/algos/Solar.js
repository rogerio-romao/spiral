import AL from '../AlgorithmLoader.js';

export default class Solar extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.name = 'Solar';

        this.initializeProperties();
        this.setupConstantStyles();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeProperties() {
        this.x1 = AL.random(0, this.w);
        this.y1 = AL.random(0, this.h);
        this.x2 = AL.random(0, this.w);
        this.y2 = AL.random(0, this.h);
        this.rotate = AL.random(1, 359);
    }

    setupConstantStyles() {
        this.ctx.globalCompositeOperation = 'hard-light';
        this.colors = AL.generateHSLAPalette(7, 'random');
        this.colorIndex = 0;
    }

    setupDrawingStyles() {
        this.ctx.strokeStyle = this.colors[this.colorIndex];
        this.ctx.lineWidth = AL.random(1, 4);
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.moveTo(0, 0);
            this.ctx.bezierCurveTo(
                this.x1,
                this.y1,
                this.x2,
                this.y2,
                this.w,
                this.h,
            );
            this.ctx.stroke();
        }

        this.t++;

        this.rotateCanvasRadians(this.rotate);

        if (this.t % (this.speed * 120) === 0) {
            this.colorIndex = (this.colorIndex + 1) % this.colors.length;
            this.initializeProperties();
            this.setupDrawingStyles();
            this.ctx.beginPath();
        }

        this.requestFrame();
    }
}
