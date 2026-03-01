import AL from '../AlgorithmLoader.js';

export default class Tripping extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.name = 'Tripping';

        this.initializeProperties();
        this.setupConstantStyles();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeProperties() {
        this.x1 = AL.random(0, this.w);
        this.y1 = AL.random(0, this.h);
        this.x2 = AL.random(0, this.w);
        this.y2 = AL.random(0, this.h);
        this.rotate = AL.random(1, 360);
        this.width = AL.random(50, this.w);
        this.height = AL.random(50, this.h);
        this.ul = AL.random(10, Math.max(this.w, this.h));
        this.ur = AL.random(10, Math.max(this.w, this.h));
        this.ll = AL.random(10, Math.max(this.w, this.h));
        this.lr = AL.random(10, Math.max(this.w, this.h));
    }

    setupConstantStyles() {
        this.ctx.lineWidth = 0.5;
    }

    setupDrawingStyles() {
        this.ctx.strokeStyle = AL.randomColor(0, 255, 0.25, 0.5);
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.roundRectExtra(this.x1, this.y1, this.width, this.height, {
                lowerLeft: this.ll,
                lowerRight: this.lr,
                upperLeft: this.ul,
                upperRight: this.ur,
            });

            this.x1 += 1;
            this.y1 += 1;
            this.width += 1;
            this.height += 1;
            this.ul += 1;
            this.ur += 1;
            this.ll += 1;
            this.lr += 1;

            this.ctx.roundRectExtra(this.x2, this.y2, this.height, this.width, {
                lowerLeft: this.ur,
                lowerRight: this.ul,
                upperLeft: this.lr,
                upperRight: this.ll,
            });

            this.x2 -= 1;
            this.y2 -= 1;
        }

        this.t += 1;

        this.rotateCanvasRadians(this.rotate);

        if (this.t % (this.speed * 540) === 0) {
            this.initializeProperties();
            this.setupDrawingStyles();
            this.clearScreen();
            this.ctx.beginPath();
        }

        this.requestFrame();
    }
}
