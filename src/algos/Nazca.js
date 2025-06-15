import AL from '../AlgorithmLoader.js';

export default class Nazca extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.r = 1;
        this.i = AL.random(13, 60);
        this.a = AL.random(1, 180);
        this.cycles = 0;
        this.modes = ['soft-light', 'overlay', 'color'];
    }

    setupDrawingStyles() {
        this.ctx.fillStyle = AL.randomColor(0, 255, 0.15, 0.55);
        this.ctx.strokeStyle = AL.randomColor(0, 255, 0.75, 1);
        this.ctx.globalCompositeOperation = 'soft-light';
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.arc(
                this.w / 2,
                this.h / 2,
                this.r,
                0,
                Math.random() * Math.PI
            );
            this.ctx.fill();
            this.ctx.stroke();
            this.r += this.i;
        }

        this.ctx.translate(this.w / 2, this.h / 2);
        this.ctx.rotate(-this.a);
        this.ctx.translate(-this.w / 2, -this.h / 2);

        if (this.r > Math.max(this.w, this.h)) {
            this.cycles++;
            if (this.cycles % 10 === 0) {
                this.ctx.globalCompositeOperation =
                    this.modes[AL.random(0, this.modes.length)];
            }

            this.a = AL.random(1, 180);
            this.r = 1;
            this.i = AL.random(13, 60);

            this.ctx.lineWidth = AL.random(1, 7);
            this.ctx.fillStyle = AL.randomColor(0, 255, 0.15, 0.55);
            this.ctx.strokeStyle = AL.randomColor(0, 255, 0.75, 1);
            this.ctx.beginPath();
        }

        this.t++;

        requestAnimationFrame(this.draw);
    }
}
