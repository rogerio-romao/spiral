import AL from '../AlgorithmLoader.js';

export default class Maelstrom2 extends AL {
    constructor() {
        super();

        this.name = 'Maelstrom 2';

        this.initializeProperties();
        this.setupConstantStyles();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeProperties() {
        this.angle = AL.random(10, 350);
        this.cp1 = AL.random(0, AL.w);
        this.cp2 = AL.random(0, AL.h);
        this.alter1 = AL.random(-5, 5);
        this.alter2 = AL.random(-5, 5);
        this.alter3 = AL.random(-5, 5);
        this.alter4 = AL.random(-5, 5);
        this.x1 = AL.random(0, AL.w);
        this.y1 = AL.random(0, AL.h);
    }

    setupConstantStyles() {
        AL.ctx.lineWidth = 0.5;
    }

    setupDrawingStyles() {
        AL.ctx.strokeStyle = AL.randomColor(0, 255, 0.8, 1);
        AL.ctx.fillStyle = AL.randomColor(0, 160, 0.05, 0.15);
    }

    draw() {
        if (this.t % this.speed === 0) {
            AL.ctx.moveTo(AL.w / 2, AL.h / 2);
            AL.ctx.quadraticCurveTo(this.cp1, this.cp2, this.x1, this.y1);

            this.cp1 += this.alter1;
            if (this.cp1 > 2 * AL.w || this.cp1 < -AL.w) {
                this.alter1 = -this.alter1;
            }

            this.cp2 += this.alter2;
            if (this.cp2 > 2 * AL.h || this.cp2 < -AL.h) {
                this.alter2 = -this.alter2;
            }

            this.x1 += this.alter3;
            if (this.x1 > 2 * AL.w || this.x1 < -AL.w) {
                this.alter3 = -this.alter3;
            }

            this.y1 += this.alter4;
            if (this.y1 > 2 * AL.h || this.y1 < -AL.h) {
                this.alter4 = -this.alter4;
            }

            AL.ctx.stroke();
            this.rotateCanvasDegrees(this.angle);
        }

        this.t += 1;

        if (this.t % (this.speed * 240) === 0) {
            this.initializeProperties();
            this.setupDrawingStyles();
            this.fillScreen();
            AL.ctx.beginPath();
        }

        this.requestFrame();
    }
}
