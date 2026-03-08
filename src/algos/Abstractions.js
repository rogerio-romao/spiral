import AL from '../AlgorithmLoader.js';

export default class Abstractions extends AL {
    constructor() {
        super();

        this.name = 'Abstractions';

        this.initializeBaseProperties();
        this.initializeProperties();
        this.setupConstantStyles();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeBaseProperties() {
        this.rotations = [
            1, 2, 3, 4, 7, 8, 11, 13, 14, 16, 17, 19, 21, 22, 23, 26, 28, 29, 31, 32, 33, 34, 37,
            38, 39, 41, 43,
        ];
        this.speed = 3;
    }

    initializeProperties() {
        this.pointAx = AL.random(0, AL.w);
        this.pointAy = AL.random(0, AL.h);
        this.pointCpAx = AL.random(0, AL.w);
        this.pointCpAy = AL.random(0, AL.h);
        this.pointBx = AL.random(0, AL.w);
        this.pointBy = AL.random(0, AL.h);
        this.pointCpBx = AL.random(0, AL.w);
        this.pointCpBy = AL.random(0, AL.h);
        this.pointCx = AL.random(0, AL.w);
        this.pointCy = AL.random(0, AL.h);
        this.pointCpCx = AL.random(0, AL.w);
        this.pointCpCy = AL.random(0, AL.h);
        this.rotate = AL.pickRandomElement(this.rotations);
    }

    setupConstantStyles() {
        AL.ctx.shadowBlur = 3;
    }

    setupDrawingStyles() {
        AL.ctx.shadowColor = AL.ctx.strokeStyle = AL.randomColor(0, 255, 0.25, 0.45);
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.stagger %= 4;

            if (this.stagger === 0) {
                AL.ctx.beginPath();
                AL.ctx.moveTo(this.pointCx, this.pointCy);
                AL.ctx.quadraticCurveTo(this.pointCpAx, this.pointCpAy, this.pointAx, this.pointAy);
                AL.ctx.stroke();
            }

            if (this.stagger === 1) {
                AL.ctx.beginPath();
                AL.ctx.moveTo(this.pointAx, this.pointAy);
                AL.ctx.quadraticCurveTo(this.pointCpBx, this.pointCpBy, this.pointBx, this.pointBy);
                AL.ctx.stroke();
            }

            if (this.stagger === 2) {
                AL.ctx.beginPath();
                AL.ctx.moveTo(this.pointBx, this.pointBy);
                AL.ctx.quadraticCurveTo(this.pointCpCx, this.pointCpCy, this.pointCx, this.pointCy);
                AL.ctx.stroke();
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
