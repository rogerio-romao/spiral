// oxlint-disable no-plusplus
import AL from '../AlgorithmLoader.js';

export default class Spikey extends AL {
    constructor() {
        super();

        this.name = 'Spikey';

        this.initializeProperties();
        this.setupConstantStyles();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeProperties() {
        this.rounded1 = AL.random(75, 475);
        this.rounded2 = AL.random(75, 475);
        this.rounded3 = AL.random(75, 475);
        this.rounded4 = AL.random(75, 475);
        this.side1 = AL.random(0, AL.w / 4);
        this.side2 = AL.random(0, AL.h / 4);
        this.side3 = AL.random(0, AL.w / 4);
        this.side4 = AL.random(0, AL.h / 4);
        this.rotate = (AL.random(2, 358) * Math.PI) / 180;
    }

    setupConstantStyles() {
        AL.ctx.beginPath();
        AL.ctx.lineWidth = 0.25;
        AL.ctx.moveTo(AL.w / 2, AL.h / 2);
    }

    setupDrawingStyles() {
        AL.ctx.strokeStyle = AL.randomColor(60, 255, 1, 1);
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.stagger %= 2;

            if (this.stagger === 0) {
                AL.ctx.translate(AL.w / 2, AL.h / 2);
                AL.ctx.rotate(this.rotate);
                AL.ctx.roundRectExtra(
                    this.side1--,
                    this.side2--,
                    this.side1--,
                    this.side2--,
                    {
                        lowerLeft: this.rounded3++,
                        lowerRight: this.rounded4++,
                        upperLeft: this.rounded1++,
                        upperRight: this.rounded2++,
                    },
                    false,
                    true,
                );
                AL.ctx.translate(-AL.w / 2, -AL.h / 2);
            }

            if (this.stagger === 1) {
                AL.ctx.translate(AL.w / 2, AL.h / 2);
                AL.ctx.rotate(this.rotate);
                AL.ctx.roundRectExtra(
                    this.side3++,
                    this.side4++,
                    this.side3++,
                    this.side4++,
                    {
                        lowerLeft: this.rounded2--,
                        lowerRight: this.rounded1--,
                        upperLeft: this.rounded3--,
                        upperRight: this.rounded4--,
                    },
                    false,
                    true,
                );

                AL.ctx.translate(-AL.w / 2, -AL.h / 2);
            }

            this.stagger += 1;
        }

        this.t += 1;

        if (this.t % (this.speed * 400) === 0) {
            this.initializeProperties();

            AL.ctx.save();
            AL.ctx.resetTransform();
            this.clearScreen();
            AL.ctx.restore();

            AL.ctx.beginPath();
            this.setupDrawingStyles();
        }

        this.requestFrame();
    }
}
