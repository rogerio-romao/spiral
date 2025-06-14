import BA from '../BaseAlgorithm.js';

export default class Quadratic extends BA {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.rot = BA.random(4, 91);
        this.startNum = BA.random(5, 50);
        this.firstDiff = BA.random(10, 50);
        this.secondDiff = BA.random(3, 45);
        this.nums = this.createQuadraticSequence(
            this.startNum,
            this.firstDiff,
            this.secondDiff
        );
    }

    setupDrawingStyles() {
        this.ctx.strokeStyle = BA.randomColor(0, 255, 0.5, 1);
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
            this.nums.forEach((num) => {
                this.ctx.strokeRect(
                    this.w / 2 - num / 2,
                    this.h / 2 - num / 2,
                    num,
                    num
                );
            });
        }

        this.ctx.translate(this.w / 2, this.h / 2);
        this.ctx.rotate((this.rot * Math.PI) / 180);
        this.ctx.translate(-this.w / 2, -this.h / 2);

        if (this.t % (this.speed * 90) === 0) {
            this.ctx.beginPath();
            this.ctx.strokeStyle = BA.randomColor(0, 255, 0.5, 1);
            this.startNum = BA.random(5, 50);
            this.firstDiff = BA.random(10, 50);
            this.secondDiff = BA.random(3, 45);
            this.nums = this.createQuadraticSequence(
                this.startNum,
                this.firstDiff,
                this.secondDiff
            );
        }

        if (this.t % (this.speed * 180) === 0) {
            this.rot = BA.random(4, 91);
        }

        this.t++;

        requestAnimationFrame(this.draw);
    }
}
