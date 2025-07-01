import AL from '../AlgorithmLoader.js';

export default class SpringOrbits extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeConstantProperties();
        this.initializeProperties();
        this.setupConstantStyles();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeConstantProperties() {
        this.springPoint = { x: this.w / 2, y: this.h / 2 };
        this.k = 0.04;
    }

    initializeProperties() {
        this.weight = AL.createParticle(
            AL.random(0, this.w),
            AL.random(0, this.h),
            AL.random(15, 120),
            Math.random() * Math.PI * 2
        );
        this.weight.friction = 0.975;
    }

    setupConstantStyles() {
        this.ctx.shadowBlur = 2;
        this.ctx.lineWidth = 3;
        this.ctx.fillStyle = 'white';
    }

    setupDrawingStyles() {
        this.ctx.strokeStyle = this.ctx.shadowColor = AL.randomColor();
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
                this.springPoint.x,
                this.springPoint.y,
                8,
                0,
                2 * Math.PI
            );
            this.ctx.fill();
            this.ctx.beginPath();
            this.ctx.moveTo(this.weight.x, this.weight.y);
            this.ctx.lineTo(this.springPoint.x, this.springPoint.y);
            this.ctx.stroke();
        }

        this.t++;

        if (this.t % (this.speed * 180) === 0) {
            this.initializeProperties();
            this.setupDrawingStyles();
        }

        requestAnimationFrame(this.draw);
    }
}
