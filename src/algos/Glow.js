import AL from '../AlgorithmLoader.js';

export default class Glow extends AL {
    constructor() {
        super();

        this.name = 'Glow';

        this.initializeProperties();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeProperties() {
        this.modes = ['color', 'source-over', 'overlay', 'soft-light'];
        this.color1 = AL.randomColor(0, 255, 0.05, 0.2);
        this.color2 = AL.randomColor(0, 255, 0.05, 0.2);
        this.margin1 = AL.random(25, AL.w / 4);
        this.margin2 = AL.random(25, AL.w / 4);
        this.rotate = AL.random(1, 60);
    }

    setupDrawingStyles() {
        AL.ctx.strokeStyle = 'white';
        AL.ctx.globalCompositeOperation = 'color';
    }

    draw() {
        if (this.t % this.speed === 0) {
            AL.ctx.fillStyle = this.color1;
            AL.ctx.fillRect(0, 0, AL.w / 2 + this.margin1, AL.h);
            AL.ctx.fillStyle = this.color2;
            AL.ctx.fillRect(AL.w / 2 - this.margin2, 0, AL.w, AL.h);
        }

        this.t += 1;

        this.rotateCanvasDegrees(this.rotate);

        if (this.t % (this.speed * 60) === 0) {
            this.margin1 = AL.random(25, AL.w / 4);
            this.color1 = AL.randomColor(0, 255, 0.05, 0.2);
        }

        if (this.t % (this.speed * 90) === 0) {
            this.margin2 = AL.random(25, AL.w / 4);
            this.color2 = AL.randomColor(0, 255, 0.05, 0.2);
        }

        if (this.t % (this.speed * 180) === 0) {
            this.rotate = AL.random(1, 60);
            AL.ctx.globalCompositeOperation = AL.pickRandomElement(this.modes);
        }

        this.requestFrame();
    }
}
