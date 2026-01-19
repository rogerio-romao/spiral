import AL from '../AlgorithmLoader.js';

export default class CamouflagePostits extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.name = 'Camouflage Post-its';

        this.initializeBaseProperties();
        this.initializeProperties();
        this.setupConstantStyles();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
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
        this.x = AL.random(0, this.w);
        this.y = AL.random(0, this.h);
        this.randCol = AL.random(0, 255);
        this.length = AL.random(50, Math.min(this.w, this.h) / 1.5);
    }

    setupConstantStyles() {
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = 'white';
        this.ctx.moveTo(this.w / 2, this.h / 2);
    }

    setupDrawingStyles() {
        this.ctx.fillStyle = `rgb(
        ${this.randCol + AL.random(-8, 8)},
        ${this.randCol + AL.random(-8, 8)},
        ${this.randCol + AL.random(-8, 8)}
        )`;
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.fillRect(this.x, this.y, this.length, this.length);

            this.x = AL.random(0, this.w);
            this.y = AL.random(0, this.h);

            this.rotateCanvasRadians(AL.random(0, 360));
        }

        this.t++;

        if (this.t % (this.speed * 25) === 0) {
            this.length = AL.random(5, 125);
            this.randCol = AL.random(0, 255);

            this.ctx.fillRect(
                this.w / 2 - this.length * 1.5,
                this.h / 2 - this.length * 1.5,
                3 * this.length,
                3 * this.length
            );
            this.ctx.strokeRect(
                this.w / 2 - this.length * 1.5,
                this.h / 2 - this.length * 1.5,
                3 * this.length,
                3 * this.length
            );

            this.setupDrawingStyles();
        }

        if (this.t % (this.speed * 100) === 0) {
            this.ctx.globalCompositeOperation = AL.pickRandomElement(
                this.modes
            );
        }

        requestAnimationFrame(this.draw);
    }
}
