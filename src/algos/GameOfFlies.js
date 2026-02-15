import AL from '../AlgorithmLoader.js';

export default class GameOfFlies extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.name = 'Game Of Flies';

        this.initializeProperties();

        this.requestFrame();
    }

    initializeProperties() {
        this.springPoint = { x: this.w / 2, y: this.h / 2 };

        this.p = AL.createParticle(
            AL.random(0, this.w),
            AL.random(0, this.h),
            AL.random(5, 50),
            Math.random() * Math.PI * 2
        );
        this.p.color = AL.randomColor(60, 255, 0.5, 1);
        this.p.radius = AL.random(3, 9);
        this.particles = [this.p];
        this.k = 0.14;
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.fillStyle = 'rgba(0,0,0,0.14)';
            this.ctx.fillRect(0, 0, this.w, this.h);

            for (const particle of this.particles) {
                const dx = this.springPoint.x - particle.x;
                const dy = this.springPoint.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const springForce = distance * this.k;
                const ax = (dx / distance) * springForce;
                const ay = (dy / distance) * springForce;
                particle.vx += ax;
                particle.vy += ay;
                particle.update();

                this.ctx.beginPath();
                this.ctx.arc(
                    particle.x,
                    particle.y,
                    particle.radius,
                    0,
                    2 * Math.PI
                );
                this.ctx.fillStyle = particle.color;
                this.ctx.fill();
            }
        }

        this.t++;

        if (this.t % (this.speed * 130) === 0) {
            const newParticle = AL.createParticle(
                AL.random(0, this.w),
                AL.random(0, this.h),
                AL.random(5, 50),
                Math.random() * Math.PI * 2
            );
            newParticle.color = AL.randomColor(60, 255, 0.5, 1);
            newParticle.radius = AL.random(3, 9);
            this.particles.push(newParticle);
        }

        this.requestFrame();
    }
}
