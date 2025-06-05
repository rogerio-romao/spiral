import BA from '../BaseAlgorithm.js';

export default class CamouflagePostits extends BA {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.length = BA.random(50, Math.min(this.w, this.h) / 1.5);
        this.x = BA.random(0, this.w);
        this.y = BA.random(0, this.h);
        this.rot1 = (BA.random(0, 360) * Math.PI) / 180;
        this.randCol = BA.random(0, 255);
    }

    setupDrawingStyles() {
        this.modes = [
            'xor',
            'difference',
            'hard-light',
            'color-burn',
            'color-dodge',
            'lighten',
            'darken',
            'overlay',
            'source-atop',
        ];

        this.ctx.fillStyle = `rgb(${this.randCol + BA.random(-8, 8)},${
            this.randCol + BA.random(-8, 8)
        },${this.randCol + BA.random(-8, 8)})`;
        this.ctx.strokeStyle = 'white';
        this.ctx.lineWidth = 2;
        this.ctx.moveTo(this.w / 2, this.h / 2);
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.fillRect(this.x, this.y, this.length, this.length);
            this.x = BA.random(0, this.w);
            this.y = BA.random(0, this.h);
            this.ctx.translate(this.w / 2, this.h / 2);
            this.ctx.rotate(this.rot1);
            this.ctx.translate(-this.w / 2, -this.h / 2);
        }

        if (this.t % (this.speed * 25) === 0) {
            this.length = BA.random(5, 125);
            this.randCol = BA.random(0, 255);
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
            this.ctx.fillStyle = `rgb(${this.randCol + BA.random(-8, 8)},${
                this.randCol + BA.random(-8, 8)
            },${this.randCol + BA.random(-8, 8)})`;
        }

        if (this.t % (this.speed * 100) === 0) {
            this.rot1 = (BA.random(0, 360) * Math.PI) / 180;
            this.ctx.globalCompositeOperation =
                this.modes[BA.random(0, this.modes.length - 1)];
        }

        this.t++;

        requestAnimationFrame(this.draw);
    }
}
