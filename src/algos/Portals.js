import AL from '../AlgorithmLoader.js';

export default class Portals extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.name = 'Portals';

        this.initializeProperties();
        this.setupConstantStyles();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeProperties() {
        this.height = AL.random(20, this.h / this.rows + 3);
        this.width = AL.random(20, this.w / this.cols + 3);
        this.rotate = AL.random(1, 33);
        this.round = AL.random(0, 60);
        this.cols = AL.random(3, 13);
        this.rows = AL.random(3, 13);
    }

    setupConstantStyles() {
        this.ctx.globalCompositeOperation = 'hard-light';
        this.ctx.globalAlpha = 0.6;
    }

    setupDrawingStyles() {
        this.ctx.fillStyle = AL.randomColor(0, 255, 0.45, 0.45);
        this.ctx.strokeStyle = AL.randomColor(0, 255, 1, 1);
    }

    draw() {
        if (this.t % this.speed === 0) {
            for (let row = 0; row <= this.rows; row++) {
                for (let col = 0; col <= this.cols; col++) {
                    this.ctx.roundRectExtra(
                        col * (this.w / this.cols),
                        row * (this.h / this.rows),
                        this.width,
                        this.height,
                        {
                            lowerLeft: this.round,
                            lowerRight: this.round,
                            upperLeft: this.round,
                            upperRight: this.round,
                        },
                        true,
                        true,
                    );
                }
            }
        }

        this.t++;

        if (this.t % (this.speed * 90) === 0) {
            this.initializeProperties();
            this.setupDrawingStyles();
        }

        this.rotateCanvasDegrees(this.rotate);

        this.requestFrame();
    }
}
