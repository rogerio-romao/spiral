import AL from '../AlgorithmLoader.js';

export default class Records extends AL {
    constructor() {
        super();

        this.name = 'Records';

        this.initializeProperties();
        this.setupConstantStyles();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeProperties() {
        this.angle = 0;
        this.rotate = AL.random(1, 45);
        this.offset = AL.random(50, 330);
        this.angleChange = Math.random() * 7;
        this.radius = AL.random(50, Math.min(AL.w, AL.h) / 2);
    }

    setupConstantStyles() {
        AL.ctx.lineWidth = 2;
    }

    setupDrawingStyles() {
        AL.ctx.strokeStyle = AL.ctx.fillStyle = AL.randomColor();
    }

    draw() {
        if (this.t % this.speed === 0) {
            AL.ctx.beginPath();
            AL.ctx.arc(AL.w / 2, AL.h / 2, this.radius, 0, Math.random() * Math.PI);
            AL.ctx.stroke();

            this.angle += this.angleChange;
            this.radius = Math.abs(this.radius + Math.sin(this.angle) * this.offset);
        }

        this.t += 1;

        this.rotateCanvasRadians(this.rotate);

        if (this.t % (this.speed * 120) === 0) {
            this.initializeProperties();

            AL.ctx.beginPath();
            AL.ctx.arc(AL.w / 2, AL.h / 2, this.radius, 0, 2 * Math.PI);
            AL.ctx.fill();

            this.setupDrawingStyles();
        }

        this.requestFrame();
    }
}
