import AL from '../AlgorithmLoader.js';

export default class Perspective extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeConstantProperties();
        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeConstantProperties() {
        this.size = 20;
    }

    initializeProperties() {
        this.color1 = AL.randomColor(0, 255, 0.2, 0.6);
        this.color2 = AL.randomColor(0, 255, 0.2, 0.6);
        this.skewX = Math.random();
        this.skewY = Math.random();
    }

    setupDrawingStyles() {
        this.ctx.fillStyle = this.color1;
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.fillStyle = this.color1;
            this.ctx.setTransform(2, this.skewX, this.skewY, 2, 0, 0);
            this.ctx.fillRect(
                Math.round(AL.random(-200, this.w) / this.size) * this.size,
                Math.round(AL.random(-260, this.h) / this.size) * this.size,
                this.size,
                this.size
            );
            this.ctx.fill();

            this.ctx.fillStyle = this.color2;
            this.ctx.fillRect(
                Math.round(AL.random(-200, this.w) / this.size) * this.size,
                Math.round(AL.random(-260, this.h) / this.size) * this.size,
                this.size,
                this.size
            );
            this.ctx.fill();
        }

        this.t++;

        if (this.t % (this.speed * 2000) === 0) {
            this.initializeProperties();
            this.ctx.clearRect(-200, -200, this.w, this.h);
        }

        requestAnimationFrame(this.draw);
    }
}
