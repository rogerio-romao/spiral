import AL from '../AlgorithmLoader.js';

export default class Pulsar extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.name = 'Pulsar';

        this.initializeProperties();
        this.setupConstantProperties();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeProperties() {
        this.x = AL.random(0, this.w);
        this.y = AL.random(0, this.h);
        this.rotate1 = AL.random(1, 90);
        this.rotate2 = AL.random(1, 90);
        this.pulse1 = AL.random(50, 300);
        this.pulse2 = AL.random(30, 200);
        this.cp1x = AL.random(0, this.w);
        this.cp1y = AL.random(0, this.h);
        this.cp2x = AL.random(0, this.w);
        this.cp2y = AL.random(0, this.h);
    }

    setupConstantProperties() {
        this.ctx.lineWidth = 5;
        this.ctx.shadowBlur = 2;
    }

    setupDrawingStyles() {
        this.ctx.strokeStyle = this.ctx.shadowColor = AL.randomColor();
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.clearScreen();

            for (let i = 0; i < 20; i++) {
                this.drawBezier(i * 15);
                this.drawBezier(i * -15);
            }
        }

        this.t++;

        this.rotateCanvasDegrees(this.rotate1);

        if (this.t % (this.speed * 160) === 0) {
            this.initializeProperties();
            this.setupDrawingStyles();
        }

        this.requestFrame();
    }

    drawBezier(rot) {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.moveTo(
            this.w / 2 + Math.sin(this.t) * this.pulse1,
            this.h / 2 + Math.cos(this.t) * this.pulse2,
        );
        this.ctx.translate(this.w / 2, this.h / 2);
        this.ctx.rotate((rot * Math.PI) / 180);
        this.ctx.bezierCurveTo(
            this.cp1x + rot,
            this.cp1y + this.pulse1,
            this.cp2x - rot,
            this.cp2y - this.pulse2,
            this.x,
            this.y,
        );
        this.ctx.stroke();
        this.ctx.closePath();
        this.ctx.translate(-this.w / 2, -this.h / 2);
        this.ctx.restore();
    }
}
