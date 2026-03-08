import AL from '../AlgorithmLoader.js';

export default class Nebulas extends AL {
    constructor() {
        super();

        this.name = 'Nebulas';

        this.initializeProperties();
        this.setupConstantStyles();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeProperties() {
        this.gap = AL.random(4, 100);
        this.rotate = AL.random(3, 160);
        this.length = AL.random(50, Math.min(AL.w, AL.h) / 1.5);
    }

    setupConstantStyles() {
        AL.ctx.shadowBlur = 15;
        AL.ctx.shadowOffsetX = 5;
        AL.ctx.shadowOffsetY = 5;
        AL.ctx.shadowColor = 'rgba(255,255,255,0.7)';
    }

    setupDrawingStyles() {
        AL.ctx.fillStyle = AL.ctx.strokeStyle = AL.randomColor(5, 255, 0.02, 0.02);
    }

    draw() {
        if (this.t % this.speed === 0) {
            AL.ctx.lineWidth = AL.random(1, 200);
            AL.ctx.strokeRect(AL.w / 2, AL.h / 2, this.length, this.gap);

            this.rotateCanvasRadians(this.rotate);

            this.length = AL.random(10, Math.max(AL.w, AL.h));
            this.rotate = AL.random(3, 160);
            this.gap += AL.random(2, 10);
            if (this.gap > 1000) {
                this.gap = 1;
            }
        }

        this.t += 1;

        if (this.t % (this.speed * 10) === 0) {
            AL.ctx.fillRect(AL.random(0, AL.w), AL.random(0, AL.h), this.gap, this.gap);
        }

        if (this.t % (this.speed * 70) === 0) {
            this.rotate = -this.rotate;

            this.setupDrawingStyles();
        }

        this.requestFrame();
    }
}
