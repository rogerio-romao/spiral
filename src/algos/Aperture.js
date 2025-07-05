import AL from '../AlgorithmLoader.js';

export default class Aperture extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeBaseProperties();
        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeBaseProperties() {
        this.white = true;
    }

    initializeProperties() {
        this.x = this.w / 2;
        this.y = AL.random(100, this.h - 100);
        this.width = AL.random(100, this.w - 100);
        this.height = AL.random(100, this.h - 100);
        this.round = AL.random(5, 100);
        this.rotate = AL.random(1, 70);
        this.incX = Math.random();
        this.incH = Math.random();
    }

    setupDrawingStyles() {
        this.ctx.strokeStyle = 'white';
        this.ctx.fillStyle = 'black';
        this.ctx.globalAlpha = 0.75;
        this.ctx.lineWidth = 4;
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.roundRect(
                this.x,
                this.y,
                this.width,
                this.height,
                {
                    upperLeft: this.round,
                    upperRight: this.round,
                    lowerLeft: this.round,
                    lowerRight: this.round,
                },
                true
            );
        }

        this.t++;

        this.x += this.incX;
        this.height += this.incH;

        this.rotateCanvasRadians(this.rotate);

        if (this.t % (this.speed * 300) === 0) {
            if (this.white) {
                this.ctx.strokeStyle = 'black';
                this.ctx.fillStyle = 'white';
            } else {
                this.ctx.strokeStyle = 'white';
                this.ctx.fillStyle = 'black';
            }

            this.white = !this.white;

            this.initializeProperties();

            this.ctx.beginPath();
        }

        requestAnimationFrame(this.draw);
    }
}
