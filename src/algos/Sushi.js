import AL from '../AlgorithmLoader.js';

export default class Sushi extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.name = 'Sushi';

        this.initializeProperties();
        this.setupConstantStyles();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeProperties() {
        this.gap = 4;
        this.radius = 40;
        this.rows = Math.round(this.h / (this.radius + this.gap));
        this.cols = Math.round(this.w / (this.radius + this.gap));
    }

    setupConstantStyles() {
        this.ctx.strokeStyle = 'white';
        this.ctx.globalCompositeOperation = 'difference';
    }

    setupDrawingStyles() {
        this.ctx.lineWidth = AL.random(3, 17);
        this.ctx.fillStyle = AL.randomColor();
    }

    draw() {
        if (this.t % this.speed === 0) {
            for (let i = 0; i <= this.rows; i++) {
                for (let j = 0; j <= this.cols; j++) {
                    this.ctx.beginPath();
                    this.ctx.arc(
                        100 * j - 50,
                        100 * i - 50,
                        this.radius,
                        Math.random(),
                        Math.random() * 2 * Math.PI
                    );
                    this.ctx.stroke();
                    this.ctx.fill();
                }
            }
        }

        this.t++;

        if (this.t % (this.speed * 30) === 0) {
            this.radius = AL.random(10, 46);
            this.setupDrawingStyles();
        }

        this.requestFrame();
    }
}
