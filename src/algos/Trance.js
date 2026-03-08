import AL from '../AlgorithmLoader.js';

export default class Trance extends AL {
    constructor() {
        super();

        this.name = 'Trance';

        this.initializeBaseProperties();
        this.initializeProperties();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeBaseProperties() {
        this.divisions = [2, 4, 6, 8, 10, 12];
    }

    initializeProperties() {
        this.angle = 0;
        this.size = AL.random(15, 220);
        this.rotate = AL.random(1, 71);
        this.squares = AL.pickRandomElement(this.divisions);
        this.radius = AL.random(25, Math.max(AL.w, AL.h) / 2);
    }

    setupDrawingStyles() {
        AL.ctx.fillStyle = AL.randomColor();
        AL.ctx.strokeStyle = AL.randomColor();
        AL.ctx.globalCompositeOperation = 'overlay';
    }

    draw() {
        if (this.t % this.speed === 0) {
            for (let i = 0; i < this.squares; i++) {
                this.angle = (i * Math.PI * 2) / this.squares;
                const x = AL.w / 2 + Math.cos(this.angle) * this.radius;
                const y = AL.h / 2 + Math.sin(this.angle) * this.radius;

                AL.ctx.beginPath();
                AL.ctx.fillRect(x - this.size / 4, y - this.size / 4, this.size / 2, this.size / 2);
                AL.ctx.strokeRect(x - this.size / 2, y - this.size / 2, this.size, this.size);
            }
        }

        this.t += 1;

        this.rotateCanvasRadians(this.rotate);

        if (this.t % (this.speed * 9) === 0) {
            this.initializeProperties();

            AL.ctx.globalCompositeOperation = 'overlay';
            AL.ctx.fillStyle = AL.randomColor();
        }

        if (this.t % (this.speed * 63) === 0) {
            AL.ctx.globalCompositeOperation = 'source-over';
            AL.ctx.strokeStyle = AL.randomColor();
        }

        this.requestFrame();
    }
}
