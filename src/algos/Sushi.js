import BA from '../BaseAlgorithm.js';

export default class Sushi extends BA {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.radius = 40;
        this.gap = 4;
        this.rows = Math.round(this.h / (this.radius + this.gap));
        this.cols = Math.round(this.w / (this.radius + this.gap));
    }

    setupDrawingStyles() {
        this.ctx.strokeStyle = 'white';
        this.ctx.globalCompositeOperation = 'difference';
        this.ctx.lineWidth = BA.random(3, 17);
        this.ctx.fillStyle = BA.randomColor();
    }

    draw() {
        if (this.t % this.speed === 0) {
            for (let i = 0; i <= this.rows; i++) {
                for (let j = 0; j <= this.cols; j++) {
                    this.ctx.beginPath();
                    this.ctx.arc(
                        100 * j - 50,
                        100 * i - 50,
                        this.radius,
                        Math.random(),
                        Math.random() * 2 * Math.PI
                    );
                    this.ctx.stroke();
                    this.ctx.fill();
                }
            }
        }

        if (this.t % (this.speed * 30) === 0) {
            this.radius = BA.random(10, 46);
            this.ctx.lineWidth = BA.random(3, 17);
            this.ctx.fillStyle = BA.randomColor();
        }

        this.t++;

        requestAnimationFrame(this.draw);
    }
}
