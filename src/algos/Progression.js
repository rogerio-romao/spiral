import AL from '../AlgorithmLoader.js';

export default class Progression extends AL {
    constructor() {
        super();

        this.name = 'Progression';

        this.initializeProperties();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeProperties() {
        this.height = AL.random(40, AL.h);
        this.width = AL.random(40, AL.w);
        this.rotate = AL.random(1, 180);
        this.round = AL.random(1, 350);
    }

    setupDrawingStyles() {
        AL.ctx.fillStyle = AL.randomColor(0, 255, 0.01, 0.03);
    }

    draw() {
        if (this.t % this.speed === 0) {
            AL.ctx.roundRectExtra(
                AL.w / 2,
                AL.h / 2,
                this.width,
                this.height,
                {
                    lowerLeft: this.round,
                    lowerRight: this.round,
                    upperLeft: this.round,
                    upperRight: this.round,
                },
                true,
                false,
            );
        }

        this.t += 1;

        this.rotateCanvasDegrees(this.rotate);

        if (this.t % (this.speed * 180) === 0) {
            this.initializeProperties();
            this.setupDrawingStyles();
            AL.ctx.beginPath();
        }

        this.requestFrame();
    }
}
