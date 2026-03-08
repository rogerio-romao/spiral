import AL from '../AlgorithmLoader.js';

export default class Veils extends AL {
    constructor() {
        super();

        this.name = 'Veils';

        this.initializeBaseProperties();
        this.initializeProperties();
        this.setupConstantStyles();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeBaseProperties() {
        this.rotate = 1;
        this.letters = [
            2801, 2817, 2819, 2822, 2824, 2827, 2832, 2835, 2837, 2849, 2855, 2856, 2858, 2859,
            2860, 2862, 2873, 2877, 2878, 2880, 2891, 2893,
        ];
    }

    initializeProperties() {
        this.letter = String.fromCodePoint(AL.pickRandomElement(this.letters));

        this.x = AL.random(0, AL.w);
        this.y = AL.random(0, AL.h);
        this.size = AL.random(30, 400);
    }

    setupConstantStyles() {
        AL.ctx.textAlign = 'center';
    }

    setupDrawingStyles() {
        AL.ctx.font = `${this.size}px serif`;
        AL.ctx.strokeStyle = AL.randomColor(0, 255, 0.5, 0.5);
    }

    draw() {
        if (this.t % this.speed === 0) {
            AL.ctx.strokeText(this.letter, this.x, this.y);

            this.size += 2;
            AL.ctx.font = `${this.size}px serif`;
        }

        this.t += 1;

        this.rotateCanvasRadians(this.rotate);

        if (this.t % (this.speed * 540) === 0) {
            this.initializeProperties();
            this.setupDrawingStyles();
        }

        if (this.t % (this.speed * 1620) === 0) {
            this.rotate += 1;
        }

        this.requestFrame();
    }
}
