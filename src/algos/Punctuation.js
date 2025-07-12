import AL from '../AlgorithmLoader.js';

export default class Punctuation extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeBaseProperties();
        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
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
        this.ctx.font = `${this.fontChange}px sans-serif`;
        this.ctx.fillStyle = AL.randomColor(0, 255, 0.66, 0.66);
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.stagger = this.stagger % 4;

            if (this.stagger === 0) {
                this.rotateCanvasDegrees(this.rotate);

                this.ctx.fillText(this.letter, this.w / 2, this.h / 2);
            }

            if (this.stagger === 1) {
                this.ctx.fillText(`  ${this.letter}`, this.w / 2, this.h / 2);

                this.rotateCanvasDegrees(this.rotate);
            }

            if (this.stagger === 2) {
                this.ctx.fillText(`    ${this.letter}`, this.w / 2, this.h / 2);
            }

            if (this.stagger === 3) {
                this.ctx.fillText(
                    `      ${this.letter}`,
                    this.w / 2,
                    this.h / 2
                );
            }

            this.stagger++;
        }

        this.t++;

        if (this.t % (this.speed * 100) === 0) {
            this.rotate = AL.random(-35, -10);
            this.fontChange = AL.random(35, 250);
            this.ctx.font = `${this.fontChange}px sans-serif`;
        }

        if (this.t % (this.speed * 200) === 0) {
            this.ctx.fillStyle = AL.randomColor(0, 255, 0.66, 0.66);
        }

        if (this.t % (this.speed * 400) === 0) {
            this.letter = AL.pickRandomElement(this.letters);
        }

        requestAnimationFrame(this.draw);
    }
}
