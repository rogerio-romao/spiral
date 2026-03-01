import AL from '../AlgorithmLoader.js';

export default class Rounded extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.name = 'Rounded';

        this.initializeProperties();
        this.setupConstantStyles();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeProperties() {
        this.rounded1 = AL.random(15, 50);
        this.rounded2 = AL.random(15, 50);
        this.rounded3 = AL.random(15, 50);
        this.rounded4 = AL.random(15, 50);
        this.side1 = AL.random(0, this.w / 4);
        this.side2 = AL.random(0, this.h / 4);
        this.rotate = (AL.random(1, 359) * Math.PI) / 180;
    }

    setupConstantStyles() {
        this.ctx.filter = 'contrast(2)';
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    }

    setupDrawingStyles() {
        this.ctx.strokeStyle = AL.randomColor(50, 255, 0.5, 1);
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.translate(this.w / 2, this.h / 2);
            this.ctx.rotate(this.rotate);
            this.ctx.roundRectExtra(
                this.side1,
                this.side2,
                this.side1,
                this.side2,
                {
                    lowerLeft: this.rounded3,
                    lowerRight: this.rounded4,
                    upperLeft: this.rounded1,
                    upperRight: this.rounded2,
                },
                true,
                true,
            );
            this.ctx.translate(-this.w / 2, -this.h / 2);
        }

        this.t++;

        if (this.t % (this.speed * 125) === 0) {
            this.initializeProperties();
            this.setupDrawingStyles();
            this.ctx.beginPath();
        }

        this.requestFrame();
    }
}
