import AL from '../AlgorithmLoader.js';

export default class DigitalArt extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

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
        this.x = AL.random(75, this.w - 75);
        this.y = AL.random(30, this.h - 30);
    }

    setupDrawingStyles() {
        this.ctx.fillStyle = AL.randomColor();
        this.ctx.font = `${this.size}px serif`;
    }

    draw() {
        if (this.t % this.speed === 0) {
            const letter = this.t % 2 ? '0' : '1';
            if (this.t % 2) {
                this.ctx.font = `${this.size * 2}px serif`;
                this.ctx.textAlign = 'left';
                this.ctx.textBaseline = 'top';
                this.ctx.fillText(`${letter}-`, this.w / 2, this.h / 2);
            } else {
                this.ctx.font = `${this.size * 2}px serif`;
                this.ctx.textAlign = 'right';
                this.ctx.textBaseline = 'bottom';
                this.ctx.fillText(`${letter}_`, this.w / 2, this.h / 2);
            }

            this.ctx.font = `${this.size}px serif`;
            this.ctx.fillText(letter, this.x, this.y);
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
