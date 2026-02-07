import AL from '../AlgorithmLoader.js';

export default class Chillout extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.name = 'Chillout';

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
        this.rotate = AL.random(1, 10);
    }

    setupConstantStyles() {
        this.ctx.filter = 'saturate(17.5%)';
    }

    setupDrawingStyles() {
        this.ctx.lineWidth = AL.random(1, 5);
        this.ctx.strokeStyle = AL.randomColor(0, 255, 0.4, 1);
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.moveTo(this.x3, this.y3);
            this.ctx.quadraticCurveTo(this.x2, this.y2, this.x1, this.y1);
            this.ctx.stroke();

            this.rotateCanvasRadians(this.rotate);
        }

        this.t++;

        if (this.t % (this.speed * 80) === 0) {
            this.initializeProperties();
            this.setupDrawingStyles();

            this.ctx.beginPath();
        }

        requestAnimationFrame(this.draw);
    }
}
