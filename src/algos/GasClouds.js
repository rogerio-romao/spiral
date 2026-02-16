import AL from '../AlgorithmLoader.js';

export default class GasClouds extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.name = 'Gas Clouds';

        this.initializeProperties();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeProperties() {
        this.width = AL.random(0, this.w / 2);
        this.height = AL.random(0, this.h / 2);
        this.rotate = AL.random(1, 200);
        this.ul = AL.random(0, 300);
        this.ur = AL.random(0, 300);
        this.dl = AL.random(0, 300);
        this.dr = AL.random(0, 300);
        this.x = 0;
        this.y = 0;
    }

    setupDrawingStyles() {
        this.ctx.strokeStyle = AL.randomColor(0, 150, 0.2, 0.5);
        this.ctx.fillStyle = AL.randomColor(25, 255, 0.02, 0.04);
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.roundRectExtra(
                this.x++,
                this.y++,
                this.width,
                this.height,
                {
                    upperLeft: this.ul,
                    upperRight: this.ur,
                    lowerLeft: this.dl,
                    lowerRight: this.dr,
                },
                true,
                false,
            );
        }

        this.t++;

        if (this.t % (this.speed * 240) === 0) {
            this.initializeProperties();
            this.setupDrawingStyles();
        }

        this.rotateCanvasRadians(this.rotate);

        this.requestFrame();
    }
}
