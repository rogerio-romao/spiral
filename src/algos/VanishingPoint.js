import AL from '../AlgorithmLoader.js';

export default class VanishingPoint extends AL {
    constructor() {
        super();

        this.name = 'Vanishing Point';

        this.initializeBaseProperties();
        this.initializeProperties();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeBaseProperties() {
        this.size = Math.min(AL.w, AL.h);
        this.decrease = AL.random(2, 11);
        this.timer = null;
    }

    initializeProperties() {
        this.rotate = AL.random(1, 90);
        this.color1 = AL.randomColor(0, 255, 1, 1);
        this.color2 = AL.randomColor(0, 255, 1, 1);
        this.color3 = AL.randomColor(0, 255, 1, 1);
        this.color4 = AL.randomColor(0, 255, 1, 1);
        this.colors = AL.generateRGBAPalette(4, 0, 255, 1, 1);
    }

    setupDrawingStyles() {
        AL.ctx.strokeStyle = 'black';
    }

    draw() {
        if (this.t % this.speed === 0) {
            AL.ctx.fillStyle = AL.pickRandomElement(this.colors);
            this.drawTriangle(AL.w / 2, AL.h / 2);

            this.size -= this.decrease;
            if (this.size - this.decrease <= 1) {
                this.size = 1;
                this.decrease = 0;

                this.initializeProperties();

                this.timer = setTimeout(() => {
                    this.size = Math.min(AL.w, AL.h);
                    this.decrease = AL.random(2, 11);
                }, 3500);
            }
        }

        this.t += 1;

        this.rotateCanvasDegrees(this.rotate);

        this.requestFrame();
    }

    stop() {
        clearTimeout(this.timer);
        super.stop();
    }

    /**
     *
     * @param {number} x - the x coordinate
     * @param {number} y - the y coordinate
     */
    drawTriangle = (x, y) => {
        AL.ctx.moveTo(x, y);
        AL.ctx.beginPath();
        AL.ctx.lineTo(x + this.size, y);
        AL.ctx.lineTo(x, y + this.size);
        AL.ctx.lineTo(x, y);
        AL.ctx.closePath();
        AL.ctx.fill();
        AL.ctx.stroke();
    };
}
