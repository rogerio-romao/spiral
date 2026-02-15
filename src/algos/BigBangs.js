import AL from '../AlgorithmLoader.js';

export default class BigBangs extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

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
        this.ctx.globalCompositeOperation = 'hard-light';
    }

    setupDrawingStyles() {
        this.ctx.fillStyle = AL.randomColor(0, 255, 0.02, 0.05);
        this.ctx.strokeStyle = AL.randomColor(0, 255, 0.5, 1);
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.arc(this.w / 2, this.h / 2, this.radius, 0, 2 * Math.PI);
            this.ctx.fill();
            this.ctx.stroke();

            this.radius += this.increment;
        }

        this.rotateCanvasDegrees(this.angle);

        if (this.radius > Math.max(this.w, this.h)) {
            this.initializeProperties();
            this.setupDrawingStyles();

            this.fillScreen();
            this.ctx.beginPath();
        }

        this.t++;

        this.requestFrame();
    }
}
