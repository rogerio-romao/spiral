import AL from '../AlgorithmLoader.js';

export default class Glow extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.name = 'Glow';

        this.initializeProperties();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeProperties() {
        this.modes = ['color', 'source-over', 'overlay', 'soft-light'];
        this.color1 = AL.randomColor(0, 255, 0.05, 0.2);
        this.color2 = AL.randomColor(0, 255, 0.05, 0.2);
        this.margin1 = AL.random(25, this.w / 4);
        this.margin2 = AL.random(25, this.w / 4);
        this.rotate = AL.random(1, 60);
    }

    setupDrawingStyles() {
        this.ctx.strokeStyle = 'white';
        this.ctx.globalCompositeOperation = 'color';
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.fillStyle = this.color1;
            this.ctx.fillRect(0, 0, this.w / 2 + this.margin1, this.h);
            this.ctx.fillStyle = this.color2;
            this.ctx.fillRect(this.w / 2 - this.margin2, 0, this.w, this.h);
        }

        this.t += 1;

        this.rotateCanvasDegrees(this.rotate);

        if (this.t % (this.speed * 60) === 0) {
            this.margin1 = AL.random(25, this.w / 4);
            this.color1 = AL.randomColor(0, 255, 0.05, 0.2);
        }

        if (this.t % (this.speed * 90) === 0) {
            this.margin2 = AL.random(25, this.w / 4);
            this.color2 = AL.randomColor(0, 255, 0.05, 0.2);
        }

        if (this.t % (this.speed * 180) === 0) {
            this.rotate = AL.random(1, 60);
            this.ctx.globalCompositeOperation = AL.pickRandomElement(
                this.modes,
            );
        }

        this.requestFrame();
    }
}
