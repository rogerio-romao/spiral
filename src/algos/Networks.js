import AL from '../AlgorithmLoader.js';

export default class Networks extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.name = 'Networks';

        this.initializeBaseProperties();
        this.initializeProperties();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeBaseProperties() {
        this.x = this.w / 2;
        this.y = this.h / 2;
    }

    initializeProperties() {
        this.drawAmount = 0.01;
        this.rotate = AL.random(1, 71);
        this.size = AL.random(30, 200);
        this.sizeIncrease = Math.random() * AL.random(0, 5);
    }

    setupDrawingStyles() {
        this.ctx.strokeStyle = AL.randomColor();
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.arc(this.x, this.y, this.size, 0, this.drawAmount * Math.PI * 2);
            this.ctx.stroke();

            this.drawAmount += 0.001;
            this.size += this.sizeIncrease;
            this.ctx.beginPath();
        }

        this.t += 1;

        this.rotateCanvasRadians(this.rotate);

        if (this.t % (this.speed * 480) === 0) {
            this.x = AL.random(0, this.w);
            this.y = AL.random(0, this.h);

            this.initializeProperties();
            this.setupDrawingStyles();
        }

        this.requestFrame();
    }
}
