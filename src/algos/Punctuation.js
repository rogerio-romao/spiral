import BA from '../BaseAlgorithm.js';

export default class Punctuation extends BA {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
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
        this.letter = this.letters[BA.random(0, this.letters.length)];

        this.rot1 = (BA.random(-359, -1) * Math.PI) / 180;
    }

    setupDrawingStyles() {
        this.ctx.fillStyle = BA.randomColor(0, 255, 0.66, 0.66);
        this.fontChange = BA.random(35, 250);
        this.ctx.font = `${this.fontChange}px sans-serif`;
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.stagger = this.stagger % 4;

            if (this.stagger === 0) {
                this.ctx.translate(this.w / 2, this.h / 2);
                this.ctx.rotate(this.rot1);
                this.ctx.translate(-this.w / 2, -this.h / 2);
                this.ctx.fillText(this.letter, this.w / 2, this.h / 2);
            }

            if (this.stagger === 1) {
                this.ctx.fillText(`  ${this.letter}`, this.w / 2, this.h / 2);
                this.ctx.translate(this.w / 2, this.h / 2);
                this.ctx.rotate(this.rot1);
                this.ctx.translate(-this.w / 2, -this.h / 2);
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

        if (this.t % (this.speed * 100) === 0) {
            this.rot1 = (BA.random(-35, -10) * Math.PI) / 180;
            this.fontChange = BA.random(35, 250);
            this.ctx.font = `${this.fontChange}px sans-serif`;
        }

        if (this.t % (this.speed * 200) === 0) {
            this.ctx.fillStyle = BA.randomColor(0, 255, 0.66, 0.66);
        }

        if (this.t % (this.speed * 400) === 0) {
            this.letter = this.letters[BA.random(0, this.letters.length)];
        }

        this.t++;

        requestAnimationFrame(this.draw);
    }
}
