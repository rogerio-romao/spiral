import AL from '../AlgorithmLoader.js';

export default class Upholstery extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.name = 'Upholstery';

        this.initializeProperties();
        this.setupConstantStyles();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeProperties() {
        this.dash1 = AL.random(1, 15);
        this.dash3 = AL.random(1, 50);
        this.dash2 = AL.random(20, 40);
        this.rotate = AL.random(1, 55);
        this.x1 = AL.random(0, this.w);
        this.y1 = AL.random(0, this.h);
        this.x2 = AL.random(0, this.w);
        this.y2 = AL.random(0, this.h);
    }

    setupConstantStyles() {
        this.ctx.globalCompositeOperation = 'overlay';
    }

    setupDrawingStyles() {
        this.ctx.strokeStyle = AL.randomColor(50, 255, 1, 1);
        this.ctx.setLineDash([this.dash1, this.dash2, this.dash3]);
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.moveTo(this.x1, this.y1);
            this.ctx.lineTo(this.x2, this.y2);
            this.ctx.stroke();
        }

        this.t += 1;

        this.rotateCanvasRadians(this.rotate);

        if (this.t % (this.speed * 120) === 0) {
            this.initializeProperties();
            this.setupDrawingStyles();
            this.ctx.beginPath();
        }

        this.requestFrame();
    }
}
