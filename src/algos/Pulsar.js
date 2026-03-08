import AL from '../AlgorithmLoader.js';

export default class Pulsar extends AL {
    constructor() {
        super();

        this.name = 'Pulsar';

        this.initializeProperties();
        this.setupConstantProperties();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeProperties() {
        this.x = AL.random(0, AL.w);
        this.y = AL.random(0, AL.h);
        this.rotate1 = AL.random(1, 90);
        this.rotate2 = AL.random(1, 90);
        this.pulse1 = AL.random(50, 300);
        this.pulse2 = AL.random(30, 200);
        this.cp1x = AL.random(0, AL.w);
        this.cp1y = AL.random(0, AL.h);
        this.cp2x = AL.random(0, AL.w);
        this.cp2y = AL.random(0, AL.h);
    }

    setupConstantProperties() {
        AL.ctx.lineWidth = 5;
        AL.ctx.shadowBlur = 2;
    }

    setupDrawingStyles() {
        AL.ctx.strokeStyle = AL.ctx.shadowColor = AL.randomColor();
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.clearScreen();

            for (let i = 0; i < 20; i++) {
                this.drawBezier(i * 15);
                this.drawBezier(i * -15);
            }
        }

        this.t += 1;

        this.rotateCanvasDegrees(this.rotate1);

        if (this.t % (this.speed * 160) === 0) {
            this.initializeProperties();
            this.setupDrawingStyles();
        }

        this.requestFrame();
    }

    drawBezier(rot) {
        AL.ctx.save();
        AL.ctx.beginPath();
        AL.ctx.moveTo(
            AL.w / 2 + Math.sin(this.t) * this.pulse1,
            AL.h / 2 + Math.cos(this.t) * this.pulse2,
        );
        AL.ctx.translate(AL.w / 2, AL.h / 2);
        AL.ctx.rotate((rot * Math.PI) / 180);
        AL.ctx.bezierCurveTo(
            this.cp1x + rot,
            this.cp1y + this.pulse1,
            this.cp2x - rot,
            this.cp2y - this.pulse2,
            this.x,
            this.y,
        );
        AL.ctx.stroke();
        AL.ctx.closePath();
        AL.ctx.translate(-AL.w / 2, -AL.h / 2);
        AL.ctx.restore();
    }
}
