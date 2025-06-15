import AL from '../AlgorithmLoader.js';

export default class Hubble extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.seq = this.createSeq(13);
        this.index = 0;
        this.currentVal = this.seq[this.index];
        this.rotate = AL.random(1, 44);
    }

    setupDrawingStyles() {
        this.ctx.fillStyle = AL.randomColor(0, 255, 0.01, 0.05);
        this.ctx.filter = 'blur(5px)';
        this.ctx.globalCompositeOperation = 'hard-light';
    }

    createSeq(num) {
        const start = [0, 1];
        const values = [];
        for (let i = 1; i <= num; i++) {
            for (let j = 1; j <= num; j++) {
                values.push(
                    j * i * (start[start.length - 2] + start[start.length - 1])
                );
            }
        }
        return values;
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.fillRect(
                this.w / 2,
                this.h / 2,
                this.currentVal * 3,
                this.currentVal * 3
            );
            this.ctx.fillRect(
                this.w / 2,
                this.h / 2,
                this.currentVal * 3,
                -this.currentVal * 3
            );
            this.ctx.fillRect(
                this.w / 2,
                this.h / 2,
                -this.currentVal * 3,
                this.currentVal * 3
            );
            this.ctx.fillRect(
                this.w / 2,
                this.h / 2,
                -this.currentVal * 3,
                -this.currentVal * 3
            );

            this.index++;
            if (this.index >= this.seq.length - 1) {
                this.index = 0;
                this.rotate = AL.random(1, 44);
                this.ctx.fillStyle = AL.randomColor(0, 255, 0.01, 0.05);
            }
            this.currentVal = this.seq[this.index];
        }
        this.ctx.translate(this.w / 2, this.h / 2);
        this.ctx.rotate((this.rotate * Math.PI) / 180);
        this.ctx.translate(-this.w / 2, -this.h / 2);

        this.t++;

        requestAnimationFrame(this.draw);
    }
}
