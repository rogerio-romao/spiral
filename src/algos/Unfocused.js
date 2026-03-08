import AL from '../AlgorithmLoader.js';

export default class Unfocused extends AL {
    constructor() {
        super();

        this.name = 'Unfocused';

        this.initializeBaseProperties();
        this.initializeProperties();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeBaseProperties() {
        this.rotate = AL.random(1, 61);
    }

    initializeProperties() {
        this.radius1 = AL.random(5, 55);
        this.radius2 = AL.random(5, 55);
        this.radius3 = AL.random(5, 55);
        this.x1 = AL.random(0, AL.w);
        this.y1 = AL.random(0, AL.h);
        this.x2 = AL.random(0, AL.w);
        this.y2 = AL.random(0, AL.h);
        this.x3 = AL.random(0, AL.w);
        this.y3 = AL.random(0, AL.h);
    }

    setupDrawingStyles() {
        AL.ctx.fillStyle = AL.randomColor(10, 255, 0.1, 0.1);
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

        if (this.t % (this.speed * 20) === 0) {
            this.initializeProperties();
            this.setupDrawingStyles();
        }

        if (this.t % (this.speed * 100) === 0) {
            this.initializeBaseProperties();
        }

        if (this.t % (this.speed * 500) === 0) {
            AL.ctx.fillStyle = 'rgba(0,0,0,0.5)';
            this.fillScreen();
            this.setupDrawingStyles();
        }

        this.requestFrame();
    }
}
