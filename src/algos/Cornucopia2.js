import AL from '../AlgorithmLoader.js';

export default class Cornucopia2 extends AL {
    constructor() {
        super();

        this.name = 'Cornucopia 2';

        this.initializeProperties();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeProperties() {
        this.height = AL.random(35, 350);
        this.width = AL.random(35, 440);
        this.rotate = AL.random(1, 75);
        this.x = AL.random(0, AL.w);
        this.y = AL.random(0, AL.h);
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
        AL.ctx.setLineDash([AL.random(2, 20), AL.random(5, 25), AL.random(0, 30)]);
        AL.ctx.strokeStyle = AL.randomColor(0, 255, 0.75, 1);
        AL.ctx.fillStyle = AL.randomColor();
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
                false,
                true,
            );

            this.ul += this.ulc;
            this.ur += this.urc;
            this.dl += this.dlc;
            this.dr += this.drc;
        }

        this.t += 1;

        this.rotateCanvasDegrees(this.rotate);

        if (this.t % (this.speed * 300) === 0) {
            this.initializeProperties();
            this.setupDrawingStyles();
        }

        this.requestFrame();
    }
}
