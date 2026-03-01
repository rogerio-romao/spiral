import AL from '../AlgorithmLoader.js';

export default class BlacknWhite extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.name = 'Black & White';

        this.initializeProperties();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeProperties() {
        this.height = this.length / AL.random(1, 5);
        this.length = AL.random(50, Math.min(this.w, this.h) / 1.5);
    }

    setupDrawingStyles() {
        this.ctx.lineWidth = 4;
        this.ctx.strokeStyle = 'white';
        this.modes = ['source-over', 'difference', 'destination-out'];
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.stagger %= 4;

            if (this.stagger === 0) {
                this.ctx.beginPath();
                this.ctx.moveTo(this.w / 2, this.h / 2);
                this.ctx.strokeRect(
                    this.w / 2 - this.length / 2,
                    this.h / 2 - this.height / 2,
                    this.length,
                    this.height,
                );

                this.length = AL.random(20, Math.max(this.w, this.h));
                this.height = this.length / AL.random(1, 5);
            }

            if (this.stagger === 1) {
                this.rotateCanvasDegrees(AL.random(-180, 180));
            }

            if (this.stagger === 2) {
                this.ctx.arcTo(
                    this.height,
                    this.length,
                    0,
                    this.h / 2,
                    this.w / 2,
                );
                this.ctx.stroke();
            }

            if (this.stagger === 3) {
                this.ctx.arcTo(
                    this.w / 2,
                    this.h / 2,
                    AL.random(1, 10),
                    this.height,
                    this.length,
                );
                this.ctx.stroke();
            }

            this.stagger += 1;
        }

        this.t += 1;

        if (this.t % (this.speed * 100) === 0) {
            this.ctx.globalCompositeOperation = AL.pickRandomElement(
                this.modes,
            );
        }

        this.requestFrame();
    }
}
