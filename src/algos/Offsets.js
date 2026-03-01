import AL from '../AlgorithmLoader.js';

export default class Offsets extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.name = 'Offsets';

        this.initializeProperties();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeProperties() {
        this.rotate = AL.random(7, 27);
        this.length = AL.random(20, Math.max(this.w, this.h));
    }

    setupDrawingStyles() {
        this.ctx.shadowBlur = 3;
        this.ctx.fillStyle = AL.randomColor();
        this.ctx.shadowColor = AL.randomColor();
        this.ctx.shadowOffsetX = AL.random(-200, 200);
        this.ctx.shadowOffsetY = AL.random(-200, 200);
        this.ctx.strokeStyle = AL.randomColor(0, 255, 0.1, 0.1);
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.stagger %= 2;

            if (this.stagger === 0) {
                this.ctx.lineTo(this.w / 2 - this.length, this.h / 2);
                this.ctx.stroke();
            }

            if (this.stagger === 1) {
                this.ctx.lineTo(this.w / 2, this.h / 2 - this.length);
                this.ctx.stroke();
            }

            this.rotateCanvasRadians(this.rotate);

            this.stagger += 1;
        }

        this.t += 1;

        if (this.t % (this.speed * 40) === 0) {
            this.ctx.fill();
            this.ctx.beginPath();
            this.ctx.fillStyle = AL.randomColor();
            this.length = AL.random(20, Math.max(this.w, this.h));
        }

        if (this.t % (this.speed * 200) === 0) {
            this.ctx.shadowColor = AL.randomColor();
            this.ctx.shadowOffsetX = AL.random(-200, 200);
            this.ctx.shadowOffsetY = AL.random(-200, 200);
        }

        if (this.t % (this.speed * 400) === 0) {
            this.ctx.strokeStyle = AL.randomColor(0, 255, 0.1, 0.1);
            this.rotate = AL.random(1, 37);
        }

        this.requestFrame();
    }
}
