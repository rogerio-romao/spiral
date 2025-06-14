import BA from '../BaseAlgorithm.js';

export default class SoapyBubbles extends BA {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.size = BA.random(5, 50);
        this.length = Math.random() * 5 + 1;
        this.angle = Math.random() * (Math.PI / 4) + 0.1;
        this.rot = BA.random(1, 61);
        this.position = BA.createVector(0, 0);
        this.velocity = BA.createVector(0, 0);
        this.velocity.setLength(this.length);
        this.velocity.setAngle(this.angle);
    }

    setupDrawingStyles() {
        this.ctx.strokeStyle = this.ctx.shadowColor = BA.randomColor(
            50,
            255,
            0.5,
            1
        );
        this.ctx.shadowBlur = 30;
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.beginPath();
            this.ctx.arc(
                this.position.getX(),
                this.position.getY(),
                this.size,
                0,
                2 * Math.PI
            );
            this.ctx.stroke();
            this.ctx.fill();

            this.position.addTo(this.velocity);
        }

        if (this.t % (this.speed * 320) === 0) {
            this.initializeProperties();

            this.ctx.strokeStyle = this.ctx.shadowColor = BA.randomColor(
                50,
                255,
                0.5,
                1
            );
        }

        this.ctx.translate(this.w / 2, this.h / 2);
        this.ctx.rotate((this.rot * Math.PI) / 180);
        this.ctx.translate(-this.w / 2, -this.h / 2);

        this.t++;

        requestAnimationFrame(this.draw);
    }
}
