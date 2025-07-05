import AL from '../AlgorithmLoader.js';

export default class Veils extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeBaseProperties();
        this.initializeProperties();
        this.setupConstantStyles();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeBaseProperties() {
        this.letters = [
            2801, 2817, 2819, 2822, 2824, 2827, 2832, 2835, 2837, 2849, 2855,
            2856, 2858, 2859, 2860, 2862, 2873, 2877, 2878, 2880, 2891, 2893,
        ];
        this.rot = 1;
    }

    initializeProperties() {
        this.letter = String.fromCharCode(AL.pickRandomElement(this.letters));

        this.x = AL.random(0, this.w);
        this.y = AL.random(0, this.h);
        this.size = AL.random(30, 400);
    }

    setupConstantStyles() {
        this.ctx.textAlign = 'center';
    }

    setupDrawingStyles() {
        this.ctx.strokeStyle = AL.randomColor(0, 255, 0.5, 0.5);
        this.ctx.font = `${this.size}px serif`;
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.strokeText(this.letter, this.x, this.y);

            this.size += 2;
            this.ctx.font = `${this.size}px serif`;
        }

        this.t++;

        this.rotateCanvasRadians(this.rot);

        if (this.t % (this.speed * 540) === 0) {
            this.initializeProperties();
            this.setupDrawingStyles();
        }

        if (this.t % (this.speed * 1620) === 0) {
            this.rot++;
        }

        requestAnimationFrame(this.draw);
    }
}
