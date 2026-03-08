import AL from '../AlgorithmLoader.js';

export default class Triangulate extends AL {
    constructor() {
        super();

        this.name = 'Triangulate';

        this.initializeBaseProperties();
        this.initializeProperties();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeBaseProperties() {
        this.divisions = [2, 3, 4, 5, 6, 8, 9, 10, 12];
        this.rotations = [10, 12, 15, 18, 20, 24, 30, 36, 40, 45, 60, 72, 80, 90, 120];
    }

    initializeProperties() {
        this.angle = 0;
        this.size = AL.random(15, 100);
        this.rotate = AL.pickRandomElement(this.rotations);
        this.triangles = AL.pickRandomElement(this.divisions);
        this.radius = AL.random(60, Math.max(AL.w, AL.h) / 2);
    }

    setupDrawingStyles() {
        AL.ctx.lineWidth = 3;
        AL.ctx.strokeStyle = 'black';
        AL.ctx.fillStyle = AL.randomColor(0, 255, 0.2, 0.45);
    }

    drawTriangle(x, y, i) {
        AL.ctx.moveTo(x, y);
        AL.ctx.beginPath();
        AL.ctx.lineTo(x + this.size + i, y + i);
        AL.ctx.lineTo(x + i, y + this.size + i);
        AL.ctx.lineTo(x, y);
        AL.ctx.closePath();
    }

    draw() {
        if (this.t % this.speed === 0) {
            for (let i = 0; i < this.triangles; i++) {
                this.angle = (i * Math.PI * 2) / this.triangles;
                const x = AL.w / 2 + Math.cos(this.angle) * this.radius;
                const y = AL.h / 2 + Math.sin(this.angle) * this.radius;

                this.drawTriangle(x, y, i);
                AL.ctx.fill();
                AL.ctx.stroke();
            }
        }

        this.t += 1;

        this.rotateCanvasDegrees(this.rotate);

        if (this.t % (this.speed * 60) === 0) {
            this.size = AL.random(15, 100);
            this.triangles = AL.pickRandomElement(this.divisions);
            this.angle = 0;
            this.radius = AL.random(60, Math.max(AL.w, AL.h) / 2);

            AL.ctx.fillStyle = AL.randomColor(0, 255, 0.2, 0.45);
        }

        if (this.t % (this.speed * 180) === 0) {
            this.rotate = AL.pickRandomElement(this.rotations);
        }

        this.requestFrame();
    }
}
