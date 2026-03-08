import AL from '../AlgorithmLoader.js';

export default class Cornucopia extends AL {
    constructor() {
        super();

        this.name = 'Cornucopia';

        this.initializeProperties();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeProperties() {
        this.x = AL.random(50, AL.w - 50);
        this.y = AL.random(50, AL.h - 50);
        this.height = AL.random(15, 150);
        this.width = AL.random(15, 240);
        this.rotate = AL.random(3, 32);
        this.ul = AL.random(4, 35);
        this.ur = AL.random(4, 35);
        this.dl = AL.random(4, 35);
        this.dr = AL.random(4, 35);
    }

    setupDrawingStyles() {
        AL.ctx.fillStyle = AL.randomColor(0, 255, 0.03, 0.1);
        AL.ctx.strokeStyle = AL.randomColor();
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
                true,
                false,
            );

            this.width += 1;
            this.height -= 1;
            this.dl += 1;
            this.dr -= 1;
            this.ul -= 1;
            this.ur += 1;
        }

        this.t += 1;

        if (this.t % (this.speed * 210) === 0) {
            this.initializeProperties();
            this.setupDrawingStyles();
        }

        this.rotateCanvasRadians(this.rotate);

        this.requestFrame();
    }
}
