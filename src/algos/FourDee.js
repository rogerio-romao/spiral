import AL from '../AlgorithmLoader.js';

export default class FourDee extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.springPoint = { x: this.w / 2, y: this.h / 2 };
        this.weight = AL.createParticle(
            AL.random(0, this.w),
            AL.random(0, this.h),
            0,
            0
        );
        this.weight.radius = 20;
        this.rot = AL.random(-90, -1);
        this.k = 0.1;
    }

    setupDrawingStyles() {
        this.ctx.strokeStyle = AL.randomColor();
        this.ctx.fillStyle = AL.randomColor(40, 255, 0.1, 0.25);
    }

    draw() {
        if (this.t % this.speed === 0) {
            const dx = this.springPoint.x - this.weight.x;
            const dy = this.springPoint.y - this.weight.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const springForce = distance * this.k;
            const ax = (dx / distance) * springForce;
            const ay = (dy / distance) * springForce;
            this.weight.vx += ax;
            this.weight.vy += ay;
            this.weight.update();

            this.ctx.beginPath();
            this.ctx.arc(
                this.weight.x,
                this.weight.y,
                this.weight.radius,
                0,
                2 * Math.PI
            );
            this.ctx.fill();
        }

        this.ctx.translate(this.w / 2, this.h / 2);
        this.ctx.rotate(this.rot);
        this.ctx.translate(-this.w / 2, -this.h / 2);

        if (this.t % (this.speed * 540) === 0) {
            this.ctx.fillStyle = 'black';
            this.ctx.fillRect(-this.w, -this.h, 3 * this.w, 3 * this.h);
            this.ctx.fillStyle = AL.randomColor(40, 255, 0.1, 0.25);

            this.weight = AL.createParticle(
                AL.random(0, this.w),
                AL.random(0, this.h),
                AL.random(-50, 50),
                AL.random(-360, 360)
            );
            this.weight.radius = 20;
            this.k = Math.random();
            this.rot = AL.random(-90, -1);
        }

        this.t++;

        requestAnimationFrame(this.draw);
    }
}
