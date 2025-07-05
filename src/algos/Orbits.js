import AL from '../AlgorithmLoader.js';

export default class Orbits extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeBaseProperties();
        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeBaseProperties() {
        this.rot = AL.random(1, 6);
        this.endAngle = AL.random(101, 360);
    }

    initializeProperties() {
        this.radius = AL.random(30, this.h);
        this.radius2 = AL.random(10, this.radius);
        this.startAngle = AL.random(0, 100);
    }

    setupDrawingStyles() {
        this.ctx.strokeStyle = AL.randomColor(5, 255, 0.2, 0.2);
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.ellipse(
                this.w / 2,
                this.h / 2,
                this.radius,
                this.radius2,
                this.rot,
                this.startAngle,
                this.endAngle
            );
        }
        this.ctx.stroke();

        this.t++;

        this.rotateCanvasRadians(this.rot);

        if (this.t % (this.speed * 150) === 0) {
            this.initializeProperties();
            this.rot = AL.random(-3, 3);

            this.setupDrawingStyles();
            this.ctx.beginPath();
        }

        requestAnimationFrame(this.draw);
    }
}
