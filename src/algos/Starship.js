import AL from '../AlgorithmLoader.js';

export default class Starship extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.name = 'Starship';

        this.initializeBaseProperties();
        this.initializeProperties();
        this.setupConstantStyles();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeBaseProperties() {
        this.first = 0;
        this.second = 1;
        this.seq = [this.first, this.second];
        this.divisors = [2, 3, 4, 5, 6, 8, 9, 10, 12, 15, 16, 20, 24, 30, 36];
    }

    initializeProperties() {
        this.divisor = AL.pickRandomElement(this.divisors);
    }

    setupConstantStyles() {
        this.ctx.shadowBlur = 2;
        this.ctx.lineWidth = 0.5;
        this.ctx.globalCompositeOperation = 'hard-light';
    }

    setupDrawingStyles() {
        this.ctx.shadowColor = this.ctx.strokeStyle = AL.randomColor(
            0,
            255,
            0.6,
            1,
        );
    }

    draw() {
        if (this.t % this.speed === 0) {
            const radius = this.seq[0] + this.seq[1];
            this.seq.push(radius);
            this.seq.shift();

            if (radius > Math.max(this.w, this.h)) {
                this.first++;
                this.second++;
                this.seq = [this.first, this.second];

                this.rotateCanvasRadians(Math.PI / this.divisor);
            }

            this.ctx.arc(this.w / 2, this.h / 2, radius, 0, 2 * Math.PI);
            this.ctx.stroke();
        }

        this.t++;

        if (this.t % (this.speed * 240) === 0) {
            this.initializeProperties();
            this.setupDrawingStyles();
            this.ctx.beginPath();
        }

        if (this.t % (this.speed * 1200) === 0) {
            this.first = 0;
            this.second = 1;
        }

        this.requestFrame();
    }
}
