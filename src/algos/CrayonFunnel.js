import AL from '../AlgorithmLoader.js';

export default class CrayonFunnel extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.x = AL.random(this.w / 3, this.w * 0.66);
        this.y = AL.random(this.h / 3, this.h * 0.66);
        this.inc = AL.random(1, 6);
        this.radius = AL.random(5, 60);
        this.rotate = AL.random(1, 150);
    }

    setupDrawingStyles() {
        this.ctx.strokeStyle = AL.randomColor(0, 255, 1, 1);
        this.ctx.lineWidth = 2;
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.beginPath();
            this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
            this.radius += this.inc;
            this.ctx.stroke();
        }

        this.ctx.translate(this.w / 2, this.h / 2);
        this.ctx.rotate(this.rotate);
        this.ctx.translate(-this.w / 2, -this.h / 2);

        if (this.t % (this.speed * 180) === 0) {
            this.x = AL.random(this.w / 3, this.w * 0.66);
            this.y = AL.random(this.h / 3, this.h * 0.66);
            this.radius = AL.random(5, 60);
            this.inc = AL.random(1, 6);
            this.rotate = AL.random(1, 150);

            if (Math.random() < 0.5) {
                if (Math.random() < 0.5) {
                    this.ctx.strokeStyle = 'white';
                } else {
                    this.ctx.strokeStyle = 'black';
                }
            } else {
                this.ctx.strokeStyle = AL.randomColor(0, 255, 1, 1);
            }
        }

        this.t++;

        requestAnimationFrame(this.draw);
    }
}
