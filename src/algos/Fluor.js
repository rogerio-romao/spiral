import AL from '../AlgorithmLoader.js';

export default class Fluor extends AL {
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
        this.ox = AL.random(0, this.w);
        this.oy = AL.random(0, this.h);
        this.dx = AL.random(0, this.w);
        this.dy = AL.random(0, this.h);
        this.rotate = AL.random(1, 359);
    }

    setupDrawingStyles() {
        this.ctx.strokeStyle = this.ctx.shadowColor = AL.randomColor();
        this.ctx.globalCompositeOperation = 'overlay';
        this.ctx.lineWidth = 2;
        this.ctx.shadowBlur = 4;
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.moveTo(this.ox, this.oy);
            this.ctx.bezierCurveTo(
                this.x1,
                this.y1,
                this.x2,
                this.y2,
                this.dx,
                this.dy
            );
            this.ctx.stroke();
        }

        this.ctx.translate(this.w / 2, this.h / 2);
        this.ctx.rotate((this.rotate * Math.PI) / 180);
        this.ctx.translate(-this.w / 2, -this.h / 2);

        if (this.t % (this.speed * 180) === 0) {
            this.x1 = AL.random(0, this.w);
            this.y1 = AL.random(0, this.h);
            this.x2 = AL.random(0, this.w);
            this.y2 = AL.random(0, this.h);
            this.ox = AL.random(0, this.w);
            this.oy = AL.random(0, this.h);
            this.dx = AL.random(0, this.w);
            this.dy = AL.random(0, this.h);
            this.rotate = AL.random(1, 359);

            this.ctx.beginPath();
            this.ctx.strokeStyle = this.ctx.shadowColor = AL.randomColor();
        }

        this.t++;

        requestAnimationFrame(this.draw);
    }
}
