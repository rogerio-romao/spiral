import AL from '../AlgorithmLoader.js';

export default class Mirage extends AL {
    constructor() {
        super();

        this.name = 'Mirage';

        this.initializeProperties();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeProperties() {
        this.ul = AL.random(10, 300);
        this.ur = AL.random(10, 300);
        this.ll = AL.random(10, 300);
        this.lr = AL.random(10, 300);
        this.rotate = AL.random(1, 50);
        this.width = AL.random(100, AL.w);
        this.height = AL.random(100, AL.h);
    }

    setupDrawingStyles() {
        AL.ctx.fillStyle = AL.randomColor(0, 255, 0.01, 0.05);
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
                true,
                false,
            );
        }

        this.t += 1;

        this.rotateCanvasRadians(this.rotate);

        if (this.t % (this.speed * 200) === 0) {
            this.initializeProperties();
            this.fillScreen();
            this.setupDrawingStyles();
        }

        this.requestFrame();
    }
}
