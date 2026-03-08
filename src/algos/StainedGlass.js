import AL from '../AlgorithmLoader.js';

export default class StainedGlass extends AL {
    constructor() {
        super();

        this.name = 'Stained Glass';

        this.initializeProperties();
        this.setupConstantStyles();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeProperties() {
        this.length = AL.w / 6;
        this.height = AL.h / 5;
        this.random1 = AL.random(0, 3);
        this.random2 = AL.random(1, 359);
    }

    setupConstantStyles() {
        this.modes = ['color', 'hue', 'saturation', 'overlay'];

        AL.ctx.beginPath();
        AL.ctx.lineWidth = 5;
        AL.ctx.strokeStyle = 'black';
        AL.ctx.globalCompositeOperation = 'color';
    }

    setupDrawingStyles() {
        AL.ctx.fillStyle = AL.randomColor(0, 255, 0, 1);
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.stagger = AL.random(0, 30);

            if (this.stagger === 0) {
                AL.ctx.strokeRect(0, 0, this.length, this.height);
                AL.ctx.fillRect(0, 0, this.length, this.height);
                this.setupDrawingStyles();
            }

            if (this.stagger === 1) {
                AL.ctx.strokeRect(this.length, 0, this.length, this.height);
                AL.ctx.fillRect(this.length, 0, this.length, this.height);
                this.setupDrawingStyles();
            }

            if (this.stagger === 2) {
                AL.ctx.strokeRect(2 * this.length, 0, this.length, this.height);
                AL.ctx.fillRect(2 * this.length, 0, this.length, this.height);
                this.setupDrawingStyles();
            }

            if (this.stagger === 3) {
                AL.ctx.strokeRect(3 * this.length, 0, this.length, this.height);
                AL.ctx.fillRect(3 * this.length, 0, this.length, this.height);
                this.setupDrawingStyles();
            }

            if (this.stagger === 4) {
                AL.ctx.strokeRect(4 * this.length, 0, this.length, this.height);
                AL.ctx.fillRect(4 * this.length, 0, this.length, this.height);
                this.setupDrawingStyles();
            }

            if (this.stagger === 5) {
                AL.ctx.strokeRect(5 * this.length, 0, this.length, this.height);
                AL.ctx.fillRect(5 * this.length, 0, this.length, this.height);
                this.setupDrawingStyles();
            }

            if (this.stagger === 6) {
                AL.ctx.strokeRect(5 * this.length, this.height, this.length, this.height);
                AL.ctx.fillRect(5 * this.length, this.height, this.length, this.height);
                this.setupDrawingStyles();
            }

            if (this.stagger === 7) {
                AL.ctx.strokeRect(4 * this.length, this.height, this.length, this.height);
                AL.ctx.fillRect(4 * this.length, this.height, this.length, this.height);
                this.setupDrawingStyles();
            }

            if (this.stagger === 8) {
                AL.ctx.strokeRect(3 * this.length, this.height, this.length, this.height);
                AL.ctx.fillRect(3 * this.length, this.height, this.length, this.height);
                this.setupDrawingStyles();
            }

            if (this.stagger === 9) {
                AL.ctx.strokeRect(2 * this.length, this.height, this.length, this.height);
                AL.ctx.fillRect(2 * this.length, this.height, this.length, this.height);
                this.setupDrawingStyles();
            }

            if (this.stagger === 10) {
                AL.ctx.strokeRect(this.length, this.height, this.length, this.height);
                AL.ctx.fillRect(this.length, this.height, this.length, this.height);
                this.setupDrawingStyles();
            }

            if (this.stagger === 11) {
                AL.ctx.strokeRect(0, this.height, this.length, this.height);
                AL.ctx.fillRect(0, this.height, this.length, this.height);
                this.setupDrawingStyles();
            }

            if (this.stagger === 12) {
                AL.ctx.strokeRect(0, 2 * this.height, this.length, this.height);
                AL.ctx.fillRect(0, 2 * this.height, this.length, this.height);
                this.setupDrawingStyles();
            }

            if (this.stagger === 13) {
                AL.ctx.strokeRect(this.length, 2 * this.height, this.length, this.height);
                AL.ctx.fillRect(this.length, 2 * this.height, this.length, this.height);
                this.setupDrawingStyles();
            }

            if (this.stagger === 14) {
                AL.ctx.strokeRect(2 * this.length, 2 * this.height, this.length, this.height);
                AL.ctx.fillRect(2 * this.length, 2 * this.height, this.length, this.height);
                this.setupDrawingStyles();
            }

            if (this.stagger === 15) {
                AL.ctx.strokeRect(3 * this.length, 2 * this.height, this.length, this.height);
                AL.ctx.fillRect(3 * this.length, 2 * this.height, this.length, this.height);
                this.setupDrawingStyles();
            }

            if (this.stagger === 16) {
                AL.ctx.strokeRect(4 * this.length, 2 * this.height, this.length, this.height);
                AL.ctx.fillRect(4 * this.length, 2 * this.height, this.length, this.height);
                this.setupDrawingStyles();
            }

            if (this.stagger === 17) {
                AL.ctx.strokeRect(5 * this.length, 2 * this.height, this.length, this.height);
                AL.ctx.fillRect(5 * this.length, 2 * this.height, this.length, this.height);
                this.setupDrawingStyles();
            }

            if (this.stagger === 18) {
                AL.ctx.strokeRect(5 * this.length, 3 * this.height, this.length, this.height);
                AL.ctx.fillRect(5 * this.length, 3 * this.height, this.length, this.height);
                this.setupDrawingStyles();
            }

            if (this.stagger === 19) {
                AL.ctx.strokeRect(4 * this.length, 3 * this.height, this.length, this.height);
                AL.ctx.fillRect(4 * this.length, 3 * this.height, this.length, this.height);
                this.setupDrawingStyles();
            }

            if (this.stagger === 20) {
                AL.ctx.strokeRect(3 * this.length, 3 * this.height, this.length, this.height);
                AL.ctx.fillRect(3 * this.length, 3 * this.height, this.length, this.height);
                this.setupDrawingStyles();
            }

            if (this.stagger === 21) {
                AL.ctx.strokeRect(2 * this.length, 3 * this.height, this.length, this.height);
                AL.ctx.fillRect(2 * this.length, 3 * this.height, this.length, this.height);
                this.setupDrawingStyles();
            }

            if (this.stagger === 22) {
                AL.ctx.strokeRect(this.length, 3 * this.height, this.length, this.height);
                AL.ctx.fillRect(this.length, 3 * this.height, this.length, this.height);
                this.setupDrawingStyles();
            }

            if (this.stagger === 23) {
                AL.ctx.strokeRect(0, 3 * this.height, this.length, this.height);
                AL.ctx.fillRect(0, 3 * this.height, this.length, this.height);
                this.setupDrawingStyles();
            }

            if (this.stagger === 24) {
                AL.ctx.strokeRect(0, 4 * this.height, this.length, this.height);
                AL.ctx.fillRect(0, 4 * this.height, this.length, this.height);
                this.setupDrawingStyles();
            }

            if (this.stagger === 25) {
                AL.ctx.strokeRect(this.length, 4 * this.height, this.length, this.height);
                AL.ctx.fillRect(this.length, 4 * this.height, this.length, this.height);
                this.setupDrawingStyles();
            }

            if (this.stagger === 26) {
                AL.ctx.strokeRect(2 * this.length, 4 * this.height, this.length, this.height);
                AL.ctx.fillRect(2 * this.length, 4 * this.height, this.length, this.height);
                this.setupDrawingStyles();
            }

            if (this.stagger === 27) {
                AL.ctx.strokeRect(3 * this.length, 4 * this.height, this.length, this.height);
                AL.ctx.fillRect(3 * this.length, 4 * this.height, this.length, this.height);
                this.setupDrawingStyles();
            }

            if (this.stagger === 28) {
                AL.ctx.strokeRect(4 * this.length, 4 * this.height, this.length, this.height);
                AL.ctx.fillRect(4 * this.length, 4 * this.height, this.length, this.height);
                this.setupDrawingStyles();
            }

            if (this.stagger === 29) {
                AL.ctx.strokeRect(5 * this.length, 4 * this.height, this.length, this.height);
                AL.ctx.fillRect(5 * this.length, 4 * this.height, this.length, this.height);
                this.setupDrawingStyles();
            }
        }

        this.t += 1;

        if (this.t % (this.speed * 50) === 0) {
            this.random1 = AL.random(0, 3);

            this.rotateCanvasDegrees(this.random2);

            AL.ctx.globalCompositeOperation = AL.pickRandomElement(this.modes);

            AL.ctx.fillRect(
                AL.w / 2 - this.random1 * this.length,
                AL.h / 2 - this.height * 1.5,
                this.random1 * 2 * this.length,
                3 * this.height,
            );
            AL.ctx.strokeRect(
                AL.w / 2 - this.random1 * this.length,
                AL.h / 2 - this.height * 2.5,
                this.random1 * 2 * this.length,
                5 * this.height,
            );
        }

        this.requestFrame();
    }
}
