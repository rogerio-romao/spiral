import AL from '../AlgorithmLoader.js';

export default class Lollipottery extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.radius = AL.random(50, Math.max(this.w, this.h) / 2);
        this.alter = AL.random(-50, 50);
    }

    setupDrawingStyles() {
        this.ctx.lineWidth = AL.random(2, 14);
        this.ctx.globalCompositeOperation = 'overlay';
        this.ctx.strokeStyle = AL.randomColor();
        this.ctx.shadowColor = AL.randomColor();
        this.ctx.shadowBlur = 4;
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.arc(this.w / 2, this.h / 2, this.radius, 0, 2 * Math.PI);

            this.radius += this.alter;
            if (this.radius > Math.max(this.w, this.h) || this.radius <= 40) {
                this.radius = AL.random(50, Math.max(this.w, this.h) / 2);
                this.alter = AL.random(-50, 50);
                this.ctx.lineWidth = AL.random(2, 14);
            }

            this.ctx.stroke();
            this.ctx.beginPath();
        }

        if (this.t % (this.speed * 150) === 0) {
            this.radius = AL.random(50, Math.max(this.w, this.h));
            this.alter = AL.random(-50, 50);

            this.ctx.lineWidth = AL.random(1, 12);
            this.ctx.beginPath();
            this.ctx.strokeStyle = AL.randomColor();
            this.ctx.shadowColor = AL.randomColor();
            this.ctx.globalCompositeOperation = 'overlay';
        }

        if (this.t % (this.speed * 600) === 0) {
            this.ctx.globalCompositeOperation = 'source-over';
        }

        this.t++;

        requestAnimationFrame(this.draw);
    }
}
