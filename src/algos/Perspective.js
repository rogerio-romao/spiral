import AL from '../AlgorithmLoader.js';

export default class Perspective extends AL {
    constructor() {
        super();

        this.name = 'Perspective';

        this.initializeBaseProperties();
        this.initializeProperties();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeBaseProperties() {
        this.size = 20;
    }

    initializeProperties() {
        this.skewX = Math.random();
        this.skewY = Math.random();
        this.color1 = AL.randomColor(0, 255, 0.2, 0.6);
        this.color2 = AL.randomColor(0, 255, 0.2, 0.6);
    }

    setupDrawingStyles() {
        AL.ctx.fillStyle = this.color1;
    }

    draw() {
        if (this.t % this.speed === 0) {
            AL.ctx.fillStyle = this.color1;
            AL.ctx.setTransform(2, this.skewX, this.skewY, 2, 0, 0);
            AL.ctx.fillRect(
                Math.round(AL.random(-200, AL.w) / this.size) * this.size,
                Math.round(AL.random(-260, AL.h) / this.size) * this.size,
                this.size,
                this.size,
            );
            AL.ctx.fill();

            AL.ctx.fillStyle = this.color2;
            AL.ctx.fillRect(
                Math.round(AL.random(-200, AL.w) / this.size) * this.size,
                Math.round(AL.random(-260, AL.h) / this.size) * this.size,
                this.size,
                this.size,
            );
            AL.ctx.fill();
        }

        this.t += 1;

        if (this.t % (this.speed * 2000) === 0) {
            this.initializeProperties();
            AL.ctx.clearRect(-200, -200, AL.w, AL.h);
        }

        this.requestFrame();
    }
}
