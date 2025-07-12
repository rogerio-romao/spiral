import AL from '../AlgorithmLoader.js';

export default class Progression extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.height = AL.random(40, this.h);
        this.width = AL.random(40, this.w);
        this.rotate = AL.random(1, 180);
        this.round = AL.random(1, 350);
    }

    setupDrawingStyles() {
        this.ctx.fillStyle = AL.randomColor(0, 255, 0.01, 0.03);
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.roundRect(
                this.w / 2,
                this.h / 2,
                this.width,
                this.height,
                {
                    upperLeft: this.round,
                    upperRight: this.round,
                    lowerLeft: this.round,
                    lowerRight: this.round,
                },
                true,
                false
            );
        }

        this.t++;

        this.rotateCanvasDegrees(this.rotate);

        if (this.t % (this.speed * 180) === 0) {
            this.initializeProperties();
            this.setupDrawingStyles();
            this.ctx.beginPath();
        }

        this.interval = requestAnimationFrame(this.draw);
    }
}
