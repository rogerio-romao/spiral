import AL from '../AlgorithmLoader.js';

export default class Typobrush extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.name = 'Typobrush';

        this.initializeBaseProperties();
        this.initializeProperties();
        this.setupConstantStyles();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeBaseProperties() {
        this.letters = [
            2703, 2705, 2709, 2713, 2715, 2716, 2718, 2719, 2720, 2721, 2722,
            2725, 2726, 2731, 2732, 2735, 2738, 2739, 2741, 2742, 2743, 2745,
            2748, 2750, 2751, 2752, 2753, 2760, 2764, 2768, 2784, 2791, 2792,
            2795, 2796, 2797, 2798, 2799, 2800,
        ];
        this.letter = String.fromCodePoint(AL.pickRandomElement(this.letters));
    }

    initializeProperties() {
        this.size = 20;
        this.x = AL.random(0, this.w);
        this.y = AL.random(0, this.h);
        this.rotate = AL.random(1, 400);
        this.sizeIncrease = AL.random(1, 6);
    }

    setupConstantStyles() {
        this.ctx.textAlign = 'center';
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
        this.strokeColors = AL.generateRGBAPalette(8);
        this.fillColors = AL.generateRGBAPalette(8);
    }

    setupDrawingStyles() {
        this.ctx.font = `${this.size}px serif`;
        this.ctx.strokeStyle = AL.pickRandomElement(this.strokeColors);
        this.ctx.fillStyle = AL.pickRandomElement(this.fillColors);
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.strokeText(this.letter, this.x, this.y);
            this.ctx.font = `${this.size}px serif`;
            this.ctx.fillText(this.letter, this.x + 2, this.y - 2);
            this.size += this.sizeIncrease;
        }

        this.t++;

        this.rotateCanvasRadians(this.rotate);

        if (this.t % (this.speed * 150) === 0) {
            this.initializeProperties();
            this.setupDrawingStyles();
        }

        if (this.t % (this.speed * 750) === 0) {
            this.letter = String.fromCodePoint(
                AL.pickRandomElement(this.letters),
            );

            this.fillScreen();
        }

        this.requestFrame();
    }
}
