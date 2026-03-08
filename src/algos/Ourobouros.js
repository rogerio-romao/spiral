import AL from '../AlgorithmLoader.js';

export default class Ourobouros extends AL {
    constructor() {
        super();

        this.name = 'Ourobouros';

        this.initializeBaseProperties();
        this.initializeProperties();
        this.setupConstantStyles();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeBaseProperties() {
        this.letters = [
            2503, 2504, 2508, 2509, 2510, 2519, 2527, 2528, 2529, 2530, 2531, 2536, 2537, 2539,
            2541, 2544, 2545, 2563, 2566, 2569, 2584, 2591, 2596,
        ];
        this.letter = String.fromCodePoint(AL.pickRandomElement(this.letters));
    }

    initializeProperties() {
        this.rotate = AL.random(4, 30);
        this.x = AL.random(100, AL.w - 100);
        this.y = AL.random(100, AL.h - 100);
    }

    setupConstantStyles() {
        AL.ctx.lineWidth = 20;
        AL.ctx.textAlign = 'center';
        AL.ctx.globalCompositeOperation = 'difference';
    }

    setupDrawingStyles() {
        AL.ctx.font = `${AL.random(40, 300)}px sans-serif`;
        AL.ctx.strokeStyle = AL.randomColor(0, 255, 0.08, 0.4);
    }

    draw() {
        if (this.t % this.speed === 0) {
            AL.ctx.strokeText(this.letter, this.x, this.y);
        }

        this.t += 1;

        this.rotateCanvasDegrees(this.rotate);

        if (this.t % (this.speed * 80) === 0) {
            this.initializeProperties();
            this.setupDrawingStyles();
        }

        if (this.t % (this.speed * 1000) === 0) {
            this.letter = String.fromCodePoint(AL.pickRandomElement(this.letters));
        }

        this.requestFrame();
    }
}
