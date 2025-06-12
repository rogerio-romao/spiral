import BA from '../BaseAlgorithm.js';

export default class Harmonie extends BA {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.letters = [
            2902, 2908, 2909, 2911, 2913, 2915, 2918, 2919, 2921, 2922, 2924,
            2925, 2926, 2927, 2928, 2929, 2930, 2931, 2932, 2934, 2938, 2947,
            2949, 2952, 2953, 2960, 2962, 2970, 2972, 2975, 2980, 2984, 2986,
            2990, 2991, 2992, 2994, 2997, 2998,
        ];
        this.letter1 = String.fromCharCode(
            this.letters[BA.random(0, this.letters.length)]
        );
        this.letter2 = String.fromCharCode(
            this.letters[BA.random(0, this.letters.length)]
        );

        this.x = BA.random(40, this.w - 40);
        this.y = BA.random(25, this.h - 25);
        this.size = BA.random(20, 55);
        this.rot = 23;
    }

    setupDrawingStyles() {
        this.ctx.strokeStyle = BA.randomColor(35, 210, 0.2, 0.65);
        this.ctx.fillStyle = BA.randomColor(35, 210, 0.2, 0.65);
        this.ctx.textAlign = 'center';
        this.ctx.font = `${this.size}px serif`;
    }

    draw() {
        if (this.t % this.speed === 0) {
            if (this.t % 2) {
                this.ctx.strokeText(this.letter1, this.x, this.y);
            } else {
                this.ctx.fillText(this.letter2, this.x, this.y);
            }
            this.ctx.font = `${this.size}px serif`;
        }

        this.ctx.translate(this.w / 2, this.h / 2);
        this.ctx.rotate((this.rot * Math.PI) / 180);
        this.ctx.translate(-this.w / 2, -this.h / 2);

        if (this.t % (this.speed * 180) === 0) {
            this.size = BA.random(20, 55);
            this.x = BA.random(40, this.w - 40);
            this.y = BA.random(25, this.h - 25);
            this.rot = BA.random(1, 400);

            this.ctx.font = `${this.size}px serif`;
            this.ctx.strokeStyle = BA.randomColor(35, 210, 0.2, 0.65);
            this.ctx.fillStyle = BA.randomColor(35, 210, 0.2, 0.65);
        }

        if (this.t % (this.speed * 900) === 0) {
            this.letter1 = String.fromCharCode(
                this.letters[BA.random(0, this.letters.length)]
            );
            this.letter2 = String.fromCharCode(
                this.letters[BA.random(0, this.letters.length)]
            );
        }

        this.t++;

        requestAnimationFrame(this.draw);
    }
}
