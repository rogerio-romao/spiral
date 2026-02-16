import AL from '../AlgorithmLoader.js';

export default class Cornucopia2 extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.name = 'Cornucopia 2';

        this.initializeProperties();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeProperties() {
        this.height = AL.random(35, 350);
        this.width = AL.random(35, 440);
        this.rotate = AL.random(1, 75);
        this.x = AL.random(0, this.w);
        this.y = AL.random(0, this.h);
        this.ul = AL.random(4, 135);
        this.ulc = AL.random(-5, 5);
        this.ur = AL.random(4, 135);
        this.urc = AL.random(-5, 5);
        this.dl = AL.random(4, 135);
        this.dlc = AL.random(-5, 5);
        this.dr = AL.random(4, 135);
        this.drc = AL.random(-5, 5);
    }

    setupDrawingStyles() {
        this.ctx.strokeStyle = AL.randomColor(0, 255, 0.75, 1);
        this.ctx.fillStyle = AL.randomColor();
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.roundRectExtra(
                this.x,
                this.y,
                this.width,
                this.height,
                {
                    upperLeft: this.ul,
                    upperRight: this.ur,
                    lowerLeft: this.dl,
                    lowerRight: this.dr,
                },
                false,
                true,
            );

            this.ul += this.ulc;
            this.ur += this.urc;
            this.dl += this.dlc;
            this.dr += this.drc;
        }

        this.t++;

        this.rotateCanvasRadians(this.rotate);

        if (this.t % (this.speed * 450) === 0) {
            this.initializeProperties();
            this.setupDrawingStyles();
        }

        this.requestFrame();
    }
}
