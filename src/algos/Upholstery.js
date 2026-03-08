import AL from '../AlgorithmLoader.js';

export default class Upholstery extends AL {
    constructor() {
        super();

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
        this.x1 = AL.random(0, AL.w);
        this.y1 = AL.random(0, AL.h);
        this.x2 = AL.random(0, AL.w);
        this.y2 = AL.random(0, AL.h);
    }

    setupConstantStyles() {
        AL.ctx.globalCompositeOperation = 'overlay';
    }

    setupDrawingStyles() {
        AL.ctx.strokeStyle = AL.randomColor(50, 255, 1, 1);
        AL.ctx.setLineDash([this.dash1, this.dash2, this.dash3]);
    }

    draw() {
        if (this.t % this.speed === 0) {
            AL.ctx.moveTo(this.x1, this.y1);
            AL.ctx.lineTo(this.x2, this.y2);
            AL.ctx.stroke();
        }

        this.t += 1;

        this.rotateCanvasRadians(this.rotate);

        if (this.t % (this.speed * 120) === 0) {
            this.initializeProperties();
            this.setupDrawingStyles();
            AL.ctx.beginPath();
        }

        this.requestFrame();
    }
}
