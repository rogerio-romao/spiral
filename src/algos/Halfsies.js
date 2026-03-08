import AL from '../AlgorithmLoader.js';

export default class Halfsies extends AL {
    constructor() {
        super();

        this.name = 'Halfsies';

        this.initializeBaseProperties();
        this.initializeProperties();

        this.requestFrame();
    }

    initializeBaseProperties() {
        this.counter = false;
    }

    initializeProperties() {
        this.rotate = AL.random(3, 37);
        this.width1 = AL.random(2, 11);
        this.width2 = AL.random(2, 11);
        this.radius = AL.random(40, 400);
        this.x = AL.random(AL.w / 2 - this.radius, AL.w / 2 + this.radius);
        this.y = AL.random(AL.h / 2 - this.radius, AL.h / 2 + this.radius);
    }

    draw() {
        AL.ctx.lineWidth = this.t % 2 ? this.width1 : this.width2;
        AL.ctx.strokeStyle = this.t % 2 ? 'black' : 'white';
        this.counter = !this.counter;
        AL.ctx.globalCompositeOperation = this.t % 2 ? 'source-over' : 'difference';

        if (this.t % this.speed === 0) {
            AL.ctx.beginPath();
            AL.ctx.arc(this.x, this.y, this.radius, 0, Math.PI, this.counter);
            AL.ctx.stroke();
            AL.ctx.closePath();
        }

        this.t += 1;

        this.rotateCanvasDegrees(this.rotate);

        if (this.t % (this.speed * 120) === 0) {
            this.initializeProperties();
            AL.ctx.beginPath();
        }

        this.requestFrame();
    }
}
