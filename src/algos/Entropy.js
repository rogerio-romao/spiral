import AL from '../AlgorithmLoader.js';

export default class Entropy extends AL {
    constructor() {
        super();

        this.name = 'Entropy';

        this.initializeProperties();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeProperties() {
        this.rotate = AL.random(1, 181);
        this.width = AL.random(50, AL.w);
        this.height = AL.random(50, AL.h);

        this.ul = AL.random(10, Math.min(AL.w, AL.h));
        this.ur = AL.random(10, Math.min(AL.w, AL.h));
        this.ll = AL.random(10, Math.min(AL.w, AL.h));
        this.lr = AL.random(10, Math.min(AL.w, AL.h));
    }

    setupDrawingStyles() {
        AL.ctx.strokeStyle = AL.randomColor(0, 255, 1);
    }

    draw() {
        if (this.t % this.speed === 0) {
            AL.ctx.roundRectExtra(0, 0, this.width, this.height, {
                lowerLeft: this.ll,
                lowerRight: this.lr,
                upperLeft: this.ul,
                upperRight: this.ur,
            });

            this.width += 1;
            this.height += 1;
            this.ul -= 1;
            this.ur -= 1;
            this.ll -= 1;
            this.lr -= 1;

            AL.ctx.roundRectExtra(AL.w, AL.h, this.height, this.width, {
                lowerLeft: this.ur,
                lowerRight: this.ul,
                upperLeft: this.lr,
                upperRight: this.ll,
            });
        }

        this.t += 1;

        this.rotateCanvasRadians(this.rotate);

        if (this.t % (this.speed * 405) === 0) {
            this.initializeProperties();

            const colorRoll = Math.random();
            if (colorRoll < 0.1) {
                AL.ctx.strokeStyle = 'black';
            } else if (colorRoll < 0.2) {
                AL.ctx.strokeStyle = 'white';
            } else {
                AL.ctx.strokeStyle = AL.randomColor(0, 255, 1);
            }

            AL.ctx.beginPath();
        }

        this.requestFrame();
    }
}
