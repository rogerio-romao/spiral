import AL from '../AlgorithmLoader.js';

export default class Plaid extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeBaseProperties();
        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeBaseProperties() {
        this.rows = Math.ceil(this.h / 100) + 2;
        this.cols = Math.ceil(this.w / 100) + 2;
    }

    initializeProperties() {
        this.side1 = AL.random(20, 300);
        this.side2 = AL.random(20, 300);
    }

    setupDrawingStyles() {
        this.ctx.globalAlpha = 0.3;
        this.ctx.lineWidth = AL.random(1, 13);
        this.ctx.globalCompositeOperation = 'source-over';
        this.ctx.fillStyle = AL.randomColor(10, 255, 0.2, 0.7);
        this.ctx.strokeStyle = AL.randomColor(10, 255, 0.2, 0.7);
    }

    draw() {
        if (this.t % this.speed === 0) {
            for (let i = 0; i <= this.rows; i++) {
                this.rotateCanvasDegrees(45);

                for (let j = 0; j <= this.cols; j++) {
                    this.ctx.beginPath();
                    this.ctx.strokeRect(
                        150 * j - 150,
                        150 * i - 150,
                        this.side1,
                        this.side2
                    );
                    this.ctx.fillRect(
                        150 * j - 150,
                        150 * i - 150,
                        this.side1,
                        this.side2
                    );
                }
            }
        }

        this.t++;

        if (this.t % (this.speed * 30) === 0) {
            this.initializeProperties();
            this.ctx.lineWidth = AL.random(1, 13);
            this.ctx.globalCompositeOperation = 'overlay';
            this.ctx.fillStyle = AL.randomColor(10, 255, 0.2, 0.7);
        }

        if (this.t % (this.speed * 60) === 0) {
            this.ctx.strokeStyle = AL.randomColor(10, 255, 0.2, 0.7);
        }

        if (this.t % (this.speed * 90) === 0) {
            this.ctx.globalCompositeOperation = 'source-over';
        }

        if (this.t % (this.speed * 150) === 0) {
            this.ctx.globalCompositeOperation = 'color';
        }

        if (this.t % (this.speed * 240) === 0) {
            this.ctx.globalCompositeOperation = 'luminosity';
        }

        if (this.t % (this.speed * 570) === 0) {
            this.ctx.globalCompositeOperation = 'hue';
        }

        requestAnimationFrame(this.draw);
    }
}
