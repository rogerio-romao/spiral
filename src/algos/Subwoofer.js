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
        this.factor = AL.random(10, this.size);
        this.divisor = AL.random(1, 25);
        this.size = AL.random(15, 200);
        this.color1 = AL.randomColor();
        this.color2 = AL.randomColor();
        this.color3 = AL.randomColor();
        this.color4 = AL.randomColor();
        this.color5 = AL.randomColor();
        this.colors = [
            this.color1,
            this.color2,
            this.color3,
            this.color4,
            this.color5,
        ];
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
                this.ctx.strokeStyle = this.colors[i % 5];
                this.ctx.beginPath();
                this.ctx.arc(
                    this.w / 2,
                    this.h / 2,
                    this.size + i * this.ctx.lineWidth,
                    0,
                    2 * Math.PI
                );
                this.ctx.stroke();
            }
        }

        this.t++;

        this.size = Math.max(
            this.size + Math.sin(this.t / this.divisor) * this.factor,
            1
        );

        if (this.t % (this.speed * 110) === 0) {
            this.initializeProperties();
            this.setupDrawingStyles();
        }

        this.requestFrame();
    }
}
