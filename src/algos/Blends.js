import AL from '../AlgorithmLoader.js';

export default class Blends extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.name = 'Blends';

        this.initializeProperties();
        this.setupConstantStyles();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeProperties() {
        this.x = AL.random(0, this.w);
        this.y = AL.random(0, this.h);
        this.x2 = AL.random(0, this.w);
        this.y2 = AL.random(0, this.h);
        this.length = AL.random(30, 250);
        this.rotation = AL.random(2, 140);
        this.currentShape = AL.random(0, 3);
        this.color1 = AL.randomColor(0, 255, 0.025, 0.075);
        this.color2 = AL.randomColor(0, 255, 0.025, 0.075);
    }

    setupConstantStyles() {
        this.ctx.lineWidth = 3;
    }

    setupDrawingStyles() {
        this.ctx.strokeStyle = AL.randomColor();
    }

    draw() {
        if (this.t % this.speed === 0) {
            if (this.currentShape === 0) {
                this.ctx.fillStyle = this.color2;
                this.ctx.fillRect(this.x++, this.y, this.length++, this.length);
            } else if (this.currentShape === 1) {
                this.ctx.fillStyle = this.color1;
                this.ctx.beginPath();
                this.ctx.arc(this.x2, this.y2++, this.length, 0, 2 * Math.PI);
                this.ctx.fill();
            } else {
                this.ctx.strokeStyle = this.color2;
                this.ctx.beginPath();
                this.ctx.moveTo(this.x, this.y);
                this.ctx.lineTo(this.x2, this.y2);
                this.ctx.stroke();
            }

            this.currentShape = AL.random(0, 3);

            this.rotateCanvasDegrees(this.rotation);
        }

        this.t++;

        if (this.t % (this.speed * 270) === 0) {
            this.initializeProperties();
            this.setupDrawingStyles();
            this.ctx.beginPath();
        }

        this.requestFrame();
    }
}
