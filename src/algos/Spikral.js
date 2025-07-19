import AL from '../AlgorithmLoader.js';

export default class Spikral extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeBaseProperties();
        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeBaseProperties() {
        this.rotate = AL.random(1, 22);
    }

    initializeProperties() {
        this.size = AL.random(30, 100);
        this.fillAmount = (Math.random() + 0.05) * (Math.PI / 2);
    }

    setupDrawingStyles() {
        this.ctx.fillStyle = AL.randomColor(0, 255, 0.25, 1);
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.arc(this.w / 2, this.h / 2, this.size, 0, this.fillAmount);
            this.ctx.fill();
            this.ctx.beginPath();

            this.size *= 1.06;
        }

        this.t++;

        this.rotateCanvasRadians(-this.rotate);

        if (this.t % (this.speed * 150) === 0) {
            this.initializeProperties();
            this.setupDrawingStyles();
        }

        if (this.t % (this.speed * 1500) === 0) {
            this.rotate = AL.random(1, 22);
        }

        requestAnimationFrame(this.draw);
    }
}
