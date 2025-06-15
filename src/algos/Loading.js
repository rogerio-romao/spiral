import AL from '../AlgorithmLoader.js';

export default class Loading extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.rot = AL.random(2, 45);
        this.radius = AL.random(30, Math.max(this.w, this.h) / 2);
        this.counter = false;
        this.width1 = AL.random(4, 51);
        this.width2 = AL.random(4, 51);
        this.color = AL.randomColor(60, 255, 0.75, 1);
    }

    setupDrawingStyles() {
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(-this.w, -this.h, this.w * 3, this.h * 3);
    }

    draw() {
        this.ctx.lineWidth = this.t % 2 ? this.width1 : this.width2;
        this.ctx.strokeStyle = this.t % 2 ? 'black' : this.color;
        this.counter = this.t % 2 ? true : false;
        this.ctx.globalCompositeOperation =
            this.t % 2 ? 'source-over' : 'difference';

        if (this.t % this.speed === 0) {
            this.ctx.beginPath();
            this.ctx.arc(
                this.w / 2,
                this.h / 2,
                this.radius,
                0,
                Math.PI,
                this.counter
            );
            this.ctx.stroke();
        }

        this.ctx.translate(this.w / 2, this.h / 2);
        this.ctx.rotate((this.rot * Math.PI) / 180);
        this.ctx.translate(-this.w / 2, -this.h / 2);

        if (this.t % (this.speed * 45) === 0) {
            this.radius = AL.random(30, Math.max(this.w, this.h) / 2);
            this.rot = AL.random(2, 45);
            this.width1 = AL.random(4, 51);
            this.width2 = AL.random(4, 51);
        }

        this.t++;

        requestAnimationFrame(this.draw);
    }
}
