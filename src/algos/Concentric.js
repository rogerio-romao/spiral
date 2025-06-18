import AL from '../AlgorithmLoader.js';

export default class Concentric extends AL {
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
            2605, 2608, 2617, 2626, 2632, 2635, 2641, 2652, 2654, 2662, 2663,
            2667, 2670, 2676, 2677, 2691, 2694, 2695, 2696, 2700,
        ];
        this.angles = [10, 12, 15, 18, 20, 24, 36, 45, 72];
    }

    initializeProperties() {
        this.letter1 = String.fromCharCode(
            this.letters[AL.random(0, this.letters.length)]
        );
        this.letter2 = String.fromCharCode(
            this.letters[AL.random(0, this.letters.length)]
        );
        this.letter3 = String.fromCharCode(
            this.letters[AL.random(0, this.letters.length)]
        );
        this.letter4 = String.fromCharCode(
            this.letters[AL.random(0, this.letters.length)]
        );

        this.size = AL.random(25, 160);
        this.x = AL.random(0, this.w);
        this.y = AL.random(0, this.h);
        this.angle = this.angles[AL.random(0, this.angles.length)];
    }

    setupConstantStyles() {
        this.ctx.globalCompositeOperation = 'soft-light';
        this.ctx.textAlign = 'center';
        this.ctx.shadowBlur = 7;
        this.ctx.lineWidth = 5;
    }

    setupDrawingStyles() {
        this.ctx.shadowColor = this.ctx.strokeStyle = AL.randomColor();
        this.ctx.fillStyle = AL.randomColor();
        this.ctx.font = `bold ${this.size}px serif`;
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.strokeText(
                `${this.letter1}   ${this.letter2}   ${this.letter3}   ${this.letter4}`,
                this.x,
                this.y
            );
        }

        this.rotateCanvasRadians(this.angle);

        this.t++;

        if (this.t % (this.speed * 150) === 0) {
            this.initializeProperties();

            this.setupDrawingStyles();
        }

        requestAnimationFrame(this.draw);
    }
}
