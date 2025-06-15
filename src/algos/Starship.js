import AL from '../AlgorithmLoader.js';

export default class Starship extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.first = 0;
        this.second = 1;
        this.divisors = [2, 3, 4, 5, 6, 8, 9, 10, 12, 15, 16, 20, 24, 30, 36];
        this.divisor = this.divisors[AL.random(0, this.divisors.length)];
        this.seq = [this.first, this.second];
    }

    setupDrawingStyles() {
        this.ctx.globalCompositeOperation = 'hard-light';
        this.ctx.shadowColor = this.ctx.strokeStyle = AL.randomColor(
            0,
            255,
            0.6,
            1
        );
        this.ctx.shadowBlur = 2;
        this.ctx.lineWidth = 0.5;
    }

    draw() {
        if (this.t % this.speed === 0) {
            let radius = this.seq[0] + this.seq[1];
            this.seq.push(radius);
            this.seq.shift();

            if (radius > Math.max(this.w, this.h)) {
                this.first++;
                this.second++;
                this.seq = [this.first, this.second];

                this.ctx.translate(this.w / 2, this.h / 2);
                this.ctx.rotate(Math.PI / this.divisor);
                this.ctx.translate(-this.w / 2, -this.h / 2);
            }

            this.ctx.arc(this.w / 2, this.h / 2, radius, 0, 2 * Math.PI);
            this.ctx.stroke();
        }

        if (this.t % (this.speed * 240) === 0) {
            this.ctx.beginPath();
            this.ctx.shadowColor = this.ctx.strokeStyle = AL.randomColor(
                0,
                255,
                0.6,
                1
            );

            this.divisor = this.divisors[AL.random(0, this.divisors.length)];
        }

        if (this.t % (this.speed * 1200) === 0) {
            this.first = 0;
            this.second = 1;
        }

        this.t++;

        requestAnimationFrame(this.draw);
    }
}
