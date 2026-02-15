import AL from '../AlgorithmLoader.js';

export default class Trance extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

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
        this.radius = AL.random(25, Math.max(this.w, this.h) / 2);
    }

    setupDrawingStyles() {
        this.ctx.fillStyle = AL.randomColor();
        this.ctx.strokeStyle = AL.randomColor();
        this.ctx.globalCompositeOperation = 'overlay';
    }

    draw() {
        if (this.t % this.speed === 0) {
            for (let i = 0; i < this.squares; i++) {
                this.angle = (i * Math.PI * 2) / this.squares;
                const x = this.w / 2 + Math.cos(this.angle) * this.radius;
                const y = this.h / 2 + Math.sin(this.angle) * this.radius;

                this.ctx.beginPath();
                this.ctx.fillRect(
                    x - this.size / 4,
                    y - this.size / 4,
                    this.size / 2,
                    this.size / 2
                );
                this.ctx.strokeRect(
                    x - this.size / 2,
                    y - this.size / 2,
                    this.size,
                    this.size
                );
            }
        }

        this.t++;

        this.rotateCanvasRadians(this.rotate);

        if (this.t % (this.speed * 9) === 0) {
            this.initializeProperties();

            this.ctx.globalCompositeOperation = 'overlay';
            this.ctx.fillStyle = AL.randomColor();
        }

        if (this.t % (this.speed * 63) === 0) {
            this.ctx.globalCompositeOperation = 'source-over';
            this.ctx.strokeStyle = AL.randomColor();
        }

        this.requestFrame();
    }
}
