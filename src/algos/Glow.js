import BA from '../BaseAlgorithm.js';

export default class Glow extends BA {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.margin1 = BA.random(25, this.w / 4);
        this.margin2 = BA.random(25, this.w / 4);
        this.color1 = BA.randomColor(0, 255, 0.05, 0.2);
        this.color2 = BA.randomColor(0, 255, 0.05, 0.2);
        this.rot = BA.random(1, 60);
        this.modes = ['color', 'source-over', 'overlay', 'soft-light'];
    }

    setupDrawingStyles() {
        this.ctx.strokeStyle = 'white';
        this.ctx.globalCompositeOperation = 'color';
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.fillStyle = this.color1;
            this.ctx.fillRect(0, 0, this.w / 2 + this.margin1, this.h);
            this.ctx.fillStyle = this.color2;
            this.ctx.fillRect(this.w / 2 - this.margin2, 0, this.w, this.h);
        }

        this.ctx.translate(this.w / 2, this.h / 2);
        this.ctx.rotate((this.rot * Math.PI) / 180);
        this.ctx.translate(-this.w / 2, -this.h / 2);

        if (this.t % (this.speed * 60) === 0) {
            this.margin1 = BA.random(25, this.w / 4);
            this.color1 = BA.randomColor(0, 255, 0.05, 0.2);
        }

        if (this.t % (this.speed * 90) === 0) {
            this.margin2 = BA.random(25, this.w / 4);
            this.color2 = BA.randomColor(0, 255, 0.05, 0.2);
        }

        if (this.t % (this.speed * 180) === 0) {
            this.rot = BA.random(1, 60);
            this.ctx.globalCompositeOperation =
                this.modes[BA.random(0, this.modes.length)];
        }

        this.t++;

        requestAnimationFrame(this.draw);
    }
}
