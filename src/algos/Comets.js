import AL from '../AlgorithmLoader.js';

export default class Comets extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.name = 'Comets';

        this.initializeBaseProperties();
        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeBaseProperties() {
        this.speed = 1;
    }

    initializeProperties() {
        this.change = 0;
        this.rate = AL.random(1, 7);
        this.rotate = AL.random(3, 13);
    }

    setupDrawingStyles() {
        this.ctx.beginPath();
        this.ctx.lineWidth = AL.random(3, 12);
        this.ctx.shadowBlur = this.ctx.lineWidth;
        this.ctx.shadowColor = this.ctx.strokeStyle = AL.randomColor();
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.stagger = this.stagger % 4;

            if (this.stagger === 0) {
                this.ctx.lineTo(this.w / 2 + this.change, this.h / 2);
            }

            if (this.stagger === 1) {
                this.ctx.stroke();
            }

            if (this.stagger === 2) {
                this.change += this.rate;
                this.rotateCanvasDegrees(this.rotate);
            }
        }

        this.t++;

        this.stagger++;

        if (this.t % (this.speed * 1024) === 0) {
            this.initializeProperties();
            this.setupDrawingStyles();
        }

        requestAnimationFrame(this.draw);
    }
}
