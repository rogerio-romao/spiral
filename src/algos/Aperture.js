import AL from '../AlgorithmLoader.js';

export default class Aperture extends AL {
    constructor() {
        super();

        this.name = 'Aperture';

        this.initializeBaseProperties();
        this.initializeProperties();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeBaseProperties() {
        this.white = true;
    }

    initializeProperties() {
        this.height = AL.random(100, AL.h - 100);
        this.width = AL.random(100, AL.w - 100);
        this.y = AL.random(100, AL.h - 100);
        this.round = AL.random(5, 100);
        this.rotate = AL.random(1, 70);
        this.incX = Math.random();
        this.incH = Math.random();
        this.x = AL.w / 2;
    }

    setupDrawingStyles() {
        AL.ctx.strokeStyle = 'white';
        AL.ctx.fillStyle = 'black';
        AL.ctx.globalAlpha = 0.75;
        AL.ctx.lineWidth = 4;
    }

    draw() {
        if (this.t % this.speed === 0) {
            AL.ctx.roundRectExtra(
                this.x,
                this.y,
                this.width,
                this.height,
                {
                    lowerLeft: this.round,
                    lowerRight: this.round,
                    upperLeft: this.round,
                    upperRight: this.round,
                },
                true,
            );
        }

        this.t += 1;

        this.x += this.incX;
        this.height += this.incH;

        this.rotateCanvasRadians(this.rotate);

        if (this.t % (this.speed * 300) === 0) {
            if (this.white) {
                AL.ctx.strokeStyle = 'black';
                AL.ctx.fillStyle = 'white';
            } else {
                AL.ctx.strokeStyle = 'white';
                AL.ctx.fillStyle = 'black';
            }

            this.white = !this.white;

            this.initializeProperties();

            AL.ctx.beginPath();
        }

        this.requestFrame();
    }
}
