import AL from '../AlgorithmLoader.js';

export default class Glowsticks extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.name = 'Glowsticks';

        this.initializeProperties();
        this.setupConstantStyles();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeProperties() {
        this.rotation = AL.random(1, 200);
        this.distance = AL.random(10, 100);
        this.y = AL.random(this.distance, this.h);
        this.x = AL.random(0, this.w - this.distance);
    }

    setupConstantStyles() {
        this.ctx.shadowBlur = 5;
    }

    setupDrawingStyles() {
        this.ctx.strokeStyle = this.ctx.shadowColor = AL.randomColor();
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.moveTo(this.x++, this.y++);
            this.ctx.lineTo(this.x + this.distance, this.y - this.distance);
            this.ctx.stroke();

            if (this.x > this.w) {
                this.x = 0;
            }
            if (this.x < 0) {
                this.x = this.w - this.distance;
            }
            if (this.y > this.h) {
                this.y = this.distance;
            }
            if (this.y < 0) {
                this.x = this.h;
            }
        }

        this.t += 1;

        if (this.t % (this.speed * 900) === 0) {
            this.initializeProperties();
            this.setupDrawingStyles();
            this.clearScreen();

            this.ctx.beginPath();
        }

        this.rotateCanvasRadians(this.rotation);

        this.requestFrame();
    }
}
