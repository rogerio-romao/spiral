import AL from '../AlgorithmLoader.js';

export default class Subwoofer extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.name = 'Subwoofer';

        this.initializeProperties();
        this.setupConstantStyles();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeProperties() {
        this.size = AL.random(15, 200);
        this.divisor = AL.random(1, 25);
        this.factor = AL.random(10, this.size);
        this.colors = AL.generateRGBAPalette(5);
    }

    setupConstantStyles() {
        this.ctx.strokeStyle = 'white';
    }

    setupDrawingStyles() {
        this.ctx.lineWidth = AL.random(7, 70);
    }

    draw() {
        if (this.t % this.speed === 0) {
            for (let i = 0; i < 30; i++) {
                this.ctx.strokeStyle = this.colors[i % this.colors.length];
                this.ctx.beginPath();
                this.ctx.arc(
                    this.w / 2,
                    this.h / 2,
                    this.size + i * this.ctx.lineWidth,
                    0,
                    2 * Math.PI,
                );
                this.ctx.stroke();
            }
        }

        this.t += 1;

        this.size = Math.max(
            this.size + Math.sin(this.t / this.divisor) * this.factor,
            1,
        );

        if (this.t % (this.speed * 110) === 0) {
            this.initializeProperties();
            this.setupDrawingStyles();
        }

        this.requestFrame();
    }
}
