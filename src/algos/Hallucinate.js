import AL from '../AlgorithmLoader.js';

export default class Hallucinate extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.name = 'Hallucinate';

        this.initializeProperties();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeProperties() {
        this.rows = AL.random(3, 17);
        this.rot = AL.random(1, 180);
        this.height = this.h / this.rows;
        this.colors = AL.generateRGBAPalette(this.rows);
    }

    setupDrawingStyles() {
        this.ctx.globalCompositeOperation = 'soft-light';
    }

    draw() {
        if (this.t % this.speed === 0) {
            for (let i = 0; i <= this.rows; i++) {
                this.ctx.fillStyle = this.colors[i];
                this.ctx.fillRect(
                    -this.w,
                    i * this.height,
                    3 * this.w,
                    this.height,
                );
            }
        }

        this.t += 1;

        this.rotateCanvasRadians(this.rot);

        if (this.t % (this.speed * 150) === 0) {
            this.initializeProperties();
        }

        if (this.t % (this.speed * 750) === 0) {
            this.clearScreen();
        }

        this.requestFrame();
    }
}
