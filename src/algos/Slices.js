import AL from '../AlgorithmLoader.js';

export default class Slices extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupConstantStyles();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.angle = 0;
        this.slice = Math.random();
        this.radius = AL.random(70, 220);
        this.rotate = AL.random(2, 90);
        this.offsetX = AL.random(50, this.w / 2);
        this.offsetY = AL.random(50, this.h / 2);
        this.angleChange = Math.random() * 2 - 1;
    }

    setupConstantStyles() {
        this.ctx.strokeStyle = 'black';
    }

    setupDrawingStyles() {
        this.ctx.fillStyle = AL.randomColor(30, 255, 0.3, 0.9);
    }

    draw() {
        if (this.t % this.speed === 0) {
            const x = this.w / 2 + Math.sin(this.angle) * this.offsetX;
            const y = this.h / 2 + Math.cos(this.angle) * this.offsetY;
            this.angle += this.angleChange;

            this.ctx.beginPath();
            this.ctx.arc(x, y, this.radius, 0, this.slice * Math.PI);
            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.stroke();
        }

        this.t++;

        this.rotateCanvasDegrees(this.rotate);

        if (this.t % (this.speed * 360) === 0) {
            this.initializeProperties();
            this.setupDrawingStyles();
        }

        requestAnimationFrame(this.draw);
    }
}
