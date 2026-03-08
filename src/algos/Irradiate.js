import AL from '../AlgorithmLoader.js';

export default class Irradiate extends AL {
    constructor() {
        super();

        this.name = 'Irradiate';

        this.initializeProperties();
        this.setupConstantStyles();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeProperties() {
        this.rotate = AL.random(1, 181);
        this.width = AL.random(50, AL.w / 2);
        this.height = AL.random(50, AL.h / 2);
        this.ul = AL.random(10, Math.min(AL.w, AL.h));
        this.ur = AL.random(10, Math.min(AL.w, AL.h));
        this.ll = AL.random(10, Math.min(AL.w, AL.h));
        this.lr = AL.random(10, Math.min(AL.w, AL.h));
    }

    setupConstantStyles() {
        AL.ctx.globalCompositeOperation = 'hard-light';
    }

    setupDrawingStyles() {
        AL.ctx.strokeStyle = AL.randomColor(0, 255, 0.33);
    }

    draw() {
        if (this.t % this.speed === 0) {
            AL.ctx.roundRectExtra(
                AL.w / 2 - this.width / 2,
                AL.h / 2 - this.height / 2,
                this.width,
                this.height,
                {
                    lowerLeft: this.ll,
                    lowerRight: this.lr,
                    upperLeft: this.ul,
                    upperRight: this.ur,
                },
            );
        }

        this.t += 1;

        this.rotateCanvasRadians(this.rotate);

        if (this.t % (this.speed * 150) === 0) {
            this.initializeProperties();
            this.setupDrawingStyles();
            AL.ctx.beginPath();
        }

        this.requestFrame();
    }
}
