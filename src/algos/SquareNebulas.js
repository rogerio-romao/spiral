import AL from '../AlgorithmLoader.js';

export default class SquareNebulas extends AL {
    constructor() {
        super();

        this.name = 'Square Nebulas';

        this.initializeProperties();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeProperties() {
        /** @type {number} */
        this.length = AL.random(50, Math.min(AL.w, AL.h) / 1.5);
        /** @type {number} */
        this.maxLength = this.length;
        this.gap = AL.random(4, 100);
    }

    setupDrawingStyles() {
        AL.ctx.fillStyle = AL.randomColor(5, 255, 0.025, 0.025);
        AL.ctx.strokeStyle = AL.randomColor(5, 255, 0.8, 0.8);
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.stagger %= 3;

            if (this.stagger === 0) {
                AL.ctx.beginPath();
                AL.ctx.moveTo(AL.w / 2, AL.h / 2);
                AL.ctx.fillRect(AL.random(0, AL.w), AL.random(0, AL.h), this.length, this.length);
                AL.ctx.stroke();
                AL.ctx.closePath();
            }

            if (this.stagger === 1) {
                AL.ctx.strokeRect(AL.w / 2, AL.h / 2, this.length / 2, this.length / 2);
                AL.ctx.stroke();
                AL.ctx.closePath();
            }

            if (this.stagger === 2) {
                AL.ctx.fillRect(
                    AL.random(AL.w / 2, AL.w / 2 + this.length),
                    AL.random(AL.h / 2, AL.h / 2 + this.length),
                    this.length / 8,
                    this.length / 8,
                );
                AL.ctx.fill();
                AL.ctx.closePath();
                this.rotateCanvasRadians(Math.random() * Math.PI);
            }

            AL.ctx.moveTo(AL.w / 2, AL.h / 2);
            this.rotateCanvasRadians(Math.random() * Math.PI);

            this.length -= this.gap;
            if (this.length < -this.maxLength) {
                this.length = AL.random(this.maxLength / 2, AL.w / 3);
                this.maxLength = 2 * this.length;
                this.gap = AL.random(2, 100);
            }

            this.stagger += 1;
        }

        this.t += 1;

        if (this.t % (this.speed * 300) === 0) {
            AL.ctx.closePath();
            AL.ctx.beginPath();
            this.setupDrawingStyles();
            this.rotateCanvasRadians(Math.random() * Math.PI);
        }

        this.requestFrame();
    }
}
