import AL from '../AlgorithmLoader.js';

export default class BigBangs extends AL {
    constructor() {
        super();

        this.name = 'Big Bangs';

        this.initializeProperties();
        this.setupConstantStyles();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeProperties() {
        this.radius = 1;
        this.angle = AL.random(1, 180);
        this.increment = AL.random(5, 30);
    }

    setupConstantStyles() {
        AL.ctx.globalCompositeOperation = 'hard-light';
    }

    setupDrawingStyles() {
        AL.ctx.fillStyle = AL.randomColor(0, 255, 0.02, 0.05);
        AL.ctx.strokeStyle = AL.randomColor(0, 255, 0.5, 1);
    }

    draw() {
        if (this.t % this.speed === 0) {
            AL.ctx.arc(AL.w / 2, AL.h / 2, this.radius, 0, 2 * Math.PI);
            AL.ctx.fill();
            AL.ctx.stroke();

            this.radius += this.increment;
        }

        this.rotateCanvasDegrees(this.angle);

        if (this.radius > Math.max(AL.w, AL.h)) {
            this.initializeProperties();
            this.setupDrawingStyles();

            this.fillScreen();
            AL.ctx.beginPath();
        }

        this.t += 1;

        this.requestFrame();
    }
}
