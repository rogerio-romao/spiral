import AL from '../AlgorithmLoader.js';

export default class Hallucinate extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.rows = AL.random(3, 17);
        this.rot = AL.random(1, 180);
        this.height = this.h / this.rows;
        this.colors = [];
        for (let i = 0; i <= this.rows; i++) {
            this.colors.push(AL.randomColor());
        }
    }

    setupDrawingStyles() {
        this.ctx.globalCompositeOperation = 'soft-light';
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

        if (this.t % (this.speed * 150) === 0) {
            this.rows = AL.random(3, 17);
            this.rot = AL.random(1, 180);
            this.height = this.h / this.rows;
            this.colors = [];
            for (let i = 0; i <= this.rows; i++) {
                this.colors.push(AL.randomColor());
            }
        }

        if (this.t % (this.speed * 750) === 0) {
            this.ctx.clearRect(-this.w, -this.h, 3 * this.w, 3 * this.h);
        }

        this.t++;

        requestAnimationFrame(this.draw);
    }
}
