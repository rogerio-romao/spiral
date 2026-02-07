import AL from '../AlgorithmLoader.js';

export default class SpaceGears extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.name = 'Space Gears';

        this.initializeBaseProperties();
        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeBaseProperties() {
        this.letters = [
            402, 406, 407, 409, 410, 412, 414, 415, 418, 420, 423, 424, 425,
            428, 429, 430, 433, 437, 438, 439, 440, 443, 444, 448, 449, 450,
            451, 458, 461, 474, 478, 480, 484, 488, 491, 494,
        ];
        this.letter = String.fromCharCode(428);
    }

    initializeProperties() {
        this.rotate = (AL.random(3, 357) * Math.PI) / 180;
    }

    setupDrawingStyles() {
        this.ctx.font = AL.random(100, 700) + 'px serif';
        this.ctx.strokeStyle = AL.randomColor(0, 255, 0.6, 0.6);
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.textAlign = 'left';
            this.ctx.strokeText(' ' + this.letter.repeat(3), 0, 0);
            this.ctx.translate(this.w / 2, this.h / 2);
            this.ctx.rotate(this.rotate);
            this.ctx.textAlign = 'center';
            this.ctx.strokeText(this.letter, 0, 0);
            this.ctx.translate(-this.w / 2, -this.h / 2);
        }

        this.t++;

        if (this.t % (this.speed * 120) === 0) {
            this.setupDrawingStyles();
        }

        if (this.t % (this.speed * 1260) === 0) {
            this.initializeProperties();
            this.letter = String.fromCharCode(
                AL.pickRandomElement(this.letters)
            );
        }

        requestAnimationFrame(this.draw);
    }
}
