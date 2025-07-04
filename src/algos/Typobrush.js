import AL from '../AlgorithmLoader.js';

export default class Typobrush extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeConstantProperties();
        this.initializeProperties();
        this.setupConstantStyles();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeConstantProperties() {
        this.letters = [
            2703, 2705, 2709, 2713, 2715, 2716, 2718, 2719, 2720, 2721, 2722,
            2725, 2726, 2731, 2732, 2735, 2738, 2739, 2741, 2742, 2743, 2745,
            2748, 2750, 2751, 2752, 2753, 2760, 2764, 2768, 2784, 2791, 2792,
            2795, 2796, 2797, 2798, 2799, 2800,
        ];
        this.letter = String.fromCharCode(AL.pickRandomElement(this.letters));
    }

    initializeProperties() {
        this.x = AL.random(0, this.w);
        this.y = AL.random(0, this.h);
        this.size = 20;
        this.sizeInc = AL.random(1, 6);
        this.rot = AL.random(1, 400);
    }

    setupConstantStyles() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
        this.ctx.textAlign = 'center';
    }

    setupDrawingStyles() {
        this.ctx.strokeStyle = AL.randomColor(0, 255, 0.33, 0.33);
        this.ctx.font = `${this.size}px serif`;
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.strokeText(this.letter, this.x, this.y);
            this.ctx.font = `${this.size}px serif`;
            this.size += this.sizeInc;
        }

        this.t++;

        this.rotateCanvasRadians(this.rot);

        if (this.t % (this.speed * 150) === 0) {
            this.initializeProperties();
            this.setupDrawingStyles();
        }

        if (this.t % (this.speed * 1500) === 0) {
            this.letter = String.fromCharCode(
                AL.pickRandomElement(this.letters)
            );

            this.ctx.fillRect(-this.w, -this.h, 3 * this.w, 3 * this.h);
        }

        requestAnimationFrame(this.draw);
    }
}
