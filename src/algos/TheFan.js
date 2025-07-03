import AL from '../AlgorithmLoader.js';

export default class TheFan extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupConstantStyles();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.x1 = AL.random(0, this.w / 2);
        this.y1 = AL.random(0, this.h / 2);
        this.x2 = AL.random(this.w / 2, this.w);
        this.y2 = AL.random(this.h / 2, this.h);
        this.ox = AL.random(0, this.w / 2);
        this.oy = AL.random(0, this.h / 2);
        this.dx = AL.random(this.w / 2, this.w);
        this.dy = AL.random(this.h / 2, this.h);
        this.rotate = AL.random(1, 359);
    }

    setupConstantStyles() {
        this.ctx.globalCompositeOperation = 'luminosity';
        this.ctx.filter = 'saturate(500%)';
        this.ctx.shadowColor = 'black';
        this.ctx.shadowBlur = 4;
    }

    setupDrawingStyles() {
        this.ctx.strokeStyle = AL.randomColor();
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.moveTo(this.ox++, this.oy);
            this.ctx.bezierCurveTo(
                this.x1,
                this.y1,
                this.x2,
                this.y2,
                this.dx,
                this.dy++
            );
            this.ctx.stroke();
        }

        this.t++;

        this.rotateCanvasRadians(this.rotate);

        if (this.t % (this.speed * 240) === 0) {
            this.initializeProperties();
            this.setupDrawingStyles();
            this.ctx.beginPath();
        }

        requestAnimationFrame(this.draw);
    }
}
