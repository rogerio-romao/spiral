import AL from '../AlgorithmLoader.js';

export default class CamouflagePostits extends AL {
    constructor() {
        super();

        this.name = 'Camouflage Post-its';

        this.initializeBaseProperties();
        this.initializeProperties();
        this.setupConstantStyles();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeBaseProperties() {
        this.modes = [
            'xor',
            'difference',
            'hard-light',
            'color-burn',
            'color-dodge',
            'lighten',
            'darken',
            'overlay',
            'source-atop',
        ];
    }

    initializeProperties() {
        this.x = AL.random(0, AL.w);
        this.y = AL.random(0, AL.h);
        this.randCol = AL.random(0, 255);
        this.length = AL.random(50, Math.min(AL.w, AL.h) / 1.5);
    }

    setupConstantStyles() {
        AL.ctx.lineWidth = 2;
        AL.ctx.strokeStyle = 'white';
        AL.ctx.moveTo(AL.w / 2, AL.h / 2);
    }

    setupDrawingStyles() {
        AL.ctx.fillStyle = `rgb(
        ${this.randCol + AL.random(-8, 8)},
        ${this.randCol + AL.random(-8, 8)},
        ${this.randCol + AL.random(-8, 8)}
        )`;
    }

    draw() {
        if (this.t % this.speed === 0) {
            AL.ctx.fillRect(this.x, this.y, this.length, this.length);

            this.x = AL.random(0, AL.w);
            this.y = AL.random(0, AL.h);

            this.rotateCanvasRadians(AL.random(0, 360));
        }

        this.t += 1;

        if (this.t % (this.speed * 25) === 0) {
            this.length = AL.random(5, 125);
            this.randCol = AL.random(0, 255);

            AL.ctx.fillRect(
                AL.w / 2 - this.length * 1.5,
                AL.h / 2 - this.length * 1.5,
                3 * this.length,
                3 * this.length,
            );
            AL.ctx.strokeRect(
                AL.w / 2 - this.length * 1.5,
                AL.h / 2 - this.length * 1.5,
                3 * this.length,
                3 * this.length,
            );

            this.setupDrawingStyles();
        }

        if (this.t % (this.speed * 100) === 0) {
            AL.ctx.globalCompositeOperation = AL.pickRandomElement(this.modes);
        }

        this.requestFrame();
    }
}
