import AL from '../AlgorithmLoader.js';

export default class TheBadge extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.length = AL.random(50, Math.min(this.w, this.h) / 1.5);
        this.rot1 = (AL.random(0, 360) * Math.PI) / 180;
        this.randCol = AL.random(0, 255);
    }

    setupDrawingStyles() {
        this.modes = [
            'difference',
            'soft-light',
            'color',
            'lighten',
            'darken',
            'overlay',
            'source-atop',
        ];

        this.ctx.fillStyle = `rgb(${this.randCol + AL.random(-28, 28)},${
            this.randCol + AL.random(-28, 28)
        },${this.randCol + AL.random(-28, 28)})`;
        this.ctx.strokeStyle = 'white';
        this.ctx.lineWidth = 3;
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.fillRect(
                this.w / 2 - this.length * 1.5,
                this.h / 2 - this.length * 1.5,
                3 * this.length,
                3 * this.length
            );
            this.ctx.strokeRect(
                this.w / 2 - this.length * 1.5,
                this.h / 2 - this.length * 1.5,
                3 * this.length,
                3 * this.length
            );
            this.ctx.translate(this.w / 2, this.h / 2);
            this.ctx.rotate(this.rot1);
            this.ctx.translate(-this.w / 2, -this.h / 2);
        }

        if (this.t % (this.speed * 25) === 0) {
            this.length = AL.random(5, Math.min(this.w, this.h) / 3);
            this.randCol = AL.random(0, 255);

            this.ctx.fillStyle = `rgb(${this.randCol + AL.random(-28, 28)},${
                this.randCol + AL.random(-28, 28)
            },${this.randCol + AL.random(-28, 28)})`;
        }

        if (this.t % (this.speed * 50) === 0) {
            this.rot1 = (AL.random(0, 360) * Math.PI) / 180;
            this.ctx.globalCompositeOperation =
                this.modes[AL.random(0, this.modes.length - 1)];
        }

        this.t++;

        requestAnimationFrame(this.draw);
    }
}
