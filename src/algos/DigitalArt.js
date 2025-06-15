import AL from '../AlgorithmLoader.js';

export default class DigitalArt extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.x = AL.random(75, this.w - 75);
        this.y = AL.random(30, this.h - 30);
        this.rot = AL.random(3, 40);
        this.size = AL.random(12, 36);
    }

    setupDrawingStyles() {
        this.ctx.font = `${this.size}px serif`;
        this.ctx.fillStyle = AL.randomColor();
    }

    draw() {
        if (this.t % this.speed === 0) {
            let letter = this.t % 2 ? '0' : '1';
            if (this.t % 2) {
                this.ctx.font = `${this.size * 2}px serif`;
                this.ctx.textAlign = 'left';
                this.ctx.textBaseline = 'top';
                this.ctx.fillText(letter + '-', this.w / 2, this.h / 2);
            } else {
                this.ctx.font = `${this.size * 2}px serif`;
                this.ctx.textAlign = 'right';
                this.ctx.textBaseline = 'bottom';
                this.ctx.fillText(letter + '_', this.w / 2, this.h / 2);
            }

            this.ctx.font = `${this.size}px serif`;
            this.ctx.fillText(letter, this.x, this.y);
        }

        this.ctx.translate(this.w / 2, this.h / 2);
        this.ctx.rotate((this.rot * Math.PI) / 180);
        this.ctx.translate(-this.w / 2, -this.h / 2);

        if (this.t % (this.speed * 90) === 0) {
            this.x = AL.random(75, this.w - 75);
            this.y = AL.random(30, this.h - 30);
            this.size = AL.random(12, 36);

            this.ctx.font = `${this.size}px serif`;
            this.ctx.fillStyle = AL.randomColor();
        }

        if (this.t % (this.speed * 450) === 0) {
            this.rot = AL.random(3, 40);
        }

        this.t++;

        requestAnimationFrame(this.draw);
    }
}
