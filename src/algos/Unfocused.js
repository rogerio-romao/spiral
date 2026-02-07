import AL from '../AlgorithmLoader.js';

export default class Unfocused extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.name = 'Unfocused';

        this.initializeBaseProperties();
        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeBaseProperties() {
        this.rotate = AL.random(1, 61);
    }

    initializeProperties() {
        this.radius1 = AL.random(5, 55);
        this.radius2 = AL.random(5, 55);
        this.radius3 = AL.random(5, 55);
        this.x1 = AL.random(0, this.w);
        this.y1 = AL.random(0, this.h);
        this.x2 = AL.random(0, this.w);
        this.y2 = AL.random(0, this.h);
        this.x3 = AL.random(0, this.w);
        this.y3 = AL.random(0, this.h);
    }

    setupDrawingStyles() {
        this.ctx.fillStyle = AL.randomColor(10, 255, 0.1, 0.1);
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.beginPath();
            this.ctx.arc(this.x1, this.y1, this.radius1, 0, 2 * Math.PI);
            this.ctx.fill();
            this.ctx.beginPath();
            this.ctx.arc(this.x2, this.y2, this.radius2, 0, 2 * Math.PI);
            this.ctx.fill();
            this.ctx.beginPath();
            this.ctx.arc(this.x3, this.y3, this.radius3, 0, 2 * Math.PI);
            this.ctx.fill();
        }

        this.t++;

        this.rotateCanvasRadians(this.rotate);

        if (this.t % (this.speed * 20) === 0) {
            this.initializeProperties();
            this.setupDrawingStyles();
        }

        if (this.t % (this.speed * 100) === 0) {
            this.initializeBaseProperties();
        }

        if (this.t % (this.speed * 500) === 0) {
            this.ctx.fillStyle = 'rgba(0,0,0,0.5)';
            this.fillScreen();
            this.setupDrawingStyles();
        }

        requestAnimationFrame(this.draw);
    }
}
