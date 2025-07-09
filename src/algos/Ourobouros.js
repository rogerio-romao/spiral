import AL from '../AlgorithmLoader.js';

export default class Ourobouros extends AL {
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
            2503, 2504, 2508, 2509, 2510, 2519, 2527, 2528, 2529, 2530, 2531,
            2536, 2537, 2539, 2541, 2544, 2545, 2563, 2566, 2569, 2584, 2591,
            2596,
        ];
        this.letter = String.fromCharCode(AL.pickRandomElement(this.letters));
    }

    initializeProperties() {
        this.rotate = AL.random(4, 30);
        this.x = AL.random(100, this.w - 100);
        this.y = AL.random(100, this.h - 100);
    }

    setupConstantStyles() {
        this.ctx.lineWidth = 20;
        this.ctx.textAlign = 'center';
        this.ctx.globalCompositeOperation = 'difference';
    }

    setupDrawingStyles() {
        this.ctx.font = `${AL.random(40, 300)}px sans-serif`;
        this.ctx.strokeStyle = AL.randomColor(0, 255, 0.08, 0.4);
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.strokeText(this.letter, this.x, this.y);
        }

        this.t++;

        this.rotateCanvasDegrees(this.rotate);

        if (this.t % (this.speed * 80) === 0) {
            this.initializeProperties();
            this.setupDrawingStyles();
        }

        if (this.t % (this.speed * 1000) === 0) {
            this.letter = String.fromCharCode(
                AL.pickRandomElement(this.letters)
            );
        }

        requestAnimationFrame(this.draw);
    }
}
