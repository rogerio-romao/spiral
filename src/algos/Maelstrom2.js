import AL from '../AlgorithmLoader.js';

export default class Maelstrom2 extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupConstantStyles();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.cp1 = AL.random(0, this.w);
        this.cp2 = AL.random(0, this.h);
        this.alter1 = AL.random(-5, 5);
        this.alter2 = AL.random(-5, 5);
        this.alter3 = AL.random(-5, 5);
        this.alter4 = AL.random(-5, 5);
        this.x1 = AL.random(0, this.w);
        this.y1 = AL.random(0, this.h);
        this.angle = AL.random(10, 350);
    }

    setupConstantStyles() {
        this.ctx.lineWidth = 0.5;
    }

    setupDrawingStyles() {
        this.ctx.strokeStyle = AL.randomColor(0, 255, 0.8, 1);
        this.ctx.fillStyle = AL.randomColor(0, 160, 0.05, 0.15);
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.moveTo(this.w / 2, this.h / 2);
            this.ctx.quadraticCurveTo(this.cp1, this.cp2, this.x1, this.y1);

            this.cp1 += this.alter1;
            if (this.cp1 > 2 * this.w || this.cp1 < -this.w) {
                this.alter1 = -this.alter1;
            }

            this.cp2 += this.alter2;
            if (this.cp2 > 2 * this.h || this.cp2 < -this.h) {
                this.alter2 = -this.alter2;
            }

            this.x1 += this.alter3;
            if (this.x1 > 2 * this.w || this.x1 < -this.w) {
                this.alter3 = -this.alter3;
            }

            this.y1 += this.alter4;
            if (this.y1 > 2 * this.h || this.y1 < -this.h) {
                this.alter4 = -this.alter4;
            }

            this.ctx.stroke();
            this.rotateCanvasDegrees(this.angle);
        }

        this.t++;

        if (this.t % (this.speed * 240) === 0) {
            this.initializeProperties();

            this.fillScreen();
            this.ctx.beginPath();

            this.setupDrawingStyles();
        }

        requestAnimationFrame(this.draw);
    }
}
