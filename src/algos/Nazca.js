import AL from '../AlgorithmLoader.js';

export default class Nazca extends AL {
    constructor() {
        super();

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
        AL.ctx.globalCompositeOperation = 'soft-light';
    }

    setupDrawingStyles() {
        AL.ctx.strokeStyle = AL.randomColor(0, 255, 0.75, 1);
        AL.ctx.fillStyle = AL.randomColor(0, 255, 0.15, 0.55);
    }

    draw() {
        if (this.t % this.speed === 0) {
            AL.ctx.arc(AL.w / 2, AL.h / 2, this.radius, 0, Math.random() * Math.PI);
            AL.ctx.fill();
            AL.ctx.stroke();
            this.radius += this.increment;
        }

        this.t += 1;

        this.rotateCanvasRadians(-this.angle);

        if (this.radius > Math.max(AL.w, AL.h)) {
            this.cycles += 1;
            if (this.cycles % 10 === 0) {
                AL.ctx.globalCompositeOperation = AL.pickRandomElement(this.modes);
            }

            this.initializeProperties();
            this.setupDrawingStyles();
            AL.ctx.lineWidth = AL.random(1, 7);
            AL.ctx.beginPath();
        }

        this.requestFrame();
    }
}
