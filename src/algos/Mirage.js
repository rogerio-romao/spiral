import AL from '../AlgorithmLoader.js';

export default class Mirage extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.ul = AL.random(10, 300);
        this.ur = AL.random(10, 300);
        this.ll = AL.random(10, 300);
        this.lr = AL.random(10, 300);
        this.rotate = AL.random(1, 50);
        this.width = AL.random(100, this.w);
        this.height = AL.random(100, this.h);
    }

    setupDrawingStyles() {
        this.ctx.fillStyle = AL.randomColor(0, 255, 0.01, 0.05);
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.roundRect(
                this.w / 2 - this.width / 2,
                this.h / 2 - this.height / 2,
                this.width,
                this.height,
                {
                    upperLeft: this.ul,
                    upperRight: this.ur,
                    lowerLeft: this.ll,
                    lowerRight: this.lr,
                },
                true,
                false
            );
        }

        this.t++;

        this.rotateCanvasRadians(this.rotate);

        if (this.t % (this.speed * 200) === 0) {
            this.initializeProperties();
            this.fillScreen();
            this.setupDrawingStyles();
        }

        requestAnimationFrame(this.draw);
    }
}
