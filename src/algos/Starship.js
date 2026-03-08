import AL from '../AlgorithmLoader.js';

export default class Starship extends AL {
    constructor() {
        super();

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
        AL.ctx.shadowBlur = 2;
        AL.ctx.lineWidth = 0.5;
        AL.ctx.globalCompositeOperation = 'hard-light';
    }

    setupDrawingStyles() {
        AL.ctx.shadowColor = AL.ctx.strokeStyle = AL.randomColor(0, 255, 0.6, 1);
    }

    draw() {
        if (this.t % this.speed === 0) {
            const radius = this.seq[0] + this.seq[1];
            this.seq.push(radius);
            this.seq.shift();

            if (radius > Math.max(AL.w, AL.h)) {
                this.first += 1;
                this.second += 1;
                this.seq = [this.first, this.second];

                this.rotateCanvasRadians(Math.PI / this.divisor);
            }

            AL.ctx.arc(AL.w / 2, AL.h / 2, radius, 0, 2 * Math.PI);
            AL.ctx.stroke();
        }

        this.t += 1;

        if (this.t % (this.speed * 240) === 0) {
            this.initializeProperties();
            this.setupDrawingStyles();
            AL.ctx.beginPath();
        }

        if (this.t % (this.speed * 1200) === 0) {
            this.first = 0;
            this.second = 1;
        }

        this.requestFrame();
    }
}
