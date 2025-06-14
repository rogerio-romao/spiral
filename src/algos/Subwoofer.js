import BA from '../BaseAlgorithm.js';

export default class Subwoofer extends BA {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.size = BA.random(15, 200);
        this.factor = BA.random(10, this.size);
        this.divisor = BA.random(1, 25);
        this.color1 = BA.randomColor();
        this.color2 = BA.randomColor();
        this.color3 = BA.randomColor();
        this.color4 = BA.randomColor();
        this.color5 = BA.randomColor();
        this.colors = [
            this.color1,
            this.color2,
            this.color3,
            this.color4,
            this.color5,
        ];
    }

    setupDrawingStyles() {
        this.ctx.strokeStyle = 'white';
        this.ctx.lineWidth = BA.random(7, 70);
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
            this.ctx.lineWidth = BA.random(7, 70);
        }
        requestAnimationFrame(this.draw);
    }
}
