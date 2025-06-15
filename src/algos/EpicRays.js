import AL from '../AlgorithmLoader.js';

export default class EpicRays extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.pointAx = AL.random(0, this.w);
        this.pointAy = AL.random(0, this.h);
        this.pointBx = AL.random(0, this.w);
        this.pointBy = AL.random(0, this.h);
        this.pointCx = AL.random(0, this.w);
        this.pointCy = AL.random(0, this.h);

        this.rotations = [
            1, 2, 3, 4, 7, 8, 11, 13, 14, 16, 17, 19, 21, 22, 23, 26, 28, 29,
            31, 32, 33, 34, 37, 38, 39, 41, 43,
        ];
        this.rotate = this.rotations[AL.random(0, this.rotations.length)];
    }

    setupDrawingStyles() {
        this.ctx.strokeStyle = AL.randomColor(40, 255, 0.25, 0.5);
        this.speed = 3;
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.stagger = this.stagger % 4;

            if (this.stagger === 0) {
                this.ctx.beginPath();
                this.ctx.moveTo(this.w / 2, this.h / 2);
                this.ctx.lineTo(this.pointAx, this.pointAy);
                this.ctx.stroke();
            }

            if (this.stagger === 1) {
                this.ctx.beginPath();
                this.ctx.moveTo(this.pointAx, this.pointAy);
                this.ctx.lineTo(this.pointBx, this.pointBy);
                this.ctx.stroke();
            }

            if (this.stagger === 2) {
                this.ctx.beginPath();
                this.ctx.moveTo(this.pointBx, this.pointBy);
                this.ctx.lineTo(this.pointCx, this.pointCy);
                this.ctx.stroke();
            }
        }

        this.ctx.translate(this.w / 2, this.h / 2);
        this.ctx.rotate((this.rotate * Math.PI) / 180);
        this.ctx.translate(-this.w / 2, -this.h / 2);

        if (this.t % (this.speed * 300) === 0) {
            this.ctx.strokeStyle = AL.randomColor(40, 255, 0.25, 0.5);
            this.pointAx = AL.random(0, this.w);
            this.pointAy = AL.random(0, this.h);
            this.pointBx = AL.random(0, this.w);
            this.pointBy = AL.random(0, this.h);
            this.pointCx = AL.random(0, this.w);
            this.pointCy = AL.random(0, this.h);
        }

        this.stagger++;

        this.t++;

        requestAnimationFrame(this.draw);
    }
}
