import AL from '../AlgorithmLoader.js';

export default class Germinate extends AL {
    constructor() {
        super();

        this.name = 'Germinate';

        this.initializeBaseProperties();
        this.initializeProperties();
        this.setupConstantStyles();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeBaseProperties() {
        this.angles = [
            5, 6, 8, 9, 10, 12, 15, 16, 18, 20, 24, 32, 35, 36, 42, 44, 45, 48, 50, 55, 64, 65, 66,
            70, 72, 75, 95, 100,
        ];
    }

    initializeProperties() {
        this.rotate = AL.pickRandomElement(this.angles);
        this.width = AL.random(35, AL.w * 0.8);
        this.height = AL.random(35, AL.h * 0.8);
        this.ul = AL.random(4, 115);
        this.ur = AL.random(4, 115);
        this.dl = AL.random(4, 115);
        this.dr = AL.random(4, 115);
        AL.wc = AL.random(-5, 6);
        AL.hc = AL.random(-5, 6);
        this.rc = AL.random(-7, 8);
    }

    setupConstantStyles() {
        AL.ctx.shadowBlur = 2;
    }

    setupDrawingStyles() {
        AL.ctx.fillStyle = AL.randomColor(0, 255, 0.2, 0.2);
        AL.ctx.strokeStyle = AL.ctx.shadowColor = AL.randomColor(0, 255, 1, 1);
    }

    draw() {
        if (this.t % this.speed === 0) {
            AL.ctx.roundRectExtra(
                AL.w / 2,
                AL.h / 2,
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
        }

        this.t += 1;

        if (this.t % (this.speed * 4) === 0) {
            this.ul += this.rc;
            this.ur += AL.wc;
            this.dr += AL.hc;
            this.dl -= this.rc;
        }

        if (this.t % (this.speed * 12) === 0) {
            this.width -= AL.wc;
            this.height += AL.hc;
        }

        if (this.t % (this.speed * 280) === 0) {
            this.initializeProperties();
            this.setupDrawingStyles();

            this.fillScreen();
        }

        this.rotateCanvasDegrees(this.rotate);

        this.requestFrame();
    }
}
