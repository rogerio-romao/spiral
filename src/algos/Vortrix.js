import AL from '../AlgorithmLoader.js';

export default class Vortrix extends AL {
    constructor() {
        super();

        this.name = 'Vortrix';

        this.initializeProperties();
        this.setupConstantStyles();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeProperties() {
        this.x = AL.random(0, AL.w);
        this.y = AL.random(0, AL.h);
        this.size = AL.random(60, 400);
        this.rotate = AL.random(1, 60);
    }

    setupConstantStyles() {
        AL.ctx.shadowBlur = 10;
        AL.ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    }

    setupDrawingStyles() {
        AL.ctx.strokeStyle = AL.ctx.shadowColor = AL.randomColor(0, 255, 0.5, 1);
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.drawTriangle(this.x, this.y);
            this.size -= 1;
        }

        this.t += 1;

        this.rotateCanvasRadians(this.rotate);

        if (this.t % (this.speed * 360) === 0) {
            this.initializeProperties();
            this.setupDrawingStyles();
        }

        this.requestFrame();
    }

    /**
     * Draws a triangle with one vertex at (x, y) and the other two vertices determined by the size.
     * @param {number} x - The x-coordinate of the first vertex of the triangle.
     * @param {number} y - The y-coordinate of the first vertex of the triangle.
     */
    drawTriangle(x, y) {
        AL.ctx.beginPath();
        AL.ctx.moveTo(x, y);
        AL.ctx.lineTo(x + this.size, y);
        AL.ctx.lineTo(x, y + this.size);
        AL.ctx.lineTo(x, y);
        AL.ctx.closePath();
        AL.ctx.fill();
        AL.ctx.stroke();
    }
}
