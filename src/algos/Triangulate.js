import AL from '../AlgorithmLoader.js';

export default class Triangulate extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.rotations = [
            10, 12, 15, 18, 20, 24, 30, 36, 40, 45, 60, 72, 80, 90, 120,
        ];
        this.rotate = this.rotations[AL.random(0, this.rotations.length)];
        this.radius = AL.random(60, Math.max(this.w, this.h) / 2);
        this.angle = 0;
        this.divisions = [2, 3, 4, 5, 6, 8, 9, 10, 12];
        this.triangles = this.divisions[AL.random(0, this.divisions.length)];
        this.size = AL.random(15, 100);
    }

    setupDrawingStyles() {
        this.ctx.strokeStyle = 'black';
        this.ctx.fillStyle = AL.randomColor(0, 255, 0.2, 0.45);
        this.ctx.lineWidth = 3;
    }

    drawTriangle(x, y, i) {
        this.ctx.moveTo(x, y);
        this.ctx.beginPath();
        this.ctx.lineTo(x + this.size + i, y + i);
        this.ctx.lineTo(x + i, y + this.size + i);
        this.ctx.lineTo(x, y);
        this.ctx.closePath();
    }

    draw() {
        if (this.t % this.speed === 0) {
            for (let i = 0; i < this.triangles; i++) {
                this.angle = (i * Math.PI * 2) / this.triangles;
                const x = this.w / 2 + Math.cos(this.angle) * this.radius;
                const y = this.h / 2 + Math.sin(this.angle) * this.radius;

                this.drawTriangle(x, y, i);
                this.ctx.fill();
                this.ctx.stroke();
            }
        }

        this.ctx.translate(this.w / 2, this.h / 2);
        this.ctx.rotate((this.rotate * Math.PI) / 180);
        this.ctx.translate(-this.w / 2, -this.h / 2);

        if (this.t % (this.speed * 60) === 0) {
            this.size = AL.random(15, 100);
            this.triangles =
                this.divisions[AL.random(0, this.divisions.length)];
            this.angle = 0;
            this.radius = AL.random(60, Math.max(this.w, this.h) / 2);

            this.ctx.fillStyle = AL.randomColor(0, 255, 0.2, 0.45);
        }

        if (this.t % (this.speed * 180) === 0) {
            this.rotate = this.rotations[AL.random(0, this.rotations.length)];
        }

        this.t++;

        requestAnimationFrame(this.draw);
    }
}
