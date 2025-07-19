import AL from '../AlgorithmLoader.js';

export default class Sandala extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeBaseProperties();
        this.initializeProperties();
        this.setupConstantStyles();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeBaseProperties() {
        this.letters = [
            3201, 3202, 3203, 3204, 3206, 3207, 3208, 3209, 3212, 3214, 3215,
            3218, 3219, 3221, 3222, 3223, 3226, 3227, 3228, 3231, 3232, 3234,
            3236, 3238, 3244, 3248, 3249, 3250, 3254, 3255, 3260, 3261, 3263,
            3270, 3294, 3298,
        ];
    }

    initializeProperties() {
        this.cols = AL.random(5, 12);
        this.rows = AL.random(5, 12);
        this.rotate = AL.random(1, 60);
    }

    setupConstantStyles() {
        this.ctx.globalCompositeOperation = 'soft-light';
    }

    setupDrawingStyles() {
        this.ctx.strokeStyle = AL.randomColor(0, 255, 1, 1);
    }

    draw() {
        if (this.t % this.speed === 0) {
            for (let row = 0; row <= this.rows; row++) {
                this.rotateCanvasRadians(this.rotate);

                for (let col = 0; col <= this.cols; col++) {
                    this.ctx.strokeText(
                        String.fromCharCode(AL.pickRandomElement(this.letters)),
                        row * (this.w / this.cols),
                        col * (this.h / this.rows)
                    );
                }
            }
        }

        this.t++;

        if (this.t % (this.speed * 80) === 0) {
            this.initializeProperties();
            this.setupDrawingStyles();
        }

        requestAnimationFrame(this.draw);
    }
}
