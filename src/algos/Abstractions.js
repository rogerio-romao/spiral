import AL from '../AlgorithmLoader.js';

export default class Abstractions extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.name = 'Abstractions';

        this.initializeBaseProperties();
        this.initializeProperties();
        this.setupConstantStyles();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeBaseProperties() {
        this.rotations = [
            1, 2, 3, 4, 7, 8, 11, 13, 14, 16, 17, 19, 21, 22, 23, 26, 28, 29,
            31, 32, 33, 34, 37, 38, 39, 41, 43,
        ];
        this.speed = 3;
    }

    initializeProperties() {
        this.pointAx = AL.random(0, this.w);
        this.pointAy = AL.random(0, this.h);
        this.pointCpAx = AL.random(0, this.w);
        this.pointCpAy = AL.random(0, this.h);
        this.pointBx = AL.random(0, this.w);
        this.pointBy = AL.random(0, this.h);
        this.pointCpBx = AL.random(0, this.w);
        this.pointCpBy = AL.random(0, this.h);
        this.pointCx = AL.random(0, this.w);
        this.pointCy = AL.random(0, this.h);
        this.pointCpCx = AL.random(0, this.w);
        this.pointCpCy = AL.random(0, this.h);
        this.rotate = AL.pickRandomElement(this.rotations);
    }

    setupConstantStyles() {
        this.ctx.shadowBlur = 3;
    }

    setupDrawingStyles() {
        this.ctx.shadowColor = this.ctx.strokeStyle = AL.randomColor(
            0,
            255,
            0.25,
            0.45,
        );
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.stagger %= 4;

            if (this.stagger === 0) {
                this.ctx.beginPath();
                this.ctx.moveTo(this.pointCx, this.pointCy);
                this.ctx.quadraticCurveTo(
                    this.pointCpAx,
                    this.pointCpAy,
                    this.pointAx,
                    this.pointAy,
                );
                this.ctx.stroke();
            }

            if (this.stagger === 1) {
                this.ctx.beginPath();
                this.ctx.moveTo(this.pointAx, this.pointAy);
                this.ctx.quadraticCurveTo(
                    this.pointCpBx,
                    this.pointCpBy,
                    this.pointBx,
                    this.pointBy,
                );
                this.ctx.stroke();
            }

            if (this.stagger === 2) {
                this.ctx.beginPath();
                this.ctx.moveTo(this.pointBx, this.pointBy);
                this.ctx.quadraticCurveTo(
                    this.pointCpCx,
                    this.pointCpCy,
                    this.pointCx,
                    this.pointCy,
                );
                this.ctx.stroke();
            }
        }

        this.t += 1;
        this.stagger += 1;

        this.rotateCanvasDegrees(this.rotate);

        if (this.t % (this.speed * 180) === 0) {
            this.initializeProperties();
            this.setupDrawingStyles();
        }

        this.requestFrame();
    }
}
