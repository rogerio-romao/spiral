import BA from '../BaseAlgorithm.js';

export default class Trance extends BA {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.radius = BA.random(25, Math.max(this.w, this.h) / 2);
        this.angle = 0;
        this.divisions = [2, 4, 6, 8, 10, 12];
        this.squares = this.divisions[BA.random(0, this.divisions.length)];
        this.size = BA.random(15, 220);
        this.factor = BA.random(2, 8);
        this.rotate = BA.random(1, 71);
    }

    setupDrawingStyles() {
        this.ctx.strokeStyle = BA.randomColor();
        this.ctx.fillStyle = BA.randomColor();
        this.ctx.globalCompositeOperation = 'overlay';
    }

    draw() {
        if (this.t % this.speed === 0) {
            for (let i = 0; i < this.squares; i++) {
                this.angle = (i * Math.PI * 2) / this.squares;
                const x = this.w / 2 + Math.cos(this.angle) * this.radius;
                const y = this.h / 2 + Math.sin(this.angle) * this.radius;

                this.ctx.beginPath();
                this.ctx.fillRect(
                    x - this.size / 4,
                    y - this.size / 4,
                    this.size / 2,
                    this.size / 2
                );
                this.ctx.strokeRect(
                    x - this.size / 2,
                    y - this.size / 2,
                    this.size,
                    this.size
                );
            }
        }

        this.ctx.translate(this.w / 2, this.h / 2);
        this.ctx.rotate(this.rotate);
        this.ctx.translate(-this.w / 2, -this.h / 2);

        if (this.t % (this.speed * 9) === 0) {
            this.radius = BA.random(25, Math.max(this.w, this.h) / 2);
            this.angle = 0;
            this.size = BA.random(15, 220);
            this.rotate = BA.random(1, 71);
            this.squares = this.divisions[BA.random(0, this.divisions.length)];

            this.ctx.globalCompositeOperation = 'overlay';
            this.ctx.fillStyle = BA.randomColor();
        }

        if (this.t % (this.speed * 63) === 0) {
            this.ctx.globalCompositeOperation = 'source-over';
            this.ctx.strokeStyle = BA.randomColor();
        }

        this.t++;

        requestAnimationFrame(this.draw);
    }
}
