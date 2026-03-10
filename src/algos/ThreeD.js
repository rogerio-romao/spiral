import AL from '../AlgorithmLoader.js';

export default class ThreeD extends AL {
    constructor() {
        super();

        this.name = 'Three D';

        this.initializeProperties();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeProperties() {
        this.letters = [
            3044, 3045, 3046, 3047, 3048, 3052, 3054, 3057, 3059, 3063, 3077, 3079, 3080, 3086,
            3087, 3088, 3090, 3093, 3094, 3097, 3100,
        ];
        this.letter = String.fromCodePoint(AL.pickRandomElement(this.letters));

        this.fontSize = AL.random(24, 80);
        this.rot1 = AL.random(-5, 5);
        this.rot2 = AL.random(2, 11);
        this.rot3 = AL.random(-8, 7);
        this.rot4 = AL.random(4, 18);
        this.rot5 = AL.random(-15, -2);
    }

    setupDrawingStyles() {
        AL.ctx.fillStyle = AL.randomColor(0, 255, 0.5, 1);
        AL.ctx.shadowColor = 'black';
        AL.ctx.shadowOffsetX = 4;
        AL.ctx.shadowOffsetY = 4;
        AL.ctx.shadowBlur = 5;
        AL.ctx.textAlign = 'center';
        AL.ctx.font = `${this.fontSize}px sans-serif`;
    }

    // oxlint-disable-next-line max-statements
    draw() {
        if (this.t % this.speed === 0) {
            this.stagger %= 5;

            if (this.stagger === 0) {
                AL.ctx.save();
                AL.ctx.translate(AL.w * 0.25, AL.h * 0.25);
                AL.ctx.rotate(this.rot1);
                AL.ctx.fillText(this.letter, AL.w * 0.25, 0);
                AL.ctx.translate(-AL.w * 0.25, -AL.h * 0.25);
                AL.ctx.restore();
            }

            if (this.stagger === 1) {
                AL.ctx.save();
                AL.ctx.translate(AL.w * 0.75, AL.h * 0.25);
                AL.ctx.rotate(this.rot2);
                AL.ctx.fillText(this.letter, 0, AL.h * 0.25);
                AL.ctx.translate(-AL.w * 0.75, -AL.h * 0.25);
                AL.ctx.restore();
            }

            if (this.stagger === 2) {
                AL.ctx.save();
                AL.ctx.translate(AL.w * 0.75, AL.h * 0.75);
                AL.ctx.rotate(this.rot3);
                AL.ctx.fillText(this.letter, AL.w * 0.75, 0);
                AL.ctx.translate(-AL.w * 0.75, -AL.h * 0.75);
                AL.ctx.restore();
            }

            if (this.stagger === 3) {
                AL.ctx.save();
                AL.ctx.translate(AL.w * 0.25, AL.h * 0.75);
                AL.ctx.rotate(this.rot4);
                AL.ctx.fillText(this.letter, 0, AL.h * 0.75);
                AL.ctx.translate(-AL.w * 0.25, -AL.h * 0.75);
                AL.ctx.restore();
            }

            if (this.stagger === 4) {
                AL.ctx.translate(AL.w / 2, AL.h / 2);
                AL.ctx.rotate(this.rot5);
                AL.ctx.fillText(this.letter, 0, 0);
                AL.ctx.fillText(this.letter, AL.w * 0.125, AL.h * 0.125);
                AL.ctx.fillText(this.letter, AL.w * 0.875, AL.h * 0.125);
                AL.ctx.fillText(this.letter, AL.w * 0.875, AL.h * 0.875);
                AL.ctx.translate(-AL.w / 2, -AL.h / 2);
                AL.ctx.fillText(this.letter, AL.w * 0.875, AL.h * 0.125);
            }

            this.stagger += 1;
        }

        this.t += 1;

        if (this.t % (this.speed * 75) === 0) {
            this.fontSize = AL.random(24, 80);

            AL.ctx.font = `${this.fontSize}px serif`;
        }

        if (this.t % (this.speed * 150) === 0) {
            this.rot1 = AL.random(-5, 5);
            this.rot2 = AL.random(2, 11);
            this.rot3 = AL.random(-8, 7);
            this.rot4 = AL.random(4, 18);
            this.rot5 = AL.random(-15, -2);

            AL.ctx.fillStyle = AL.randomColor(0, 255, 0.5, 1);
        }

        if (this.t % (this.speed * 300) === 0) {
            this.letter = String.fromCodePoint(AL.pickRandomElement(this.letters));
        }

        this.requestFrame();
    }
}
