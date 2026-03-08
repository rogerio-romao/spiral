import AL from '../AlgorithmLoader.js';

export default class PsychoRainbow extends AL {
    constructor() {
        super();

        this.name = 'Psycho Rainbow';

        this.initializeBaseProperties();
        this.initializeProperties();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeBaseProperties() {
        this.blends = ['hard-light', 'difference', 'color', 'luminosity'];
        this.blend = AL.pickRandomElement(this.blends);
    }

    initializeProperties() {
        this.rows = AL.random(3, 10);
        this.rotate = AL.random(1, 50);
        this.height = AL.h / this.rows;

        this.colors = AL.generateRGBAPalette(this.rows, 0, 255, 0.1, 0.5);
    }

    setupDrawingStyles() {
        AL.ctx.globalCompositeOperation = this.blend;
    }

    draw() {
        if (this.t % this.speed === 0) {
            for (let i = 0; i <= this.rows; i++) {
                AL.ctx.fillStyle = this.colors[i];
                AL.ctx.fillRect(-AL.w, i * this.height, 3 * AL.w, this.height);
            }
        }

        this.t += 1;

        this.rotateCanvasRadians(this.rotate);

        if (this.t % (this.speed * 100) === 0) {
            this.initializeProperties();
        }

        if (this.t % (this.speed * 700) === 0) {
            this.blend = AL.pickRandomElement(this.blends);
            this.setupDrawingStyles();
        }

        this.requestFrame();
    }
}
