import AL from '../AlgorithmLoader.js';

export default class Warp2001 extends AL {
    constructor() {
        super();

        this.name = 'Warp 2001';

        this.initializeBaseProperties();
        this.initializeProperties();
        this.setupConstantStyles();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeBaseProperties() {
        this.x = 1;
        this.y = 1;
    }

    initializeProperties() {
        this.rotate = (AL.random(5, 355) * Math.PI) / 180;
    }

    setupConstantStyles() {
        AL.ctx.shadowBlur = 3;
        AL.ctx.shadowColor = 'black';
    }

    setupDrawingStyles() {
        AL.ctx.lineWidth = AL.random(5, 45);
        AL.ctx.strokeStyle = AL.randomColor();
    }

    draw() {
        if (this.t % this.speed === 0) {
            AL.ctx.translate(AL.w / 2, AL.h / 2);
            AL.ctx.moveTo(this.x, this.y);
            this.x *= 1.618;
            this.y *= 1.618;
            if (this.x >= Math.max(AL.w, AL.h)) {
                this.x = 1;
                this.y = 1;
            }
            AL.ctx.lineTo(this.x, this.y);
            AL.ctx.stroke();
            AL.ctx.rotate(this.rotate);
            AL.ctx.translate(-AL.w / 2, -AL.h / 2);
        }

        this.t += 1;

        if (this.t % (this.speed * 180) === 0) {
            this.initializeProperties();
            this.setupDrawingStyles();
            AL.ctx.beginPath();
        }

        this.requestFrame();
    }
}
