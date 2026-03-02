import AL from '../AlgorithmLoader.js';

export default class Patterns extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.name = 'Patterns';

        this.initializeProperties();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeProperties() {
        this.radius = AL.random(10, 250);
        this.rows = Math.ceil(this.h / 100) + 2;
        this.cols = Math.ceil(this.w / 100) + 2;
    }

    setupDrawingStyles() {
        this.ctx.lineWidth = 3;
        this.ctx.globalAlpha = 0.1;
        this.ctx.strokeStyle = 'white';
        this.ctx.globalCompositeOperation = 'overlay';
        this.ctx.fillStyle = AL.randomColor(0, 255, 0.05, 0.6);
    }

    draw() {
        if (this.t % this.speed === 0) {
            for (let i = 0; i <= this.rows; i++) {
                for (let j = 0; j <= this.cols; j++) {
                    this.ctx.beginPath();
                    this.ctx.arc(100 * j - 50, 100 * i - 50, this.radius, 0, 2 * Math.PI);
                    this.ctx.stroke();
                    this.ctx.fill();
                }
            }
        }

        this.t += 1;

        if (this.t % (this.speed * 40) === 0) {
            this.radius = AL.random(10, 250);

            this.ctx.globalCompositeOperation = 'xor';
            this.ctx.strokeStyle = 'black';
            this.ctx.fillStyle = AL.randomColor(0, 255, 0.05, 0.6);
            this.ctx.beginPath();
            this.ctx.arc(this.w / 2, this.h / 2, this.radius * 3, 0, 2 * Math.PI);
            this.ctx.stroke();
            this.ctx.fill();
            this.ctx.globalCompositeOperation = 'overlay';
            this.ctx.strokeStyle = 'white';
        }

        this.requestFrame();
    }
}
