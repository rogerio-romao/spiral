import AL from '../AlgorithmLoader.js';

export default class DeepSea extends AL {
    constructor() {
        super();

        this.name = 'Deep Sea';

        this.initializeBaseProperties();
        this.initializeProperties();
        this.setupConstantStyles();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeBaseProperties() {
        this.rotations = [4, 5, 6, 8, 9, 10, 12, 15, 18, 20, 24, 30, 36, 40, 45, 72, 90];
    }

    initializeProperties() {
        this.startX = AL.random(0, AL.w);
        this.startY = AL.random(0, AL.h);
        this.cp1x = AL.random(0, AL.w);
        this.cp1y = AL.random(0, AL.h);
        this.cp2x = AL.random(0, AL.w);
        this.cp2y = AL.random(0, AL.h);
        this.endX = AL.random(0, AL.w);
        this.endY = AL.random(0, AL.h);
        this.factor = AL.random(180, 850);
        this.factor2 = AL.random(36, 170);
        this.rotate = AL.pickRandomElement(this.rotations);
    }

    setupConstantStyles() {
        AL.ctx.lineWidth = 0.1;
        AL.ctx.fillStyle = 'rgba(0, 0, 0, 0.045)';
        AL.ctx.shadowBlur = 2;
    }

    setupDrawingStyles() {
        AL.ctx.strokeStyle = AL.randomColor(50, 200, 0.35, 0.7);
        AL.ctx.shadowColor = AL.randomColor(75, 200, 0.3, 0.5);
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.fillScreen();
            AL.ctx.moveTo(this.startX, this.startY);
            AL.ctx.bezierCurveTo(this.cp1x, this.cp1y, this.cp2x, this.cp2y, this.endX, this.endY);
            AL.ctx.stroke();

            this.endX += Math.sin(this.t) * this.factor;
            this.endY += Math.cos(this.t) * this.factor;
            this.cp1x += Math.sin(this.t) * this.factor2;
            this.cp1y += Math.cos(this.t) * this.factor2;
        }

        this.t += 1;

        this.rotateCanvasDegrees(this.rotate);

        if (this.t % (this.speed * 270) === 0) {
            this.initializeProperties();
            this.setupDrawingStyles();
            AL.ctx.beginPath();
        }

        this.requestFrame();
    }
}
