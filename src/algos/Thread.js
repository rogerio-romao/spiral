import AL from '../AlgorithmLoader.js';

export default class Thread extends AL {
    constructor() {
        super();

        this.name = 'Thread';

        this.initializeProperties();
        this.setupConstentProperties();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeProperties() {
        this.offset = AL.random(30, AL.h * 0.75);
        this.radius = AL.random(25, 350);
        this.rotate = AL.random(1, 35);
        this.angle = 0;
    }

    setupConstentProperties() {
        AL.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    }

    setupDrawingStyles() {
        AL.ctx.strokeStyle = AL.randomColor(20, 255, 0.15, 1);
    }

    draw() {
        if (this.t % this.speed === 0) {
            const y = AL.h / 2 + Math.sin(this.angle) * this.offset;
            this.angle += this.speed;

            AL.ctx.beginPath();
            AL.ctx.arc(AL.w / 2, y, this.radius, 0, 2 * Math.PI);
            AL.ctx.stroke();
        }

        this.t += 1;

        this.rotateCanvasRadians(this.rotate);

        if (this.t % (this.speed * 450) === 0) {
            this.initializeProperties();
            this.setupDrawingStyles();

            this.fillScreen();
        }

        this.requestFrame();
    }
}
