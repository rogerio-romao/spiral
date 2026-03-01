import AL from '../AlgorithmLoader.js';

export default class GravityTurbulence extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.name = 'Gravity Turbulence';

        this.initializeProperties();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeProperties() {
        this.sun1 = AL.createParticle(150, 200, 1, Math.random() * Math.PI * 2);
        this.sun2 = AL.createParticle(
            this.w / 2,
            this.h / 2,
            2,
            Math.random() * Math.PI * 2,
        );

        this.sun1.radius = 40;
        this.sun2.radius = 30;
        this.sun1.mass = 50_000;
        this.sun2.mass = -10_000;
        this.numParticles = 375;

        this.particles = [];

        for (let i = 0; i < this.numParticles; i++) {
            const particle = AL.createParticle(
                AL.mathUtils.randomRange(0, this.w),
                AL.mathUtils.randomRange(0, this.h),
                AL.mathUtils.randomRange(7, 8),
                Math.PI / 2 + AL.mathUtils.randomRange(-0.1, 0.1),
            );
            particle.addGravitation(this.sun1);
            particle.addGravitation(this.sun2);
            particle.radius = 1.25;
            this.particles.push(particle);
        }
    }

    setupDrawingStyles() {
        this.shadowColor = 'white';
        this.shadowBlur = 2;
    }

    draw() {
        this.ctx.fillStyle = 'rgba(0,0,0,0.7)';
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
                particle.x = AL.mathUtils.randomRange(0, this.w);
                particle.y = AL.mathUtils.randomRange(0, this.h);
                particle.setSpeed(AL.mathUtils.randomRange(7, 8));
                particle.setHeading(
                    Math.PI / 2 + AL.mathUtils.randomRange(-0.1, 0.1),
                );
            }
        }

        this.t++;

        if (this.t % (this.speed * 250) === 0) {
            this.sun1.mass = AL.mathUtils.randomRange(-100_000, 100_000);
            this.sun1.radius = AL.mathUtils.randomRange(3, 25);
            this.sun1.direction = Math.random() * Math.PI * 2;
            this.sun1.speed = Math.random() * 5 - 2.5;

            this.sun2.mass = AL.mathUtils.randomRange(-100_000, 100_000);
            this.sun2.radius = AL.mathUtils.randomRange(5, 40);
            this.sun2.direction = Math.random() * Math.PI * 2;
            this.sun2.speed = Math.random() * 5 - 2.5;
        }

        this.requestFrame();
    }

    drawPart(particle, color) {
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.radius, 0, 2 * Math.PI);
        this.ctx.fill();
    }
}
