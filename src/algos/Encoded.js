import AL from '../AlgorithmLoader.js';

export default class Encoded extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.name = 'Encoded';

        this.initializeBaseProperties();
        this.initializeProperties();
        this.setupConstantStyles();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeBaseProperties() {
        this.angles = [10, 12, 15, 18, 20, 24, 32, 45, 72];
        this.angle = AL.pickRandomElement(this.angles);
        this.letters = ['S', 'P', 'I', 'R', 'A', 'L'];
    }

    initializeProperties() {
        this.letter = AL.pickRandomElement(this.letters);
        this.size = AL.random(100, 340);
        this.x = AL.random(this.size / 2, this.w - this.size / 2);
        this.y = AL.random(this.size / 2, this.h - this.size / 2);
    }

    setupConstantStyles() {
        this.ctx.shadowBlur = 10;
        this.ctx.textAlign = 'center';
        this.ctx.fillStyle = 'rgba(0,0,0,0.2)';
    }

    setupDrawingStyles() {
        this.ctx.font = `bold ${this.size}px serif`;
        this.ctx.shadowColor = this.ctx.strokeStyle = AL.randomColor(
            30,
            255,
            0.2,
            0.6,
        );
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.strokeText(this.letter, this.x, this.y);
            this.ctx.fillText(this.letter, this.x, this.y);
        }

        this.t++;

        this.rotateCanvasDegrees(this.angle);

        if (this.t % (this.speed * 72) === 0) {
            this.initializeProperties();
            this.setupDrawingStyles();
        }

        this.requestFrame();
    }
}
