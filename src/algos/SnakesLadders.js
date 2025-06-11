import BA from '../BaseAlgorithm.js';

export default class SnakesLadders extends BA {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.div = BA.random(3, 17);
        this.div2 = BA.random(3, 17);
        this.colSize = this.w / this.div;
        this.rowSize = this.h / this.div2;
        this.currCol = 0;
        this.currRow = 0;
        this.rotate = BA.random(1, 83);
    }

    setupDrawingStyles() {
        this.ctx.fillStyle = BA.randomColor(0, 255, 0.12, 0.37);
        this.ctx.strokeStyle = this.ctx.shadowColor = BA.randomColor(
            0,
            255,
            0.65,
            1
        );
        this.ctx.shadowBlur = 3;
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.strokeRect(
                this.colSize * this.currCol,
                this.rowSize * this.currRow,
                this.colSize,
                this.rowSize
            );

            this.currCol++;

            if (this.currCol > this.div - 1) {
                this.currCol = 0;

                this.ctx.translate(this.w / 2, this.h / 2);
                this.ctx.rotate(this.rotate);
                this.ctx.translate(-this.w / 2, -this.h / 2);

                this.currRow++;
                if (this.currRow > this.div2 - 1) {
                    this.currRow = 0;
                }
            }
        }

        if (this.t % (this.speed * 720) === 0) {
            this.rotate = BA.random(1, 83);
            this.div = BA.random(3, 17);
            this.div2 = BA.random(3, 17);
            this.colSize = this.w / this.div;
            this.rowSize = this.h / this.div2;

            this.ctx.fillRect(-this.w, -this.h, 3 * this.w, 3 * this.h);
            this.ctx.beginPath();
            this.ctx.fillStyle = BA.randomColor(0, 255, 0.12, 0.37);
            this.ctx.strokeStyle = this.ctx.shadowColor = BA.randomColor(
                0,
                255,
                0.65,
                1
            );
        }

        this.t++;

        requestAnimationFrame(this.draw);
    }
}
