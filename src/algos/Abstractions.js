import BA from '../BaseAlgorithm.js';

export default class Abstractions extends BA {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.pointAx = BA.random(0, this.w);
        this.pointAy = BA.random(0, this.h);
        this.pointCpAx = BA.random(0, this.w);
        this.pointCpAy = BA.random(0, this.h);
        this.pointBx = BA.random(0, this.w);
        this.pointBy = BA.random(0, this.h);
        this.pointCpBx = BA.random(0, this.w);
        this.pointCpBy = BA.random(0, this.h);
        this.pointCx = BA.random(0, this.w);
        this.pointCy = BA.random(0, this.h);
        this.pointCpCx = BA.random(0, this.w);
        this.pointCpCy = BA.random(0, this.h);

        this.rotations = [
            1, 2, 3, 4, 7, 8, 11, 13, 14, 16, 17, 19, 21, 22, 23, 26, 28, 29,
            31, 32, 33, 34, 37, 38, 39, 41, 43,
        ];
        this.rotate = this.rotations[BA.random(0, this.rotations.length)];

        this.speed = 3;
    }

    setupDrawingStyles() {
        this.ctx.shadowColor = this.ctx.strokeStyle = BA.randomColor(
            0,
            255,
            0.25,
            0.45
        );
        this.ctx.shadowBlur = 3;
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.stagger = this.stagger % 4;

            if (this.stagger === 0) {
                this.ctx.beginPath();
                this.ctx.moveTo(this.pointCx, this.pointCy);
                this.ctx.quadraticCurveTo(
                    this.pointCpAx,
                    this.pointCpAy,
                    this.pointAx,
                    this.pointAy
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
                    this.pointBy
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
                    this.pointCy
                );
                this.ctx.stroke();
            }
        }

        this.ctx.translate(this.w / 2, this.h / 2);
        this.ctx.rotate((this.rotate * Math.PI) / 180);
        this.ctx.translate(-this.w / 2, -this.h / 2);

        if (this.t % (this.speed * 180) === 0) {
            this.pointAx = BA.random(0, this.w);
            this.pointAy = BA.random(0, this.h);
            this.pointCpAx = BA.random(0, this.w);
            this.pointCpAy = BA.random(0, this.h);
            this.pointBx = BA.random(0, this.w);
            this.pointBy = BA.random(0, this.h);
            this.pointCpBx = BA.random(0, this.w);
            this.pointCpBy = BA.random(0, this.h);
            this.pointCx = BA.random(0, this.w);
            this.pointCy = BA.random(0, this.h);
            this.pointCpCx = BA.random(0, this.w);
            this.pointCpCy = BA.random(0, this.h);
            this.rotate = this.rotations[BA.random(0, this.rotations.length)];

            this.ctx.shadowColor = this.ctx.strokeStyle = BA.randomColor(
                0,
                255,
                0.25,
                0.45
            );
        }

        this.stagger++;

        this.t++;

        requestAnimationFrame(this.draw);
    }
}
