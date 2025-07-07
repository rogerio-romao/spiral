import AL from '../AlgorithmLoader.js';

export default class Majestic extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeBaseProperties();
        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeBaseProperties() {
        this.rotations = [
            1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13, 14, 15, 17, 19, 20, 21, 22,
            23, 25, 26, 28, 29, 30, 31, 32, 33, 34, 35, 37, 38, 39, 40, 41, 42,
            43, 44, 45,
        ];
    }

    initializeProperties() {
        this.rotate = AL.pickRandomElement(this.rotations);
        this.x = AL.random(40, this.w - 40);
        this.y = AL.random(40, this.h - 40);
        this.width = AL.random(30, this.w - 100);
        this.height = AL.random(30, this.h - 100);
        this.ul = AL.random(10, this.w);
        this.ur = AL.random(10, this.h);
        this.ll = AL.random(10, this.h);
        this.lr = AL.random(10, this.w);
    }

    setupDrawingStyles() {
        this.ctx.strokeStyle = AL.randomColor();
        this.ctx.fillStyle = AL.randomColor(0, 255, 0.01, 0.05);
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.roundRect(
                this.x,
                this.y,
                this.width,
                this.height,
                {
                    upperLeft: this.ul,
                    upperRight: this.ur,
                    lowerLeft: this.ll,
                    lowerRight: this.lr,
                },
                true,
                true
            );
        }

        this.t++;

        this.rotateCanvasDegrees(this.rotate);

        if (this.t % (this.speed * 180) === 0) {
            this.initializeProperties();

            this.fillScreen();

            this.setupDrawingStyles();
        }

        requestAnimationFrame(this.draw);
    }
}
