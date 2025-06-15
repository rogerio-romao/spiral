import BA from '../BaseAlgorithm.js';

export default class GravityTurbulence extends BA {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.sun1 = BA.createParticle(150, 200, 1, Math.random() * Math.PI * 2);
        this.sun2 = BA.createParticle(
            this.w / 2,
            this.h / 2,
            2,
            Math.random() * Math.PI * 2
        );

        this.sun1.mass = 50000;
        this.sun1.radius = 40;
        this.sun2.mass = -10000;
        this.sun2.radius = 30;
        this.numParticles = 225;
        this.particles = [];

        for (let i = 0; i < this.numParticles; i++) {
            const p = BA.createParticle(
                BA.mathUtils.randomRange(0, this.w),
                BA.mathUtils.randomRange(0, this.h),
                BA.mathUtils.randomRange(7, 8),
                Math.PI / 2 + BA.mathUtils.randomRange(-0.1, 0.1)
            );
            p.addGravitation(this.sun1);
            p.addGravitation(this.sun2);
            p.radius = 1.25;
            this.particles.push(p);
        }
    }

    draw() {
        this.ctx.fillStyle = 'rgba(0,0,0,0.75)';
        this.ctx.fillRect(0, 0, this.w, this.h);

        this.sun1.update();
        this.sun2.update();

        if (this.sun1.x - this.sun1.radius > this.w) {
            this.sun1.x = -this.sun1.radius;
        }
        if (this.sun1.x + this.sun1.radius < 0) {
            this.sun1.x = this.w + this.sun1.radius;
        }
        if (this.sun1.y - this.sun1.radius > this.h) {
            this.sun1.y = -this.sun1.radius;
        }
        if (this.sun1.y + this.sun1.radius < 0) {
            this.sun1.y = this.h + this.sun1.radius;
        }
        if (this.sun2.x - this.sun2.radius > this.w) {
            this.sun2.x = -this.sun2.radius;
        }
        if (this.sun2.x + this.sun2.radius < 0) {
            this.sun2.x = this.w + this.sun2.radius;
        }
        if (this.sun2.y - this.sun2.radius > this.h) {
            this.sun2.y = -this.sun2.radius;
        }
        if (this.sun2.y + this.sun2.radius < 0) {
            this.sun2.y = this.h + this.sun2.radius;
        }

        for (const particle of this.particles) {
            particle.update();
            this.drawPart(particle, 'white');

            if (
                particle.x > this.w ||
                particle.x < 0 ||
                particle.y > this.h ||
                particle.y < 0
            ) {
                particle.x = BA.mathUtils.randomRange(0, this.w);
                particle.y = BA.mathUtils.randomRange(0, this.h);
                particle.setSpeed(BA.mathUtils.randomRange(7, 8));
                particle.setHeading(
                    Math.PI / 2 + BA.mathUtils.randomRange(-0.1, 0.1)
                );
            }
        }

        if (this.t % (this.speed * 250) === 0) {
            this.sun1.mass = BA.mathUtils.randomRange(-100000, 100000);
            this.sun1.radius = BA.mathUtils.randomRange(3, 25);
            this.sun1.direction = Math.random() * Math.PI * 2;
            this.sun1.speed = Math.random() * 5 - 2.5;
            this.sun2.mass = BA.mathUtils.randomRange(-100000, 100000);
            this.sun2.radius = BA.mathUtils.randomRange(5, 40);
            this.sun2.direction = Math.random() * Math.PI * 2;
            this.sun2.speed = Math.random() * 5 - 2.5;
        }

        this.t++;

        requestAnimationFrame(this.draw);
    }

    drawPart(p, color) {
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI);
        this.ctx.fill();
    }
}
