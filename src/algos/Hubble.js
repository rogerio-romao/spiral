import AL from '../AlgorithmLoader.js';

export default class Hubble extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.name = 'Hubble';

        this.initializeProperties();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeProperties() {
        this.index = 0;
        this.seq = this.createSeq(13);
        this.rotate = AL.random(1, 44);
        this.currentVal = this.seq[this.index];
    }

    setupDrawingStyles() {
        this.ctx.filter = 'blur(5px)';
        this.ctx.globalCompositeOperation = 'hard-light';
        this.ctx.fillStyle = AL.randomColor(0, 255, 0.01, 0.05);
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.fillRect(
                this.w / 2,
                this.h / 2,
                this.currentVal * 3,
                this.currentVal * 3,
            );
            this.ctx.fillRect(
                this.w / 2,
                this.h / 2,
                this.currentVal * 3,
                -this.currentVal * 3,
            );
            this.ctx.fillRect(
                this.w / 2,
                this.h / 2,
                -this.currentVal * 3,
                this.currentVal * 3,
            );
            this.ctx.fillRect(
                this.w / 2,
                this.h / 2,
                -this.currentVal * 3,
                -this.currentVal * 3,
            );

            this.index += 1;
            if (this.index >= this.seq.length - 1) {
                this.index = 0;
                this.rotate = AL.random(1, 44);
                this.ctx.fillStyle = AL.randomColor(0, 255, 0.01, 0.05);
            }
            this.currentVal = this.seq[this.index];
        }

        this.t += 1;

        this.rotateCanvasDegrees(this.rotate);

        this.requestFrame();
    }

    createSeq(num) {
        const start = [0, 1];
        const values = [];
        for (let i = 1; i <= num; i++) {
            for (let j = 1; j <= num; j++) {
                values.push(j * i * (start.at(-2) + start.at(-1)));
            }
        }
        return values;
    }
}
