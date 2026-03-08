import AL from '../AlgorithmLoader.js';

export default class Networks extends AL {
    constructor() {
        super();

        this.name = 'Networks';

        this.initializeBaseProperties();
        this.initializeProperties();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeBaseProperties() {
        this.x = AL.w / 2;
        this.y = AL.h / 2;
    }

    initializeProperties() {
        this.drawAmount = 0.01;
        this.rotate = AL.random(1, 71);
        this.size = AL.random(30, 200);
        this.sizeIncrease = Math.random() * AL.random(0, 5);
    }

    setupDrawingStyles() {
        AL.ctx.strokeStyle = AL.randomColor();
    }

    draw() {
        if (this.t % this.speed === 0) {
            AL.ctx.arc(this.x, this.y, this.size, 0, this.drawAmount * Math.PI * 2);
            AL.ctx.stroke();

            this.drawAmount += 0.001;
            this.size += this.sizeIncrease;
            AL.ctx.beginPath();
        }

        this.t += 1;

        this.rotateCanvasRadians(this.rotate);

        if (this.t % (this.speed * 480) === 0) {
            this.x = AL.random(0, AL.w);
            this.y = AL.random(0, AL.h);

            this.initializeProperties();
            this.setupDrawingStyles();
        }

        this.requestFrame();
    }
}
