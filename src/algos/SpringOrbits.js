import AL from '../AlgorithmLoader.js';

export default class SpringOrbits extends AL {
    constructor() {
        super();

        this.name = 'Spring Orbits';

        this.initializeBaseProperties();
        this.initializeProperties();
        this.setupConstantStyles();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeBaseProperties() {
        this.k = 0.02;
        this.springPoint = { x: AL.w / 2, y: AL.h / 2 };
    }

    initializeProperties() {
        AL.weight = AL.createParticle(
            AL.random(0, AL.w),
            AL.random(0, AL.h),
            AL.random(15, 120),
            Math.random() * Math.PI * 2,
        );
        AL.weight.friction = 0.99;
    }

    setupConstantStyles() {
        AL.ctx.lineWidth = 3;
        AL.ctx.shadowBlur = 2;
        AL.ctx.fillStyle = 'white';
    }

    setupDrawingStyles() {
        AL.ctx.strokeStyle = AL.ctx.shadowColor = AL.randomColor();
    }

    draw() {
        if (this.t % this.speed === 0) {
            const dx = this.springPoint.x - AL.weight.x;
            const dy = this.springPoint.y - AL.weight.y;
            const distance = Math.hypot(dx, dy);
            const springForce = distance * this.k;
            const ax = (dx / distance) * springForce;
            const ay = (dy / distance) * springForce;
            AL.weight.vx += ax;
            AL.weight.vy += ay;
            AL.weight.update();

            AL.ctx.beginPath();
            AL.ctx.arc(this.springPoint.x, this.springPoint.y, 8, 0, 2 * Math.PI);
            AL.ctx.fill();
            AL.ctx.beginPath();
            AL.ctx.moveTo(AL.weight.x, AL.weight.y);
            AL.ctx.lineTo(this.springPoint.x, this.springPoint.y);
            AL.ctx.stroke();
        }

        this.t += 1;

        if (this.t % (this.speed * 180) === 0) {
            this.initializeProperties();
            this.setupDrawingStyles();
        }

        this.requestFrame();
    }
}
