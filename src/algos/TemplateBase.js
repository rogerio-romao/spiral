import AL from '../AlgorithmLoader.js';

export default class TemplateBase extends AL {
    constructor() {
        super();

        this.name = 'TemplateBase';

        this.initializeProperties();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeProperties() {
        this.rotation = AL.random(1, 100);
        this.x = AL.random(0, AL.w);
        this.y = AL.random(0, AL.h);
        this.width = AL.random(10, 200);
        this.height = AL.random(10, 200);
    }

    setupDrawingStyles() {
        AL.ctx.fillStyle = AL.randomColor();
    }

    draw() {
        if (this.t % this.speed === 0) {
            AL.ctx.fillRect(this.x, this.y, this.width, this.height);
        }

        this.rotateCanvasRadians(this.rotation);

        this.t += 1;

        if (this.t % (this.speed * 200) === 0) {
            this.initializeProperties();
            this.setupDrawingStyles();
        }

        this.requestFrame();
    }
}
