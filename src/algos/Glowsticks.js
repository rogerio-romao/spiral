import AL from '../AlgorithmLoader.js';

export default class Glowsticks extends AL {
    constructor() {
        super();

        this.name = 'Glowsticks';

        this.initializeProperties();
        this.setupConstantStyles();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeProperties() {
        this.rotation = AL.random(1, 200);
        this.distance = AL.random(10, 100);
        this.y = AL.random(this.distance, AL.h);
        this.x = AL.random(0, AL.w - this.distance);
    }

    setupConstantStyles() {
        AL.ctx.shadowBlur = 5;
    }

    setupDrawingStyles() {
        AL.ctx.strokeStyle = AL.ctx.shadowColor = AL.randomColor();
    }

    draw() {
        if (this.t % this.speed === 0) {
            AL.ctx.moveTo(this.x, this.y);
            AL.ctx.lineTo(this.x + this.distance, this.y - this.distance);
            AL.ctx.stroke();

            this.x += 1;
            this.y += 1;

            if (this.x > AL.w) {
                this.x = 0;
            }
            if (this.x < 0) {
                this.x = AL.w - this.distance;
            }
            if (this.y > AL.h) {
                this.y = this.distance;
            }
            if (this.y < 0) {
                this.x = AL.h;
            }
        }

        this.t += 1;

        if (this.t % (this.speed * 900) === 0) {
            this.initializeProperties();
            this.setupDrawingStyles();
            this.clearScreen();

            AL.ctx.beginPath();
        }

        this.rotateCanvasRadians(this.rotation);

        this.requestFrame();
    }
}
