import AL from '../AlgorithmLoader.js';

export default class Wormhole extends AL {
    constructor() {
        super();

        this.name = 'Wormhole';

        this.initializeProperties();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeProperties() {
        this.ul = AL.random(10, 50);
        this.ur = AL.random(10, 50);
        this.ll = AL.random(10, 50);
        this.lr = AL.random(10, 50);
        this.rotate = AL.random(1, 44);
        this.width = AL.random(30, AL.w);
        this.height = AL.random(30, AL.h);
        this.x = AL.random(50, AL.w - 50);
        this.y = AL.random(50, AL.h - 50);
    }

    setupDrawingStyles() {
        AL.ctx.strokeStyle = AL.randomColor(0, 255, 0.2, 0.5);
        AL.ctx.fillStyle = AL.randomColor(0, 255, 0.01, 0.01);
    }

    draw() {
        if (this.t % this.speed === 0) {
            AL.ctx.roundRectExtra(
                this.x,
                this.y,
                this.width,
                this.height,
                {
                    lowerLeft: this.ll,
                    lowerRight: this.lr,
                    upperLeft: this.ul,
                    upperRight: this.ur,
                },
                true,
                true,
            );
        }

        this.t += 1;

        this.rotateCanvasRadians(this.rotate);

        this.width += 1;
        this.height += 1;
        this.ul += 1;
        this.ur += 1;

        if (this.t % (this.speed * 360) === 0) {
            this.initializeProperties();
            this.setupDrawingStyles();
        }

        this.requestFrame();
    }
}
