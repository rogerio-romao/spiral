import BA from '../BaseAlgorithm.js';

export default class UFOs extends BA {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.color1 = BA.randomColor();
        this.color2 = BA.randomColor();
        this.color3 = BA.randomColor();
        this.perc1 = BA.random(1, 45);
        this.perc2 = BA.random(1, 45);
        this.repeats = BA.random(10, 150);
    }

    setupDrawingStyles() {
        this.ctx.canvas.style.background = `repeating-radial-gradient(circle at center, ${this.color1}, ${this.color2} ${this.perc2}%, ${this.color3} ${this.perc1}% ${this.repeats}px)`;
        this.ctx.globalCompositeOperation = 'multiply';
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.canvas.style.background = `repeating-radial-gradient(circle at center, ${
                this.color1
            }, ${this.color2} ${this.perc2--}%, ${this.color3} ${this
                .perc1++}% ${this.repeats++}px)`;
        }

        if (this.t % (this.speed * 40) === 0) {
            this.ctx.beginPath();
            this.color1 = BA.randomColor();
            this.color2 = BA.randomColor();
            this.color3 = BA.randomColor();
            this.perc1 = BA.random(1, 45);
            this.perc2 = BA.random(1, 45);
            this.repeats = BA.random(10, 150);
            this.ctx.canvas.style.background = `repeating-radial-gradient(circle at center, ${
                this.color1
            }, ${this.color2} ${this.perc2++}%, ${this.color3} ${this
                .perc1--}% ${this.repeats}px)`;
        }

        this.t++;

        requestAnimationFrame(this.draw);
    }
}
