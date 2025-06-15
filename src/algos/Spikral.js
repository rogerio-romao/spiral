import AL from '../AlgorithmLoader.js';

export default class Spikral extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.fillAmount = (Math.random() + 0.05) * (Math.PI / 2);
        this.rot = AL.random(1, 22);
        this.size = AL.random(25, 100);
    }

    setupDrawingStyles() {
        this.ctx.fillStyle = AL.randomColor(0, 255, 0.25, 1);
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.arc(this.w / 2, this.h / 2, this.size, 0, this.fillAmount);
            this.ctx.fill();
            this.ctx.beginPath();

            this.size *= 1.05;
        }

        this.ctx.translate(this.w / 2, this.h / 2);
        this.ctx.rotate(-this.rot);
        this.ctx.translate(-this.w / 2, -this.h / 2);

        if (this.t % (this.speed * 150) === 0) {
            this.fillAmount = (Math.random() + 0.05) * (Math.PI / 2);
            this.size = AL.random(25, 100);

            this.ctx.fillStyle = AL.randomColor(0, 255, 0.25, 1);
        }

        if (this.t % (this.speed * 1500) === 0) {
            this.rot = AL.random(1, 22);
        }

        this.t++;

        requestAnimationFrame(this.draw);
    }
}
