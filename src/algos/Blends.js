import AL from '../AlgorithmLoader.js';

export default class Blends extends AL {
    constructor() {
        super();

        this.name = 'Blends';

        this.initializeProperties();
        this.setupConstantStyles();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeProperties() {
        this.x = AL.random(0, AL.w);
        this.y = AL.random(0, AL.h);
        this.x2 = AL.random(0, AL.w);
        this.y2 = AL.random(0, AL.h);
        this.length = AL.random(30, 250);
        this.rotation = AL.random(2, 140);
        this.currentShape = AL.random(0, 3);
        this.color1 = AL.randomColor(0, 255, 0.025, 0.075);
        this.color2 = AL.randomColor(0, 255, 0.025, 0.075);
    }

    setupConstantStyles() {
        AL.ctx.lineWidth = 3;
    }

    setupDrawingStyles() {
        AL.ctx.strokeStyle = AL.randomColor();
    }

    draw() {
        if (this.t % this.speed === 0) {
            if (this.currentShape === 0) {
                AL.ctx.fillStyle = this.color2;
                AL.ctx.fillRect(this.x, this.y, this.length, this.length);
            } else if (this.currentShape === 1) {
                AL.ctx.fillStyle = this.color1;
                AL.ctx.beginPath();
                AL.ctx.arc(this.x2, this.y2, this.length, 0, 2 * Math.PI);
                AL.ctx.fill();
            } else {
                AL.ctx.strokeStyle = this.color2;
                AL.ctx.beginPath();
                AL.ctx.moveTo(this.x, this.y);
                AL.ctx.lineTo(this.x2, this.y2);
                AL.ctx.stroke();
            }

            this.x += 1;
            this.y += 1;
            this.x2 -= 1;
            this.y2 -= 1;
            this.length += 1;

            this.currentShape = AL.random(0, 3);

            this.rotateCanvasDegrees(this.rotation);
        }

        this.t += 1;

        if (this.t % (this.speed * 270) === 0) {
            this.initializeProperties();
            this.setupDrawingStyles();
            AL.ctx.beginPath();
        }

        this.requestFrame();
    }
}
