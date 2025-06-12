import BA from '../BaseAlgorithm.js';

export default class Typobrush extends BA {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.letters = [
            2703, 2705, 2709, 2713, 2715, 2716, 2718, 2719, 2720, 2721, 2722,
            2725, 2726, 2731, 2732, 2735, 2738, 2739, 2741, 2742, 2743, 2745,
            2748, 2750, 2751, 2752, 2753, 2760, 2764, 2768, 2784, 2791, 2792,
            2795, 2796, 2797, 2798, 2799, 2800,
        ];
        this.letter = String.fromCharCode(
            this.letters[BA.random(0, this.letters.length)]
        );

        this.x = BA.random(0, this.w);
        this.y = BA.random(0, this.h);
        this.size = 20;
        this.sizeInc = BA.random(1, 6);
        this.rot = BA.random(1, 400);
    }

    setupDrawingStyles() {
        this.ctx.strokeStyle = BA.randomColor(0, 255, 0.33, 0.33);
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
        this.ctx.textAlign = 'center';
        this.ctx.font = `${this.size}px serif`;
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.strokeText(this.letter, this.x, this.y);
            this.ctx.font = `${this.size}px serif`;
            this.size += this.sizeInc;
        }

        this.ctx.translate(this.w / 2, this.h / 2);
        this.ctx.rotate(this.rot);
        this.ctx.translate(-this.w / 2, -this.h / 2);

        if (this.t % (this.speed * 150) === 0) {
            this.size = 20;
            this.x = BA.random(0, this.w);
            this.y = BA.random(0, this.h);
            this.rot = BA.random(1, 400);
            this.sizeInc = BA.random(1, 6);

            this.ctx.font = `${this.size}px serif`;
            this.ctx.strokeStyle = BA.randomColor(0, 255, 0.33, 0.33);
        }

        if (this.t % (this.speed * 1500) === 0) {
            this.letter = String.fromCharCode(
                this.letters[BA.random(0, this.letters.length)]
            );

            this.ctx.fillRect(-this.w, -this.h, 3 * this.w, 3 * this.h);
        }

        this.t++;

        requestAnimationFrame(this.draw);
    }
}
