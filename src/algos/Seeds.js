import AL from '../AlgorithmLoader.js';

export default class Seeds extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.name = 'Seeds';

        this.initializeProperties();
        this.setupConstantStyles();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.x1 = AL.random(0, this.w);
        this.y1 = AL.random(0, this.h);
        this.x2 = AL.random(0, this.w);
        this.y2 = AL.random(0, this.h);
        this.x3 = AL.random(0, this.w);
        this.y3 = AL.random(0, this.h);
        this.rotate = AL.random(10, 101);
    }

    setupConstantStyles() {
        this.ctx.shadowBlur = 2;
    }

    setupDrawingStyles() {
        this.ctx.fillStyle =
            this.ctx.strokeStyle =
            this.ctx.shadowColor =
                AL.randomColor(40, 255, 0.65, 1);
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.beginPath();
            this.ctx.arc(this.x1++, this.y1--, 5, 0, 0.5 * Math.PI);
            this.ctx.stroke();
            this.ctx.fill();
            this.ctx.beginPath();
            this.ctx.arc(this.x2--, this.y2++, 10, 0, 0.5 * Math.PI);
            this.ctx.stroke();
            this.ctx.fill();
            this.ctx.beginPath();
            this.ctx.arc(this.x3++, this.y3, 15, 0, 0.5 * Math.PI);
            this.ctx.stroke();
            this.ctx.fill();
        }

        this.t++;

        this.rotateCanvasRadians(this.rotate);

        if (this.t % (this.speed * 360) === 0) {
            this.initializeProperties();
            this.setupDrawingStyles();
        }

        requestAnimationFrame(this.draw);
    }
}
