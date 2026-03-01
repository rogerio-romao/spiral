import AL from '../AlgorithmLoader.js';

export default class TemplateBase extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.name = 'TemplateBase';

        this.initializeProperties();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeProperties() {
        this.rotation = AL.random(1, 100);
        this.x = AL.random(0, this.w);
        this.y = AL.random(0, this.h);
        this.width = AL.random(10, 200);
        this.height = AL.random(10, 200);
    }

    setupDrawingStyles() {
        this.ctx.fillStyle = AL.randomColor();
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.fillRect(this.x, this.y, this.width, this.height);
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
