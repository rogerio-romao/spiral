import BA from '../BaseAlgorithm.js';

export default class LisaJou extends BA {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.radiusX = BA.random(100, this.w * 0.75);
        this.radiusY = BA.random(100, this.h * 0.75);
        this.angleX = 0;
        this.angleY = 0;
        this.speedX = Math.random() * 3;
        this.speedY = Math.random() * 3;
        this.size = BA.random(2, 16);
    }

    setupDrawingStyles() {
        this.ctx.strokeStyle = 'black';
        this.ctx.fillStyle = BA.randomColor();
        this.ctx.fillRect(0, 0, this.w, this.h);
        this.ctx.fillStyle = BA.randomColor();
    }

    draw() {
        if (this.t % this.speed === 0) {
            const x = this.w / 2 + Math.cos(this.angleX) * this.radiusX;
            const y = this.h / 2 + Math.sin(this.angleY) * this.radiusY;
            this.angleX += this.speedX;
            this.angleY += this.speedY;

            this.ctx.beginPath();
            this.ctx.arc(x, y, this.size, 0, 2 * Math.PI);
            this.ctx.fill();
            this.ctx.stroke();
        }

        if (this.t % (this.speed * 720) === 0) {
            this.radiusX = BA.random(100, this.w * 0.75);
            this.radiusY = BA.random(100, this.h * 0.75);
            this.angleX = 0;
            this.angleY = 0;
            this.speedX = Math.random() * 3;
            this.speedY = Math.random() * 3;
            this.size = BA.random(2, 16);

            this.ctx.fillStyle = BA.randomColor();
            this.ctx.fillRect(0, 0, this.w, this.h);
            this.ctx.fillStyle = BA.randomColor();
        }

        this.t++;

        requestAnimationFrame(this.draw);
    }
}
