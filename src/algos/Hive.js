import AL from '../AlgorithmLoader.js';

export default class Hive extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeBaseProperties();
        this.initializeProperties();
        this.setupConstantStyles();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeBaseProperties() {
        this.angles = [9, 10, 12, 16, 20, 30, 36, 45, 60];
    }

    initializeProperties() {
        this.rows = AL.random(3, 10);
        this.height = this.h / this.rows;
        this.rot = AL.pickRandomElement(this.angles);
    }

    setupConstantStyles() {
        this.ctx.shadowBlur = 7;
        this.ctx.lineWidth = AL.random(7, 18);
    }

    setupDrawingStyles() {
        this.ctx.globalCompositeOperation = 'overlay';
        this.ctx.strokeStyle = AL.randomColor();
        this.ctx.shadowColor = AL.randomColor();
    }

    draw() {
        if (this.t % this.speed === 0) {
            for (let i = 0; i <= this.rows; i++) {
                this.ctx.strokeRect(
                    AL.random(0, this.w),
                    i * this.height,
                    AL.random(0, this.w),
                    this.height
                );
            }
        }

        this.t++;

        this.rotateCanvasDegrees(this.rot);

        if (this.t % (this.speed * 125) === 0) {
            this.initializeProperties();
            this.setupDrawingStyles();
        }

        if (this.t % (this.speed * 500) === 0) {
            this.ctx.globalCompositeOperation = 'difference';
        }

        if (this.t % (this.speed * 1500) === 0) {
            this.ctx.globalCompositeOperation = 'hard-light';
        }

        requestAnimationFrame(this.draw);
    }
}
