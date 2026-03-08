import AL from '../AlgorithmLoader.js';

export default class Rounded extends AL {
    constructor() {
        super();

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
        this.side1 = AL.random(0, AL.w / 4);
        this.side2 = AL.random(0, AL.h / 4);
        this.rotate = (AL.random(1, 359) * Math.PI) / 180;
    }

    setupConstantStyles() {
        AL.ctx.filter = 'contrast(2)';
        AL.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    }

    setupDrawingStyles() {
        AL.ctx.strokeStyle = AL.randomColor(50, 255, 0.5, 1);
    }

    draw() {
        if (this.t % this.speed === 0) {
            AL.ctx.translate(AL.w / 2, AL.h / 2);
            AL.ctx.rotate(this.rotate);
            AL.ctx.roundRectExtra(
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
            AL.ctx.translate(-AL.w / 2, -AL.h / 2);
        }

        this.t += 1;

        if (this.t % (this.speed * 125) === 0) {
            this.initializeProperties();
            this.setupDrawingStyles();
            AL.ctx.beginPath();
        }

        this.requestFrame();
    }
}
