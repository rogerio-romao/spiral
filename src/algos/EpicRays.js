import AL from '../AlgorithmLoader.js';

export default class EpicRays extends AL {
    constructor() {
        super();

        this.name = 'Epic Rays';

        this.initializeBaseProperties();
        this.initializeProperties();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeBaseProperties() {
        this.rotations = [
            1, 2, 3, 4, 7, 8, 11, 13, 14, 16, 17, 19, 21, 22, 23, 26, 28, 29, 31, 32, 33, 34, 37,
            38, 39, 41, 43,
        ];
        this.rotate = AL.pickRandomElement(this.rotations);

        this.speed = 3;
    }

    initializeProperties() {
        this.pointAx = AL.random(0, AL.w);
        this.pointAy = AL.random(0, AL.h);
        this.pointBx = AL.random(0, AL.w);
        this.pointBy = AL.random(0, AL.h);
        this.pointCx = AL.random(0, AL.w);
        this.pointCy = AL.random(0, AL.h);
    }

    setupDrawingStyles() {
        AL.ctx.strokeStyle = AL.randomColor(40, 255, 0.25, 0.5);
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.stagger %= 4;

            if (this.stagger === 0) {
                AL.ctx.beginPath();
                AL.ctx.moveTo(AL.w / 2, AL.h / 2);
                AL.ctx.lineTo(this.pointAx, this.pointAy);
                AL.ctx.stroke();
            }

            if (this.stagger === 1) {
                AL.ctx.beginPath();
                AL.ctx.moveTo(this.pointAx, this.pointAy);
                AL.ctx.lineTo(this.pointBx, this.pointBy);
                AL.ctx.stroke();
            }

            if (this.stagger === 2) {
                AL.ctx.beginPath();
                AL.ctx.moveTo(this.pointBx, this.pointBy);
                AL.ctx.lineTo(this.pointCx, this.pointCy);
                AL.ctx.stroke();
            }
        }

        this.t += 1;

        this.stagger += 1;

        this.rotateCanvasDegrees(this.rotate);

        if (this.t % (this.speed * 300) === 0) {
            this.initializeProperties();
            this.setupDrawingStyles();
        }

        this.requestFrame();
    }
}
