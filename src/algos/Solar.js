import AL from '../AlgorithmLoader.js';

export default class Solar extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.x1 = AL.random(0, this.w);
        this.y1 = AL.random(0, this.h);
        this.x2 = AL.random(0, this.w);
        this.y2 = AL.random(0, this.h);
        this.rotate = AL.random(1, 359);
    }

    setupDrawingStyles() {
        this.ctx.strokeStyle = AL.randomColor();
        this.ctx.globalCompositeOperation = 'hard-light';
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.moveTo(0, 0);
            this.ctx.bezierCurveTo(
                this.x1,
                this.y1,
                this.x2,
                this.y2,
                this.w,
                this.h
            );
            this.ctx.stroke();
        }

        this.ctx.translate(this.w / 2, this.h / 2);
        this.ctx.rotate(this.rotate);
        this.ctx.translate(-this.w / 2, -this.h / 2);

        if (this.t % (this.speed * 120) === 0) {
            this.x1 = AL.random(0, this.w);
            this.y1 = AL.random(0, this.h);
            this.x2 = AL.random(0, this.w);
            this.y2 = AL.random(0, this.h);
            this.rotate = AL.random(1, 359);

            this.ctx.beginPath();
            this.ctx.strokeStyle = AL.randomColor();
        }

        this.t++;

        requestAnimationFrame(this.draw);
    }
}
