import AL from '../AlgorithmLoader.js';

export default class Matter extends AL {
    constructor() {
        super();

        this.name = 'Matter';

        this.initializeBaseProperties();
        this.initializeProperties();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeBaseProperties() {
        this.rotations = [
            1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13, 14, 15, 17, 19, 20, 21, 22, 23, 25, 26, 28, 29,
            30, 31, 32, 33, 34, 35, 37, 38, 39, 40, 41, 42, 43, 44, 45,
        ];
    }

    initializeProperties() {
        this.x1 = AL.w / 2;
        this.y1 = AL.h / 2;
        this.x2 = AL.random(0, AL.w);
        this.y2 = AL.random(0, AL.h);
        this.x3 = AL.random(0, AL.w);
        this.y3 = AL.random(0, AL.h);
        this.radius1 = AL.random(5, 150);
        this.radius2 = AL.random(5, 150);
        this.radius3 = AL.random(5, 150);
        this.rotate = AL.pickRandomElement(this.rotations);
    }

    setupDrawingStyles() {
        AL.ctx.fillStyle = AL.randomColor(10, 255, 0.02, 0.07);
    }

    draw() {
        if (this.t % this.speed === 0) {
            AL.ctx.beginPath();
            AL.ctx.arc(this.x1, this.y1, this.radius1, 0, 2 * Math.PI);
            AL.ctx.fill();
            AL.ctx.beginPath();
            AL.ctx.arc(this.x2, this.y2, this.radius2, 0, 2 * Math.PI);
            AL.ctx.fill();
            AL.ctx.beginPath();
            AL.ctx.arc(this.x3, this.y3, this.radius3, 0, 2 * Math.PI);
            AL.ctx.fill();
        }

        this.t += 1;

        this.rotateCanvasRadians(this.rotate);

        if (this.t % (this.speed * 120) === 0) {
            this.initializeProperties();
            this.setupDrawingStyles();
        }

        this.requestFrame();
    }
}
