import AL from '../AlgorithmLoader.js';

export default class Polyhedra extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.name = 'Polyhedra';

        this.initializeBaseProperties();
        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeBaseProperties() {
        this.rotations = [
            1, 2, 4, 5, 6, 7, 8, 9, 10, 12, 14, 15, 16, 17, 19, 20, 21, 23, 27,
            28, 29,
        ];
    }

    initializeProperties() {
        this.x = AL.random(0, this.w);
        this.y = AL.random(0, this.h);
        this.rotate = AL.pickRandomElement(this.rotations);
    }

    setupDrawingStyles() {
        this.ctx.fillStyle = AL.randomColor(0, 255, 0.01, 0.05);
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.lineTo(this.x, this.y);
            this.ctx.fill();

            this.rotateCanvasRadians(this.rotate);
        }

        this.t++;

        if (this.t % (this.speed * 60) === 0) {
            this.initializeProperties();
            this.setupDrawingStyles();
            this.ctx.beginPath();
        }

        requestAnimationFrame(this.draw);
    }
}
