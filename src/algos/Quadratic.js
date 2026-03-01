// oxlint-disable no-param-reassign
import AL from '../AlgorithmLoader.js';

export default class Quadratic extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.name = 'Quadratic';

        this.initializeBaseProperties();
        this.initializeProperties();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeBaseProperties() {
        this.rotate = AL.random(4, 91);
    }

    initializeProperties() {
        this.startNum = AL.random(5, 50);
        this.firstDiff = AL.random(10, 50);
        this.secondDiff = AL.random(3, 45);
        this.nums = this.createQuadraticSequence(
            this.startNum,
            this.firstDiff,
            this.secondDiff,
        );
    }

    setupDrawingStyles() {
        this.ctx.strokeStyle = AL.randomColor(0, 255, 0.5, 1);
    }

    createQuadraticSequence(startNum, firstDiff, secondDiff) {
        const arr = [startNum];

        while (startNum < Math.max(this.w, this.h)) {
            startNum += firstDiff;
            firstDiff += secondDiff;
            arr.push(startNum);
        }

        return arr;
    }

    draw() {
        if (this.t % this.speed === 0) {
            for (const num of this.nums) {
                this.ctx.strokeRect(
                    this.w / 2 - num / 2,
                    this.h / 2 - num / 2,
                    num,
                    num,
                );
            }
        }

        this.t += 1;

        this.rotateCanvasDegrees(this.rotate);

        if (this.t % (this.speed * 90) === 0) {
            this.initializeProperties();
            this.setupDrawingStyles();
            this.ctx.beginPath();
        }

        if (this.t % (this.speed * 180) === 0) {
            this.initializeBaseProperties();
        }

        this.requestFrame();
    }
}
