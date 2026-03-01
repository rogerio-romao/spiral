// oxlint-disable no-plusplus
import AL from '../AlgorithmLoader.js';

export default class Universe extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.name = 'Universe';

        this.initializeProperties();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeProperties() {
        this.side1 = AL.random(20, this.w);
        this.side2 = AL.random(20, this.h);
        this.side3 = AL.random(20, this.w);
        this.side4 = AL.random(20, this.h);
        this.side5 = AL.random(20, this.w);
        this.side6 = AL.random(20, this.h);
        this.side7 = AL.random(20, this.w);
        this.side8 = AL.random(20, this.h);
        this.rounded1 = AL.random(5, 250);
        this.rounded2 = AL.random(5, 250);
        this.rounded3 = AL.random(5, 250);
        this.rounded4 = AL.random(5, 250);
        this.x1 = AL.random(0, this.w);
        this.y1 = AL.random(0, this.h);
        this.x2 = AL.random(0, this.w);
        this.y2 = AL.random(0, this.h);
        this.x3 = AL.random(0, this.w);
        this.y3 = AL.random(0, this.h);
        this.x4 = AL.random(0, this.w);
        this.y4 = AL.random(0, this.h);
        this.rotate = AL.random(1, 11);
    }

    setupDrawingStyles() {
        this.ctx.strokeStyle = AL.randomColor(0, 255, 0.5, 1);
        this.ctx.fillStyle = AL.randomColor(0, 255, 0.01, 0.05);
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.stagger %= 4;

            if (this.stagger === 0) {
                this.ctx.roundRectExtra(
                    this.x1++,
                    this.y1++,
                    this.side1++,
                    this.side2++,
                    {
                        lowerLeft: this.rounded1++,
                        lowerRight: this.rounded1++,
                        upperLeft: this.rounded1++,
                        upperRight: this.rounded1++,
                    },
                    false,
                    true,
                );
            }

            if (this.stagger === 1) {
                this.ctx.roundRectExtra(
                    this.x2--,
                    this.y2--,
                    this.side3--,
                    this.side4--,
                    {
                        lowerLeft: this.rounded2++,
                        lowerRight: this.rounded2++,
                        upperLeft: this.rounded2++,
                        upperRight: this.rounded2++,
                    },
                    false,
                    true,
                );
            }

            if (this.stagger === 2) {
                this.ctx.roundRectExtra(
                    this.x3++,
                    this.y3++,
                    this.side5++,
                    this.side6++,
                    {
                        lowerLeft: this.rounded3--,
                        lowerRight: this.rounded3--,
                        upperLeft: this.rounded3--,
                        upperRight: this.rounded3--,
                    },
                    false,
                    true,
                );
            }

            if (this.stagger === 3) {
                this.ctx.roundRectExtra(
                    this.x4,
                    this.y4,
                    this.side7,
                    this.side8,
                    {
                        lowerLeft: this.rounded4--,
                        lowerRight: this.rounded4--,
                        upperLeft: this.rounded4++,
                        upperRight: this.rounded4++,
                    },
                    false,
                    true,
                );
            }

            this.rotateCanvasRadians(this.rotate);
        }

        this.t += 1;

        this.stagger += 1;

        if (this.t % (this.speed * 250) === 0) {
            this.initializeProperties();
            this.setupDrawingStyles();
        }

        this.requestFrame();
    }
}
