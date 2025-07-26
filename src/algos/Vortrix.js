import AL from '../AlgorithmLoader.js';

export default class Vortrix extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupConstantStyles();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.x = AL.random(0, this.w);
        this.y = AL.random(0, this.h);
        this.size = AL.random(60, 400);
        this.rotate = AL.random(1, 60);
    }

    setupConstantStyles() {
        this.ctx.shadowBlur = 10;
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    }

    setupDrawingStyles() {
        this.ctx.strokeStyle = this.ctx.shadowColor = AL.randomColor(
            0,
            255,
            0.5,
            1
        );
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.drawTriangle(this.x, this.y);
            this.size--;
        }

        this.t++;

        this.rotateCanvasRadians(this.rotate);

        if (this.t % (this.speed * 360) === 0) {
            this.initializeProperties();
            this.setupDrawingStyles();
        }

        requestAnimationFrame(this.draw);
    }

    drawTriangle(x, y) {
        this.ctx.moveTo(x, y);
        this.ctx.beginPath();
        this.ctx.lineTo(x + this.size, y);
        this.ctx.lineTo(x, y + this.size);
        this.ctx.lineTo(x, y);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
    }
}
