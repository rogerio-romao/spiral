import AL from '../AlgorithmLoader.js';

export default class Wormhole extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

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
        this.width = AL.random(30, this.w);
        this.height = AL.random(30, this.h);
        this.x = AL.random(50, this.w - 50);
        this.y = AL.random(50, this.h - 50);
    }

    setupDrawingStyles() {
        this.ctx.strokeStyle = AL.randomColor(0, 255, 0.2, 0.5);
        this.ctx.fillStyle = AL.randomColor(0, 255, 0.01, 0.01);
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.roundRectExtra(
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

        this.t++;

        this.rotateCanvasRadians(this.rotate);

        this.width++;
        this.height++;
        this.ul++;
        this.ur++;

        if (this.t % (this.speed * 360) === 0) {
            this.initializeProperties();
            this.setupDrawingStyles();
        }

        this.requestFrame();
    }
}
