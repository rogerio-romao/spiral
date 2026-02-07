import AL from '../AlgorithmLoader.js';

export default class Radiance extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.name = 'Radiance';

        this.initializeBaseProperties();
        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeBaseProperties() {
        this.rotate = AL.random(1, 11);
    }

    initializeProperties() {
        this.color1 = AL.randomColor();
        this.color2 = AL.randomColor();
        this.color3 = AL.randomColor();
        this.color4 = AL.randomColor();
        this.rounded1 = AL.random(15, 50);
        this.rounded2 = AL.random(15, 50);
        this.rounded3 = AL.random(15, 50);
        this.rounded4 = AL.random(15, 50);
        this.x1 = AL.random(0, this.w / 2);
        this.y1 = AL.random(0, this.h / 2);
        this.y2 = AL.random(0, this.h / 2);
        this.x4 = AL.random(0, this.w / 2);
        this.side1 = AL.random(60, this.w / 2);
        this.side2 = AL.random(60, this.h / 2);
        this.side3 = AL.random(60, this.w / 2);
        this.side4 = AL.random(60, this.h / 2);
        this.side5 = AL.random(60, this.w / 2);
        this.side6 = AL.random(60, this.h / 2);
        this.side7 = AL.random(60, this.w / 2);
        this.side8 = AL.random(60, this.h / 2);
        this.x2 = AL.random(this.w / 2, this.w);
        this.x3 = AL.random(this.w / 2, this.w);
        this.y3 = AL.random(this.h / 2, this.h);
        this.y4 = AL.random(this.h / 2, this.h);
    }

    setupDrawingStyles() {
        this.ctx.fillStyle = AL.randomColor(0, 255, 0.01, 0.05);
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.stagger = this.stagger % 4;

            if (this.stagger === 0) {
                this.ctx.strokeStyle = this.color1;
                this.ctx.roundRect(
                    this.x1,
                    this.y1,
                    this.side1,
                    this.side2,
                    {
                        upperLeft: this.rounded1,
                        upperRight: this.rounded1,
                        lowerLeft: this.rounded1,
                        lowerRight: this.rounded1,
                    },
                    true,
                    true
                );
            }

            if (this.stagger === 1) {
                this.ctx.strokeStyle = this.color2;
                this.ctx.roundRect(
                    this.x2,
                    this.y2,
                    this.side3,
                    this.side4,
                    {
                        upperLeft: this.rounded2,
                        upperRight: this.rounded2,
                        lowerLeft: this.rounded2,
                        lowerRight: this.rounded2,
                    },
                    true,
                    true
                );
            }

            if (this.stagger === 2) {
                this.ctx.strokeStyle = this.color3;
                this.ctx.roundRect(
                    this.x3,
                    this.y3,
                    this.side5,
                    this.side6,
                    {
                        upperLeft: this.rounded3,
                        upperRight: this.rounded3,
                        lowerLeft: this.rounded3,
                        lowerRight: this.rounded3,
                    },
                    true,
                    true
                );
            }

            if (this.stagger === 3) {
                this.ctx.strokeStyle = this.color4;
                this.ctx.roundRect(
                    this.x4,
                    this.y4,
                    this.side7,
                    this.side8,
                    {
                        upperLeft: this.rounded4,
                        upperRight: this.rounded4,
                        lowerLeft: this.rounded4,
                        lowerRight: this.rounded4,
                    },
                    true,
                    true
                );
            }

            this.stagger++;

            this.rotateCanvasRadians(this.rotate);
        }

        this.t++;

        if (this.t % (this.speed * 500) === 0) {
            this.initializeProperties();
            this.setupDrawingStyles();
        }

        if (this.t % (this.speed * 1500) === 0) {
            this.initializeBaseProperties();
        }

        requestAnimationFrame(this.draw);
    }
}
