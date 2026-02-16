import AL from '../AlgorithmLoader.js';

export default class Spikey extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

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
        this.side1 = AL.random(0, this.w / 4);
        this.side2 = AL.random(0, this.h / 4);
        this.side3 = AL.random(0, this.w / 4);
        this.side4 = AL.random(0, this.h / 4);
        this.rotate = (AL.random(2, 358) * Math.PI) / 180;
    }

    setupConstantStyles() {
        this.ctx.beginPath();
        this.ctx.lineWidth = 0.1;
        this.ctx.moveTo(this.w / 2, this.h / 2);
    }

    setupDrawingStyles() {
        this.ctx.strokeStyle = AL.randomColor(60, 255, 1, 1);
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.stagger = this.stagger % 2;

            if (this.stagger === 0) {
                this.ctx.translate(this.w / 2, this.h / 2);
                this.ctx.rotate(this.rotate);
                this.ctx.roundRectExtra(
                    this.side1--,
                    this.side2--,
                    this.side1--,
                    this.side2--,
                    {
                        upperLeft: this.rounded1++,
                        upperRight: this.rounded2++,
                        lowerLeft: this.rounded3++,
                        lowerRight: this.rounded4++,
                    },
                    false,
                    true,
                );
                this.ctx.translate(-this.w / 2, -this.h / 2);
            }

            if (this.stagger === 1) {
                this.ctx.translate(this.w / 2, this.h / 2);
                this.ctx.rotate(this.rotate);
                this.ctx.roundRectExtra(
                    this.side3++,
                    this.side4++,
                    this.side3++,
                    this.side4++,
                    {
                        upperLeft: this.rounded3--,
                        upperRight: this.rounded4--,
                        lowerLeft: this.rounded2--,
                        lowerRight: this.rounded1--,
                    },
                    false,
                    true,
                );
                this.ctx.translate(-this.w / 2, -this.h / 2);
            }

            this.stagger++;
        }

        this.t++;

        if (this.t % (this.speed * 400) === 0) {
            this.initializeProperties();

            this.ctx.canvas.width = this.ctx.canvas.height = 0;
            this.ctx.canvas.width = this.w;
            this.ctx.canvas.height = this.h;

            this.ctx.beginPath();
            this.ctx.strokeStyle = AL.randomColor(0, 255, 0.15, 0.6);
        }

        this.requestFrame();
    }
}
