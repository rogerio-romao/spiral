import AL from '../AlgorithmLoader.js';

export default class Slices extends AL {
    constructor() {
        super();

        this.name = 'Slices';

        this.initializeProperties();
        this.setupConstantStyles();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeProperties() {
        this.angle = 0;
        this.slice = Math.random();
        this.radius = AL.random(70, 220);
        this.rotate = AL.random(2, 90);
        this.offsetX = AL.random(50, AL.w / 2);
        this.offsetY = AL.random(50, AL.h / 2);
        this.angleChange = Math.random() * 2 - 1;
    }

    setupConstantStyles() {
        AL.ctx.strokeStyle = 'black';
    }

    setupDrawingStyles() {
        AL.ctx.fillStyle = AL.randomColor(30, 255, 0.3, 0.9);
    }

    draw() {
        if (this.t % this.speed === 0) {
            const x = AL.w / 2 + Math.sin(this.angle) * this.offsetX;
            const y = AL.h / 2 + Math.cos(this.angle) * this.offsetY;
            this.angle += this.angleChange;

            AL.ctx.beginPath();
            AL.ctx.arc(x, y, this.radius, 0, this.slice * Math.PI);
            AL.ctx.closePath();
            AL.ctx.fill();
            AL.ctx.stroke();
        }

        this.t += 1;

        this.rotateCanvasDegrees(this.rotate);

        if (this.t % (this.speed * 360) === 0) {
            this.initializeProperties();
            this.setupDrawingStyles();
        }

        this.requestFrame();
    }
}
