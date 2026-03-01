import AL from '../AlgorithmLoader.js';

export default class UFOs extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.name = 'UFOs';

        this.initializeProperties();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeProperties() {
        this.repeats = AL.random(10, 150);
        this.color1 = AL.randomColor();
        this.color2 = AL.randomColor();
        this.color3 = AL.randomColor();
        this.perc1 = AL.random(1, 45);
        this.perc2 = AL.random(1, 45);
    }

    setupDrawingStyles() {
        this.ctx.globalCompositeOperation = 'multiply';
        this.ctx.canvas.style.background = `repeating-radial-gradient(circle at center, ${this.color1}, ${this.color2} ${this.perc2}%, ${this.color3} ${this.perc1}% ${this.repeats}px)`;
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.canvas.style.background = `repeating-radial-gradient(circle at center, ${
                this.color1
            }, ${this.color2} ${this.perc2--}%, ${this.color3} ${this
                .perc1++}% ${this.repeats++}px)`;
        }

        this.t += 1;

        if (this.t % (this.speed * 40) === 0) {
            this.ctx.beginPath();
            this.initializeProperties();
            this.ctx.canvas.style.background = `repeating-radial-gradient(circle at center, ${
                this.color1
            }, ${this.color2} ${this.perc2++}%, ${this.color3} ${this
                .perc1--}% ${this.repeats}px)`;
        }

        this.requestFrame();
    }
}
