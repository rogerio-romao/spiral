import AL from '../AlgorithmLoader.js';

export default class Smooth extends AL {
    constructor() {
        super();

        this.name = 'Smooth';

        this.initializeProperties();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeProperties() {
        this.size = AL.random(50, 500);
        this.rotate = AL.random(1, 11);
        this.x = AL.random(0, AL.w);
        this.y = AL.random(0, AL.h);
    }

    setupDrawingStyles() {
        AL.ctx.fillStyle = AL.randomColor(0, 255, 0.03, 0.08);
    }

    draw() {
        if (this.t % this.speed === 0) {
            AL.ctx.fillRect(this.x, this.y, this.size, this.size);
        }

        this.t += 1;

        this.rotateCanvasRadians(this.rotate);

        if (this.t % (this.speed * 60) === 0) {
            this.initializeProperties();
            this.setupDrawingStyles();
        }

        this.requestFrame();
    }
}
