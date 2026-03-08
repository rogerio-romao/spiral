import AL from '../AlgorithmLoader.js';

export default class GasClouds extends AL {
    constructor() {
        super();

        this.name = 'Gas Clouds';

        this.initializeProperties();
        this.firstRunProperties();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    firstRunProperties() {
        this.x = AL.w / 2;
        this.y = AL.h / 2;
    }

    initializeProperties() {
        this.width = AL.random(0, AL.w / 2);
        this.height = AL.random(0, AL.h / 2);
        this.rotate = AL.random(1, 200);
        this.ul = AL.random(0, 300);
        this.ur = AL.random(0, 300);
        this.dl = AL.random(0, 300);
        this.dr = AL.random(0, 300);
        this.x = 0;
        this.y = 0;
    }

    setupDrawingStyles() {
        AL.ctx.strokeStyle = AL.randomColor(0, 150, 0.2, 0.5);
        AL.ctx.fillStyle = AL.randomColor(25, 255, 0.02, 0.04);
    }

    draw() {
        if (this.t % this.speed === 0) {
            AL.ctx.roundRectExtra(
                this.x,
                this.y,
                this.width,
                this.height,
                {
                    lowerLeft: this.dl,
                    lowerRight: this.dr,
                    upperLeft: this.ul,
                    upperRight: this.ur,
                },
                true,
                false,
            );

            this.x += 1;
            this.y += 1;
        }

        this.t += 1;

        if (this.t % (this.speed * 240) === 0) {
            this.initializeProperties();
            this.setupDrawingStyles();
        }

        this.rotateCanvasRadians(this.rotate);

        this.requestFrame();
    }
}
