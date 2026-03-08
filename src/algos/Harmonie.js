import AL from '../AlgorithmLoader.js';

export default class Harmonie extends AL {
    constructor() {
        super();

        this.name = 'Harmonie';

        this.initializeBaseProperties();
        this.initializeProperties();
        this.setupConstantStyles();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeBaseProperties() {
        this.rotate = 23;
        this.letters = [
            2902, 2908, 2909, 2911, 2913, 2915, 2918, 2919, 2921, 2922, 2924, 2925, 2926, 2927,
            2928, 2929, 2930, 2931, 2932, 2934, 2938, 2947, 2949, 2952, 2953, 2960, 2962, 2970,
            2972, 2975, 2980, 2984, 2986, 2990, 2991, 2992, 2994, 2997, 2998,
        ];
        this.letter1 = String.fromCodePoint(AL.pickRandomElement(this.letters));
        this.letter2 = String.fromCodePoint(AL.pickRandomElement(this.letters));
    }

    initializeProperties() {
        this.x = AL.random(40, AL.w - 40);
        this.y = AL.random(25, AL.h - 25);
        this.size = AL.random(20, 55);
    }

    setupConstantStyles() {
        AL.ctx.textAlign = 'center';
    }

    setupDrawingStyles() {
        AL.ctx.strokeStyle = AL.randomColor(35, 210, 0.2, 0.65);
        AL.ctx.fillStyle = AL.randomColor(35, 210, 0.2, 0.65);
        AL.ctx.font = `${this.size}px serif`;
    }

    draw() {
        if (this.t % this.speed === 0) {
            if (this.t % 2) {
                AL.ctx.strokeText(this.letter1, this.x, this.y);
            } else {
                AL.ctx.fillText(this.letter2, this.x, this.y);
            }
            AL.ctx.font = `${this.size}px serif`;
        }

        this.t += 1;

        this.rotateCanvasDegrees(this.rotate);

        if (this.t % (this.speed * 180) === 0) {
            this.initializeProperties();
            this.rotate = AL.random(1, 400);
            this.setupDrawingStyles();
        }

        if (this.t % (this.speed * 900) === 0) {
            this.letter1 = String.fromCodePoint(AL.pickRandomElement(this.letters));
            this.letter2 = String.fromCodePoint(AL.pickRandomElement(this.letters));
        }

        this.requestFrame();
    }
}
