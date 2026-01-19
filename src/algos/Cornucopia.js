import AL from '../AlgorithmLoader.js';

export default class Cornucopia extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.name = 'Cornucopia';

        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.x = AL.random(50, this.w - 50);
        this.y = AL.random(50, this.h - 50);
        this.height = AL.random(15, 150);
        this.width = AL.random(15, 240);
        this.rotate = AL.random(3, 32);
        this.ul = AL.random(4, 35);
        this.ur = AL.random(4, 35);
        this.dl = AL.random(4, 35);
        this.dr = AL.random(4, 35);
    }

    setupDrawingStyles() {
        this.ctx.fillStyle = AL.randomColor(0, 255, 0.03, 0.1);
        this.ctx.strokeStyle = AL.randomColor();
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.roundRect(
                this.x,
                this.y,
                this.width++,
                this.height--,
                {
                    upperLeft: this.ul--,
                    upperRight: this.ur++,
                    lowerLeft: this.dl++,
                    lowerRight: this.dr--,
                },
                true,
                false
            );
        }

        this.t++;

        if (this.t % (this.speed * 210) === 0) {
            this.initializeProperties();
            this.setupDrawingStyles();
        }

        this.rotateCanvasRadians(this.rotate);

        requestAnimationFrame(this.draw);
    }
}
