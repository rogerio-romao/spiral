import AL from '../AlgorithmLoader.js';

export default class Entropy extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.name = 'Entropy';

        this.initializeProperties();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeProperties() {
        this.rotate = AL.random(1, 181);
        this.width = AL.random(50, this.w);
        this.height = AL.random(50, this.h);

        this.ul = AL.random(10, Math.min(this.w, this.h));
        this.ur = AL.random(10, Math.min(this.w, this.h));
        this.ll = AL.random(10, Math.min(this.w, this.h));
        this.lr = AL.random(10, Math.min(this.w, this.h));
    }

    setupDrawingStyles() {
        this.ctx.strokeStyle = AL.randomColor(0, 255, 1);
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.roundRectExtra(0, 0, this.width++, this.height++, {
                upperLeft: this.ul--,
                upperRight: this.ur--,
                lowerLeft: this.ll--,
                lowerRight: this.lr--,
            });
            this.ctx.roundRectExtra(this.w, this.h, this.height, this.width, {
                upperLeft: this.lr,
                upperRight: this.ll,
                lowerLeft: this.ur,
                lowerRight: this.ul,
            });
        }

        this.t++;

        this.rotateCanvasRadians(this.rotate);

        if (this.t % (this.speed * 405) === 0) {
            this.initializeProperties();

            const colorRoll = Math.random();
            this.ctx.strokeStyle =
                colorRoll < 0.1
                    ? 'black'
                    : colorRoll < 0.2
                      ? 'white'
                      : AL.randomColor(0, 255, 1);

            this.ctx.beginPath();
        }

        this.requestFrame();
    }
}
