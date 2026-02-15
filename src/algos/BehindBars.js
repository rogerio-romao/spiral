import AL from '../AlgorithmLoader.js';

export default class BehindBars extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.name = 'Behind Bars';

        this.initializeProperties();
        this.setupConstantStyles();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeProperties() {
        this.rows = Math.ceil(this.h / 50) + 2;
        this.cols = Math.ceil(this.w / 50) + 2;
        this.rotate = AL.random(1, 60);
    }

    setupConstantStyles() {
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'bevel';
    }

    setupBaseStyles() {
        this.ctx.strokeStyle = AL.randomColor();
        this.ctx.globalCompositeOperation = 'overlay';
    }

    setupDrawingStyles() {
        this.ctx.lineWidth = AL.random(3, 75);
        this.ctx.shadowColor = AL.randomColor();
        this.ctx.shadowBlur = Math.min(30, this.ctx.lineWidth);
    }

    draw() {
        if (this.t % this.speed === 0) {
            for (let i = 0; i <= this.rows; i++) {
                for (let j = 0; j <= this.cols; j++) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(200 * j - 200, 200 * i - 200);
                    this.ctx.lineTo(200 * j, 200 * i);
                    this.ctx.stroke();
                }
            }
        }

        this.t++;

        if (this.t % (this.speed * 15) === 0) {
            this.ctx.globalCompositeOperation = 'overlay';
            this.ctx.strokeStyle = AL.randomColor();

            this.rotateCanvasRadians(this.rotate);
        }

        if (this.t % (this.speed * 180) === 0) {
            this.rotate = AL.random(1, 60);

            this.ctx.globalCompositeOperation = 'source-over';
            this.setupDrawingStyles();
        }

        this.requestFrame();
    }
}
