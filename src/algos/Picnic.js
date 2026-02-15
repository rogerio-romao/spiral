import AL from '../AlgorithmLoader.js';

export default class Picnic extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.name = 'Picnic';

        this.initializeBaseProperties();
        this.initializeProperties();
        this.setupConstantStyles();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeBaseProperties() {
        this.rows = Math.ceil(this.h / 150) + 2;
        this.cols = Math.ceil(this.w / 150) + 2;
    }

    initializeProperties() {
        this.radius = AL.random(10, 450);
    }

    setupConstantStyles() {
        this.ctx.globalCompositeOperation = 'source-over';
    }

    setupDrawingStyles() {
        this.ctx.lineWidth = AL.random(1, 25);
        this.ctx.strokeStyle = AL.randomColor(10, 255, 0.2, 0.5);
    }

    draw() {
        if (this.t % this.speed === 0) {
            for (let i = 0; i <= this.rows; i++) {
                for (let j = 0; j <= this.cols; j++) {
                    this.ctx.beginPath();
                    this.ctx.arc(
                        225 * j - 225,
                        225 * i - 225,
                        this.radius,
                        0,
                        2 * Math.PI
                    );
                    this.ctx.stroke();
                }
            }
        }

        this.t++;

        if (this.t % (this.speed * 30) === 0) {
            this.initializeProperties();
            this.setupDrawingStyles();
            this.ctx.globalCompositeOperation = 'source-over';
        }

        if (this.t * (this.speed * 90) === 0) {
            this.ctx.globalCompositeOperation = 'overlay';
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

        this.requestFrame();
    }
}
