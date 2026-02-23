import AL from '../AlgorithmLoader.js';

export default class FourDee extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.name = 'Four Dee';

        this.initializeBaseProperties();
        this.initializeProperties();
        this.setupConstantStyles();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeBaseProperties() {
        this.springPoint = { x: this.w / 2, y: this.h / 2 };
    }

    initializeProperties() {
        this.weight = AL.createParticle(
            AL.random(0, this.w),
            AL.random(0, this.h),
            0,
            0,
        );
        this.weight.radius = 20;
        this.rotate = AL.random(-90, -1);
        this.k = Math.random();
    }

    setupConstantStyles() {
        this.ctx.strokeStyle = AL.randomColor();
    }

    setupDrawingStyles() {
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
                2 * Math.PI,
            );
            this.ctx.fill();
        }

        this.t++;

        this.rotateCanvasRadians(this.rotate);

        if (this.t % (this.speed * 600) === 0) {
            this.ctx.fillStyle = 'black';
            this.fillScreen();

            this.initializeProperties();
            this.setupDrawingStyles();
        }

        this.requestFrame();
    }
}
