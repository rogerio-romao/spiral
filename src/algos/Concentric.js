import AL from '../AlgorithmLoader.js';

export default class Concentric extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.name = 'Concentric';

        this.initializeBaseProperties();
        this.initializeProperties();
        this.setupConstantStyles();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeBaseProperties() {
        this.letters = [
            2605, 2608, 2617, 2626, 2632, 2635, 2641, 2652, 2654, 2662, 2663,
            2667, 2670, 2676, 2677, 2691, 2694, 2695, 2696, 2700,
        ];
        this.angles = [10, 12, 15, 18, 20, 24, 36, 45, 72];
    }

    initializeProperties() {
        this.letter1 = String.fromCharCode(AL.pickRandomElement(this.letters));
        this.letter2 = String.fromCharCode(AL.pickRandomElement(this.letters));
        this.letter3 = String.fromCharCode(AL.pickRandomElement(this.letters));
        this.letter4 = String.fromCharCode(AL.pickRandomElement(this.letters));

        this.angle = AL.pickRandomElement(this.angles);

        this.size = AL.random(25, 160);
        this.y = AL.random(0, this.h);
        this.x = AL.random(0, this.w);
    }

    setupConstantStyles() {
        this.ctx.globalCompositeOperation = 'soft-light';
        this.ctx.textAlign = 'center';
        this.ctx.shadowBlur = 7;
        this.ctx.lineWidth = 5;
    }

    setupDrawingStyles() {
        this.ctx.shadowColor = this.ctx.strokeStyle = AL.randomColor();
        this.ctx.font = `bold ${this.size}px serif`;
        this.ctx.fillStyle = AL.randomColor();
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.strokeText(
                `${this.letter1}   ${this.letter2}   ${this.letter3}   ${this.letter4}`,
                this.x,
                this.y
            );
        }

        this.t++;

        this.rotateCanvasRadians(this.angle);

        if (this.t % (this.speed * 150) === 0) {
            this.initializeProperties();
            this.setupDrawingStyles();
        }

        requestAnimationFrame(this.draw);
    }
}
