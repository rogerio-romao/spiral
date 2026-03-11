import AL from '../AlgorithmLoader.js';

export default class FourDee extends AL {
    constructor() {
        super();

        this.name = 'Four Dee';

        this.initializeBaseProperties();
        this.initializeProperties();
        this.setupConstantStyles();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeBaseProperties() {
        this.springPoint = { x: AL.w / 2, y: AL.h / 2 };
    }

    initializeProperties() {
        this.weight = AL.createParticle(AL.random(0, AL.w), AL.random(0, AL.h), 0, 0);
        this.rotate = AL.random(-90, -1);
        this.k = Math.random();
    }

    setupConstantStyles() {
        AL.ctx.strokeStyle = AL.randomColor();
        this.radius = 20;
    }

    setupDrawingStyles() {
        AL.ctx.fillStyle = AL.randomColor(40, 255, 0.1, 0.25);
    }

    draw() {
        if (this.t % this.speed === 0) {
            const dx = this.springPoint.x - this.weight.x;
            const dy = this.springPoint.y - this.weight.y;
            const distance = Math.hypot(dx, dy);
            // Avoid division by zero and excessively large forces when the weight is very close to the spring point
            if (distance > 1e-8) {
                const springForce = distance * this.k;
                const ax = (dx / distance) * springForce;
                const ay = (dy / distance) * springForce;
                this.weight.vx += ax;
                this.weight.vy += ay;
            }
            this.weight.update();

            AL.ctx.beginPath();
            AL.ctx.arc(this.weight.x, this.weight.y, this.radius, 0, 2 * Math.PI);
            AL.ctx.fill();
        }

        this.t += 1;

        this.rotateCanvasRadians(this.rotate);

        if (this.t % (this.speed * 600) === 0) {
            AL.ctx.fillStyle = 'black';
            this.fillScreen();

            this.initializeProperties();
            this.setupDrawingStyles();
        }

        this.requestFrame();
    }
}
