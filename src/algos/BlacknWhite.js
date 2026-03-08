import AL from '../AlgorithmLoader.js';

export default class BlacknWhite extends AL {
    constructor() {
        super();

        this.name = 'Black & White';

        this.initializeProperties();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeProperties() {
        this.height = this.length / AL.random(1, 5);
        this.length = AL.random(50, Math.min(AL.w, AL.h) / 1.5);
    }

    setupDrawingStyles() {
        AL.ctx.lineWidth = 4;
        AL.ctx.strokeStyle = 'white';
        this.modes = ['source-over', 'difference', 'destination-out'];
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.stagger %= 4;

            if (this.stagger === 0) {
                AL.ctx.beginPath();
                AL.ctx.moveTo(AL.w / 2, AL.h / 2);
                AL.ctx.strokeRect(
                    AL.w / 2 - this.length / 2,
                    AL.h / 2 - this.height / 2,
                    this.length,
                    this.height,
                );

                this.length = AL.random(20, Math.max(AL.w, AL.h));
                this.height = this.length / AL.random(1, 5);
            }

            if (this.stagger === 1) {
                this.rotateCanvasDegrees(AL.random(-180, 180));
            }

            if (this.stagger === 2) {
                AL.ctx.arcTo(this.height, this.length, 0, AL.h / 2, AL.w / 2);
                AL.ctx.stroke();
            }

            if (this.stagger === 3) {
                AL.ctx.arcTo(AL.w / 2, AL.h / 2, AL.random(1, 10), this.height, this.length);
                AL.ctx.stroke();
            }

            this.stagger += 1;
        }

        this.t += 1;

        if (this.t % (this.speed * 100) === 0) {
            AL.ctx.globalCompositeOperation = AL.pickRandomElement(this.modes);
        }

        this.requestFrame();
    }
}
