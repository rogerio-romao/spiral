import AL from '../AlgorithmLoader.js';

export default class ThreeD extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.name = 'Three D';

        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.letters = [
            3044, 3045, 3046, 3047, 3048, 3052, 3054, 3057, 3059, 3063, 3077,
            3079, 3080, 3086, 3087, 3088, 3090, 3093, 3094, 3097, 3100,
        ];
        this.letter = String.fromCharCode(AL.pickRandomElement(this.letters));

        this.fontSize = AL.random(24, 80);
        this.rot1 = AL.random(-5, 5);
        this.rot2 = AL.random(2, 11);
        this.rot3 = AL.random(-8, 7);
        this.rot4 = AL.random(4, 18);
        this.rot5 = AL.random(-15, -2);
    }

    setupDrawingStyles() {
        this.ctx.fillStyle = AL.randomColor(0, 255, 0.5, 1);
        this.ctx.shadowColor = 'black';
        this.ctx.shadowOffsetX = 4;
        this.ctx.shadowOffsetY = 4;
        this.ctx.shadowBlur = 5;
        this.ctx.textAlign = 'center';
        this.ctx.font = this.fontSize + 'px sans-serif';
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.stagger = this.stagger % 5;

            if (this.stagger === 0) {
                this.ctx.save();
                this.ctx.translate(this.w * 0.25, this.h * 0.25);
                this.ctx.rotate(this.rot1);
                this.ctx.fillText(this.letter, this.w * 0.25, 0);
                this.ctx.translate(-this.w * 0.25, -this.h * 0.25);
                this.ctx.restore();
            }

            if (this.stagger === 1) {
                this.ctx.save();
                this.ctx.translate(this.w * 0.75, this.h * 0.25);
                this.ctx.rotate(this.rot2);
                this.ctx.fillText(this.letter, 0, this.h * 0.25);
                this.ctx.translate(-this.w * 0.75, -this.h * 0.25);
                this.ctx.restore();
            }

            if (this.stagger === 2) {
                this.ctx.save();
                this.ctx.translate(this.w * 0.75, this.h * 0.75);
                this.ctx.rotate(this.rot3);
                this.ctx.fillText(this.letter, this.w * 0.75, 0);
                this.ctx.translate(-this.w * 0.75, -this.h * 0.75);
                this.ctx.restore();
            }

            if (this.stagger === 3) {
                this.ctx.save();
                this.ctx.translate(this.w * 0.25, this.h * 0.75);
                this.ctx.rotate(this.rot4);
                this.ctx.fillText(this.letter, 0, this.h * 0.75);
                this.ctx.translate(-this.w * 0.25, -this.h * 0.75);
                this.ctx.restore();
            }

            if (this.stagger === 4) {
                this.ctx.translate(this.w / 2, this.h / 2);
                this.ctx.rotate(this.rot5);
                this.ctx.fillText(this.letter, 0, 0);
                this.ctx.fillText(this.letter, this.w * 0.125, this.h * 0.125);
                this.ctx.fillText(this.letter, this.w * 0.875, this.h * 0.125);
                this.ctx.fillText(this.letter, this.w * 0.875, this.h * 0.875);
                this.ctx.translate(-this.w / 2, -this.h / 2);
                this.ctx.fillText(this.letter, this.w * 0.875, this.h * 0.125);
            }

            this.stagger++;
        }

        this.t++;

        if (this.t % (this.speed * 75) === 0) {
            this.fontSize = AL.random(24, 80);

            this.ctx.font = this.fontSize + 'px serif';
        }

        if (this.t % (this.speed * 150) === 0) {
            this.rot1 = AL.random(-5, 5);
            this.rot2 = AL.random(2, 11);
            this.rot3 = AL.random(-8, 7);
            this.rot4 = AL.random(4, 18);
            this.rot5 = AL.random(-15, -2);

            this.ctx.fillStyle = AL.randomColor(0, 255, 0.5, 1);
        }

        if (this.t % (this.speed * 300) === 0) {
            this.letter = String.fromCharCode(
                AL.pickRandomElement(this.letters)
            );
        }

        requestAnimationFrame(this.draw);
    }
}
