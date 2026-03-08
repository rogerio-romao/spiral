import AL from '../AlgorithmLoader.js';

export default class DigitalArt extends AL {
    constructor() {
        super();

        this.name = 'Digital Art';

        this.initializeBaseProperties();
        this.initializeProperties();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeBaseProperties() {
        this.rotate = AL.random(3, 40);
    }

    initializeProperties() {
        this.size = AL.random(12, 36);
        this.x = AL.random(75, AL.w - 75);
        this.y = AL.random(30, AL.h - 30);
    }

    setupDrawingStyles() {
        AL.ctx.fillStyle = AL.randomColor();
        AL.ctx.font = `${this.size}px serif`;
    }

    draw() {
        if (this.t % this.speed === 0) {
            const letter = this.t % 2 ? '0' : '1';
            AL.ctx.font = `${this.size * 2}px serif`;
            if (this.t % 2) {
                AL.ctx.textAlign = 'left';
                AL.ctx.textBaseline = 'top';
                AL.ctx.fillText(`${letter}-`, AL.w / 2, AL.h / 2);
            } else {
                AL.ctx.textAlign = 'right';
                AL.ctx.textBaseline = 'bottom';
                AL.ctx.fillText(`${letter}_`, AL.w / 2, AL.h / 2);
            }

            AL.ctx.font = `${this.size}px serif`;
            AL.ctx.fillText(letter, this.x, this.y);
        }

        this.t += 1;

        this.rotateCanvasDegrees(this.rotate);

        if (this.t % (this.speed * 90) === 0) {
            this.initializeProperties();
            this.setupDrawingStyles();
        }

        if (this.t % (this.speed * 450) === 0) {
            this.initializeBaseProperties();
        }

        this.requestFrame();
    }
}
