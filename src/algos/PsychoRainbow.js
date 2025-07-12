import AL from '../AlgorithmLoader.js';

export default class PsychoRainbow extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeBaseProperties();
        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeBaseProperties() {
        this.blends = ['hard-light', 'difference', 'color', 'luminosity'];
        this.blend = AL.pickRandomElement(this.blends);
    }

    initializeProperties() {
        this.rows = AL.random(3, 10);
        this.rotate = AL.random(1, 50);
        this.height = this.h / this.rows;

        this.colors = [];
        for (let i = 0; i <= this.rows; i++) {
            this.colors.push(AL.randomColor(0, 255, 0.1, 0.5));
        }
    }

    setupDrawingStyles() {
        this.ctx.globalCompositeOperation = this.blend;
    }

    draw() {
        if (this.t % this.speed === 0) {
            for (let i = 0; i <= this.rows; i++) {
                this.ctx.fillStyle = this.colors[i];
                this.ctx.fillRect(
                    -this.w,
                    i * this.height,
                    3 * this.w,
                    this.height
                );
            }
        }

        this.t++;

        this.rotateCanvasRadians(this.rotate);

        if (this.t % (this.speed * 100) === 0) {
            this.initializeProperties();
        }

        if (this.t % (this.speed * 700) === 0) {
            this.blend = AL.pickRandomElement(this.blends);
            this.setupDrawingStyles();
        }

        requestAnimationFrame(this.draw);
    }
}
