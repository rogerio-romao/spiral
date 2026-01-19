import AL from '../AlgorithmLoader.js';

export default class Organic extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.name = 'Organic';

        this.initializeBaseProperties();
        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeBaseProperties() {
        this.decrease = 0.99;
        this.side1 = this.w / 2;
        this.side2 = this.h / 2;
    }

    initializeProperties() {
        this.rotate = AL.random(5, 40);
        this.rounded1 = AL.random(10, 180);
        this.rounded2 = AL.random(10, 180);
        this.rounded3 = AL.random(10, 180);
        this.rounded4 = AL.random(10, 180);
    }

    setupDrawingStyles() {
        this.ctx.lineWidth = AL.random(6, 36);
        this.ctx.fillStyle = AL.randomColor(0, 255, 0.1, 0.45);
        this.ctx.strokeStyle = AL.randomColor(0, 255, 0.1, 0.45);
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.translate(this.w / 2, this.h / 2);
            this.ctx.rotate(this.rotate);
            this.ctx.roundRect(
                this.ctx.lineWidth - 2,
                this.ctx.lineWidth - 2,
                this.side1,
                this.side2,
                {
                    upperLeft: this.rounded1,
                    upperRight: this.rounded2,
                    lowerLeft: this.rounded3,
                    lowerRight: this.rounded4,
                },
                true,
                true
            );
            this.ctx.translate(-this.w / 2, -this.h / 2);

            this.side1 *= this.decrease;
            this.side2 *= this.decrease;
            if (this.side1 < 10 || this.side2 < 10) this.decrease = 1.01;
            if (this.side1 > this.w || this.side2 > this.h)
                this.decrease = 0.99;
        }

        this.t++;

        if (this.t % (this.speed * 250) === 0) {
            this.initializeProperties();
            this.setupDrawingStyles();
            this.ctx.beginPath();
        }

        requestAnimationFrame(this.draw);
    }
}
