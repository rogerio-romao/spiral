import AL from '../AlgorithmLoader.js';

export default class SpiralText extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.x = AL.random(0, this.w);
        this.y = AL.random(0, this.h);
        this.rot1 = (AL.random(1, 20) * Math.PI) / 180;
        this.picker = AL.random(0, 11);
    }

    setupDrawingStyles() {
        this.ctx.globalCompositeOperation = 'color';
        this.ctx.strokeStyle = AL.randomColor(0, 255, 1, 1);
        this.ctx.textAlign = 'center';
        this.ctx.font = `bold ${AL.random(10, 400)}px sans-serif`;
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.strokeText('SPIRAL', this.x, this.y);
            this.ctx.translate(this.w / 2, this.h / 2);
            this.ctx.rotate(this.rot1);
            this.ctx.translate(-this.w / 2, -this.h / 2);
            this.x = AL.random(0, this.w);
        }
        if (this.t % (this.speed * 90) === 0) {
            this.y = AL.random(0, this.h);
            this.picker = AL.random(0, 11);

            if (this.picker === 0) {
                this.ctx.strokeStyle = 'white';
            } else if (this.picker === 1) {
                this.ctx.strokeStyle = 'black';
            } else if (this.picker === 2 || this.picker === 3) {
                this.ctx.globalCompositeOperation = 'color-dodge';
            } else if (this.picker === 4 || this.picker === 5) {
                this.ctx.globalCompositeOperation = 'source-over';
            } else if (this.picker === 6) {
                this.ctx.globalCompositeOperation = 'darken';
            } else if (this.picker === 7) {
                this.ctx.globalCompositeOperation = 'color-burn';
            } else {
                this.ctx.globalCompositeOperation = 'color';
            }

            this.ctx.strokeStyle = AL.randomColor(0, 255, 1, 1);
            this.ctx.font = `bold ${AL.random(10, 400)}px sans-serif`;
        }

        if (this.t % (this.speed * 180) === 0) {
            this.rot1 = (AL.random(1, 30) * Math.PI) / 180;
        }

        this.t++;

        requestAnimationFrame(this.draw);
    }
}
