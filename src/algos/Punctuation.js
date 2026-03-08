import AL from '../AlgorithmLoader.js';

export default class Punctuation extends AL {
    constructor() {
        super();

        this.name = 'Punctuation';

        this.initializeBaseProperties();
        this.initializeProperties();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeBaseProperties() {
        this.letters = [
            '|',
            '(',
            ')',
            '-',
            '_',
            '{',
            '}',
            '[',
            ']',
            '\\',
            ':',
            '/',
            '<>',
            '~',
            '`',
            '.',
        ];
    }

    initializeProperties() {
        this.rotate = AL.random(-359, -1);
        this.letter = AL.pickRandomElement(this.letters);
    }

    setupDrawingStyles() {
        this.fontChange = AL.random(35, 250);
        AL.ctx.font = `${this.fontChange}px sans-serif`;
        AL.ctx.fillStyle = AL.randomColor(0, 255, 0.66, 0.66);
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.stagger %= 4;

            if (this.stagger === 0) {
                this.rotateCanvasDegrees(this.rotate);

                AL.ctx.fillText(this.letter, AL.w / 2, AL.h / 2);
            }

            if (this.stagger === 1) {
                AL.ctx.fillText(`  ${this.letter}`, AL.w / 2, AL.h / 2);

                this.rotateCanvasDegrees(this.rotate);
            }

            if (this.stagger === 2) {
                AL.ctx.fillText(`    ${this.letter}`, AL.w / 2, AL.h / 2);
            }

            if (this.stagger === 3) {
                AL.ctx.fillText(`      ${this.letter}`, AL.w / 2, AL.h / 2);
            }

            this.stagger += 1;
        }

        this.t += 1;

        if (this.t % (this.speed * 100) === 0) {
            this.rotate = AL.random(-35, -10);
            this.fontChange = AL.random(35, 250);
            AL.ctx.font = `${this.fontChange}px sans-serif`;
        }

        if (this.t % (this.speed * 200) === 0) {
            AL.ctx.fillStyle = AL.randomColor(0, 255, 0.66, 0.66);
        }

        if (this.t % (this.speed * 400) === 0) {
            this.letter = AL.pickRandomElement(this.letters);
        }

        this.requestFrame();
    }
}
