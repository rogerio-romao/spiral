import AL from '../AlgorithmLoader.js';

export default class Warp2001 extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeBaseProperties();
        this.initializeProperties();
        this.setupConstantStyles();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeBaseProperties() {
        this.x = 1;
        this.y = 1;
    }

    initializeProperties() {
        this.rotate = (AL.random(5, 355) * Math.PI) / 180;
    }

    setupConstantStyles() {
        this.ctx.shadowColor = 'black';
        this.ctx.shadowBlur = 3;
    }

    setupDrawingStyles() {
        this.ctx.strokeStyle = AL.randomColor();
        this.ctx.lineWidth = AL.random(5, 45);
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.translate(this.w / 2, this.h / 2);
            this.ctx.moveTo(this.x, this.y);
            this.x *= 1.618;
            this.y *= 1.618;
            if (this.x >= Math.max(this.w, this.h)) {
                this.x = 1;
                this.y = 1;
            }
            this.ctx.lineTo(this.x, this.y);
            this.ctx.stroke();
            this.ctx.rotate(this.rotate);
            this.ctx.translate(-this.w / 2, -this.h / 2);
        }

        this.t++;

        if (this.t % (this.speed * 180) === 0) {
            this.initializeProperties();
            this.setupDrawingStyles();
            this.ctx.beginPath();
        }

        requestAnimationFrame(this.draw);
    }
}
