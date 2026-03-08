import AL from '../AlgorithmLoader.js';

export default class Hive extends AL {
    constructor() {
        super();

        this.name = 'Hive';

        this.initializeBaseProperties();
        this.initializeProperties();
        this.setupConstantStyles();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeBaseProperties() {
        this.angles = [9, 10, 12, 16, 20, 30, 36, 45, 60];
    }

    initializeProperties() {
        this.rows = AL.random(3, 10);
        this.height = AL.h / this.rows;
        this.rot = AL.pickRandomElement(this.angles);
    }

    setupConstantStyles() {
        AL.ctx.shadowBlur = 7;
        AL.ctx.lineWidth = AL.random(7, 18);
    }

    setupDrawingStyles() {
        AL.ctx.strokeStyle = AL.randomColor();
        AL.ctx.shadowColor = AL.randomColor();
        AL.ctx.globalCompositeOperation = 'overlay';
    }

    draw() {
        if (this.t % this.speed === 0) {
            for (let i = 0; i <= this.rows; i++) {
                AL.ctx.strokeRect(
                    AL.random(0, AL.w),
                    i * this.height,
                    AL.random(0, AL.w),
                    this.height,
                );
            }
        }

        this.t += 1;

        this.rotateCanvasDegrees(this.rot);

        if (this.t % (this.speed * 125) === 0) {
            this.initializeProperties();
            this.setupDrawingStyles();
        }

        if (this.t % (this.speed * 500) === 0) {
            AL.ctx.globalCompositeOperation = 'difference';
        }

        if (this.t % (this.speed * 1500) === 0) {
            AL.ctx.globalCompositeOperation = 'hard-light';
        }

        this.requestFrame();
    }
}
