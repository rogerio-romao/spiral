import AL from '../AlgorithmLoader.js';

export default class Irradiate extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupConstantStyles();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.rotate = AL.random(1, 181);
        this.width = AL.random(50, this.w / 2);
        this.height = AL.random(50, this.h / 2);
        this.ul = AL.random(10, Math.min(this.w, this.h));
        this.ur = AL.random(10, Math.min(this.w, this.h));
        this.ll = AL.random(10, Math.min(this.w, this.h));
        this.lr = AL.random(10, Math.min(this.w, this.h));
    }

    setupConstantStyles() {
        this.ctx.globalCompositeOperation = 'hard-light';
    }

    setupDrawingStyles() {
        this.ctx.strokeStyle = AL.randomColor(0, 255, 0.33);
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
                }
            );
        }

        this.t++;

        this.rotateCanvasRadians(this.rotate);

        if (this.t % (this.speed * 150) === 0) {
            this.initializeProperties();
            this.setupDrawingStyles();
            this.ctx.beginPath();
        }

        requestAnimationFrame(this.draw);
    }
}
