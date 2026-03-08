import AL from '../AlgorithmLoader.js';

export default class Autumn extends AL {
    constructor() {
        super();

        this.name = 'Autumn';

        this.initializeBaseProperties();
        this.initializeProperties();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeBaseProperties() {
        this.size = AL.random(13, 110);
    }

    initializeProperties() {
        this.y = 0;
        this.x = 0;
        this.rotate = AL.random(1, 90);
    }

    setupDrawingStyles() {
        AL.ctx.fillStyle = AL.randomColor(0, 255, 0.1, 0.6);
    }

    draw() {
        if (this.t % this.speed === 0) {
            AL.ctx.beginPath();
            AL.ctx.arc(this.x, this.y, this.size, 0, Math.PI);
            AL.ctx.fill();

            this.x += this.size;
            if (this.x > AL.w) {
                this.x = 0;
                this.y += this.size;
                this.size = AL.random(15, 110);
            }
            if (this.y > AL.h) {
                this.initializeProperties();
                this.setupDrawingStyles();
            }
        }

        this.t += 1;

        this.rotateCanvasDegrees(this.rotate);

        this.requestFrame();
    }
}
