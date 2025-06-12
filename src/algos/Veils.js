import BA from '../BaseAlgorithm.js';

export default class Veils extends BA {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.letters = [
            2801, 2817, 2819, 2822, 2824, 2827, 2832, 2835, 2837, 2849, 2855,
            2856, 2858, 2859, 2860, 2862, 2873, 2877, 2878, 2880, 2891, 2893,
        ];
        this.letter = String.fromCharCode(
            this.letters[BA.random(0, this.letters.length)]
        );

        this.x = BA.random(0, this.w);
        this.y = BA.random(0, this.h);
        this.rot = 1;
        this.size = BA.random(30, 400);
    }

    setupDrawingStyles() {
        this.ctx.strokeStyle = BA.randomColor(0, 255, 0.5, 0.5);
        this.ctx.textAlign = 'center';
        this.ctx.font = `${this.size}px serif`;
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.strokeText(this.letter, this.x, this.y);

            this.size += 2;
            this.ctx.font = `${this.size}px serif`;
        }

        this.ctx.translate(this.w / 2, this.h / 2);
        this.ctx.rotate(this.rot);
        this.ctx.translate(-this.w / 2, -this.h / 2);

        if (this.t % (this.speed * 540) === 0) {
            this.letter = String.fromCharCode(
                this.letters[BA.random(0, this.letters.length)]
            );
            this.size = BA.random(30, 400);
            this.x = BA.random(0, this.w);
            this.y = BA.random(0, this.h);

            this.ctx.font = `${this.size}px serif`;
            this.ctx.strokeStyle = BA.randomColor(0, 255, 0.5, 0.5);
        }

        if (this.t % (this.speed * 1620) === 0) {
            this.rot++;
        }

        this.t++;

        requestAnimationFrame(this.draw);
    }
}
