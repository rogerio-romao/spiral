import AL from '../AlgorithmLoader.js';

export default class RadioWaves extends AL {
    constructor() {
        super();

        this.name = 'Radio Waves';

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
        this.posX = AL.pickRandomElement(this.divisors);
        this.posY = AL.pickRandomElement(this.divisors);
        this.divisor = AL.pickRandomElement(this.divisors);
    }

    setupConstantStyles() {
        AL.ctx.globalCompositeOperation = 'copy';
        AL.ctx.shadowBlur = 7;
        AL.ctx.lineWidth = 1;
    }

    setupDrawingStyles() {
        AL.ctx.shadowColor = AL.ctx.strokeStyle = AL.randomColor(30, 255, 1, 1);
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

            AL.ctx.arc(AL.w / this.posX, AL.h / this.posY, radius, 0, 2 * Math.PI);
            AL.ctx.stroke();
        }

        this.t += 1;

        if (this.t % (this.speed * 360) === 0) {
            this.initializeProperties();
            this.setupDrawingStyles();
            AL.ctx.beginPath();
        }

        if (this.t % (this.speed * 1440) === 0) {
            this.first = 0;
            this.second = 1;
        }

        this.requestFrame();
    }
}
