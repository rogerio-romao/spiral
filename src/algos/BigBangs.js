import AL from '../AlgorithmLoader.js';

export default class BigBangs extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupConstantStyles();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.r = 1;
        this.i = AL.random(5, 30);
        this.a = AL.random(1, 180);
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
            this.ctx.arc(this.w / 2, this.h / 2, this.r, 0, 2 * Math.PI);
            this.ctx.fill();
            this.ctx.stroke();

            this.r += this.i;
        }

        this.rotateCanvasRadians(this.a);

        if (this.r > Math.max(this.w, this.h)) {
            this.initializeProperties();
            this.setupDrawingStyles();

            this.ctx.fillRect(-this.w, -this.h, 3 * this.w, 3 * this.h);
            this.ctx.beginPath();
        }

        this.t++;

        requestAnimationFrame(this.draw);
    }
}
