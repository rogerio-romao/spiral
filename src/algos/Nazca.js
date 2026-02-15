import AL from '../AlgorithmLoader.js';

export default class Nazca extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.name = 'Nazca';

        this.initializeBaseProperties();
        this.initializeProperties();
        this.setupConstantStyles();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeBaseProperties() {
        this.cycles = 0;
        this.modes = ['soft-light', 'overlay', 'color'];
    }

    initializeProperties() {
        this.radius = 1;
        this.angle = AL.random(1, 180);
        this.increment = AL.random(13, 60);
    }

    setupConstantStyles() {
        this.ctx.globalCompositeOperation = 'soft-light';
    }

    setupDrawingStyles() {
        this.ctx.strokeStyle = AL.randomColor(0, 255, 0.75, 1);
        this.ctx.fillStyle = AL.randomColor(0, 255, 0.15, 0.55);
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.arc(
                this.w / 2,
                this.h / 2,
                this.radius,
                0,
                Math.random() * Math.PI
            );
            this.ctx.fill();
            this.ctx.stroke();
            this.radius += this.increment;
        }

        this.t++;

        this.rotateCanvasRadians(-this.angle);

        if (this.radius > Math.max(this.w, this.h)) {
            this.cycles++;
            if (this.cycles % 10 === 0) {
                this.ctx.globalCompositeOperation = AL.pickRandomElement(
                    this.modes
                );
            }

            this.initializeProperties();
            this.setupDrawingStyles();
            this.ctx.lineWidth = AL.random(1, 7);
            this.ctx.beginPath();
        }

        this.requestFrame();
    }
}
