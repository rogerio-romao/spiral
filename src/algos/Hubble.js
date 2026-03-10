import AL from '../AlgorithmLoader.js';

export default class Hubble extends AL {
    constructor() {
        super();

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
        AL.ctx.filter = 'blur(5px)';
        AL.ctx.globalCompositeOperation = 'hard-light';
        AL.ctx.fillStyle = AL.randomColor(0, 255, 0.01, 0.05);
    }

    draw() {
        if (this.t % this.speed === 0) {
            AL.ctx.fillRect(AL.w / 2, AL.h / 2, this.currentVal * 3, this.currentVal * 3);
            AL.ctx.fillRect(AL.w / 2, AL.h / 2, this.currentVal * 3, -this.currentVal * 3);
            AL.ctx.fillRect(AL.w / 2, AL.h / 2, -this.currentVal * 3, this.currentVal * 3);
            AL.ctx.fillRect(AL.w / 2, AL.h / 2, -this.currentVal * 3, -this.currentVal * 3);

            this.index += 1;
            if (this.index >= this.seq.length - 1) {
                this.index = 0;
                this.rotate = AL.random(1, 44);
                AL.ctx.fillStyle = AL.randomColor(0, 255, 0.01, 0.05);
            }
            this.currentVal = this.seq[this.index];
        }

        this.t += 1;

        this.rotateCanvasDegrees(this.rotate);

        this.requestFrame();
    }

    /**
     * @param {number} num - length of the sequence
     * @returns {number[]} - the generated sequence
     */
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
