import AL from '../AlgorithmLoader.js';

export default class LisaJou extends AL {
    constructor() {
        super();

        this.name = 'LisaJou';

        this.initializeProperties();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeProperties() {
        this.radiusX = AL.random(100, AL.w * 0.75);
        this.radiusY = AL.random(100, AL.h * 0.75);
        this.speedX = Math.random() * 3;
        this.speedY = Math.random() * 3;
        this.size = AL.random(2, 16);
        this.angleX = 0;
        this.angleY = 0;
    }

    setupDrawingStyles() {
        AL.ctx.strokeStyle = 'black';
        AL.ctx.fillStyle = AL.randomColor();
        AL.ctx.fillStyle = AL.randomColor();
        AL.ctx.fillRect(0, 0, AL.w, AL.h);
    }

    draw() {
        if (this.t % this.speed === 0) {
            const x = AL.w / 2 + Math.cos(this.angleX) * this.radiusX;
            const y = AL.h / 2 + Math.sin(this.angleY) * this.radiusY;
            this.angleX += this.speedX;
            this.angleY += this.speedY;

            AL.ctx.beginPath();
            AL.ctx.arc(x, y, this.size, 0, 2 * Math.PI);
            AL.ctx.fill();
            AL.ctx.stroke();
        }

        this.t += 1;

        if (this.t % (this.speed * 720) === 0) {
            this.initializeProperties();
            this.setupDrawingStyles();
        }

        this.requestFrame();
    }
}
