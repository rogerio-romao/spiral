import BA from '../BaseAlgorithm.js';

export default class PsychoRainbow extends BA {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.blends = ['hard-light', 'difference', 'color', 'luminosity'];
        this.blend = this.blends[BA.random(0, this.blends.length)];

        this.rows = BA.random(3, 10);
        this.rot = BA.random(1, 50);
        this.height = this.h / this.rows;
        this.colors = [];
        for (let i = 0; i <= this.rows; i++) {
            this.colors.push(BA.randomColor(0, 255, 0.1, 0.5));
        }
    }

    setupDrawingStyles() {
        this.ctx.globalCompositeOperation = this.blend;
    }

    draw() {
        if (this.t % this.speed === 0) {
            for (let i = 0; i <= this.rows; i++) {
                this.ctx.fillStyle = this.colors[i];
                this.ctx.fillRect(
                    -this.w,
                    i * this.height,
                    3 * this.w,
                    this.height
                );
            }
        }

        this.ctx.translate(this.w / 2, this.h / 2);
        this.ctx.rotate(this.rot);
        this.ctx.translate(-this.w / 2, -this.h / 2);

        if (this.t % (this.speed * 100) === 0) {
            this.rows = BA.random(3, 10);
            this.rot = BA.random(1, 50);
            this.height = this.h / this.rows;
            this.colors = [];
            for (let i = 0; i <= this.rows; i++) {
                this.colors.push(BA.randomColor(0, 255, 0.1, 0.5));
            }
        }

        if (this.t % (this.speed * 700) === 0) {
            this.blend = this.blends[BA.random(0, this.blends.length)];
            this.ctx.globalCompositeOperation = this.blend;
        }

        this.t++;

        requestAnimationFrame(this.draw);
    }
}
