import AL from '../AlgorithmLoader.js';

export default class RadioWaves extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupConstantStyles();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.first = 0;
        this.second = 1;
        this.divisors = [2, 3, 4, 5, 6, 8, 9, 10, 12, 15, 16, 20, 24, 30, 36];
        this.divisor = AL.pickRandomElement(this.divisors);
        this.posX = AL.pickRandomElement(this.divisors);
        this.posY = AL.pickRandomElement(this.divisors);
        this.seq = [this.first, this.second];
    }

    setupConstantStyles() {
        this.ctx.globalCompositeOperation = 'copy';
        this.ctx.shadowBlur = 2;
        this.ctx.lineWidth = 0.5;
    }

    setupDrawingStyles() {
        this.ctx.shadowColor = this.ctx.strokeStyle = AL.randomColor(
            30,
            255,
            1,
            1
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

            this.ctx.arc(
                this.w / this.posX,
                this.h / this.posY,
                radius,
                0,
                2 * Math.PI
            );
            this.ctx.stroke();
        }

        this.t++;

        if (this.t % (this.speed * 360) === 0) {
            this.ctx.beginPath();
            this.setupDrawingStyles();

            this.divisor = AL.pickRandomElement(this.divisors);
            this.posX = AL.pickRandomElement(this.divisors);
            this.posY = AL.pickRandomElement(this.divisors);
        }

        if (this.t % (this.speed * 1440) === 0) {
            this.first = 0;
            this.second = 1;
        }

        requestAnimationFrame(this.draw);
    }
}
