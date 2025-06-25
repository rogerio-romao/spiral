import AL from '../AlgorithmLoader.js';

export default class DeepSea extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeConstantProperties();
        this.initializeProperties();
        this.setupConstantStyles();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeConstantProperties() {
        this.rotations = [
            4, 5, 6, 8, 9, 10, 12, 15, 18, 20, 24, 30, 36, 40, 45, 72, 90,
        ];
    }

    initializeProperties() {
        this.rot = AL.pickRandomElement(this.rotations);
        this.startX = AL.random(0, this.w);
        this.startY = AL.random(0, this.h);
        this.cp1x = AL.random(0, this.w);
        this.cp1y = AL.random(0, this.h);
        this.cp2x = AL.random(0, this.w);
        this.cp2y = AL.random(0, this.h);
        this.endX = AL.random(0, this.w);
        this.endY = AL.random(0, this.h);
        this.factor = AL.random(180, 850);
        this.factor2 = AL.random(36, 170);
    }

    setupConstantStyles() {
        this.ctx.lineWidth = 0.1;
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.045)';
        this.ctx.shadowBlur = 2;
    }

    setupDrawingStyles() {
        this.ctx.strokeStyle = AL.randomColor(50, 200, 0.35, 0.7);
        this.ctx.shadowColor = AL.randomColor(75, 200, 0.3, 0.5);
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.fillRect(-this.w, -this.h, 3 * this.w, 3 * this.h);
            this.ctx.moveTo(this.startX, this.startY);
            this.ctx.bezierCurveTo(
                this.cp1x,
                this.cp1y,
                this.cp2x,
                this.cp2y,
                this.endX,
                this.endY
            );
            this.ctx.stroke();

            this.endX += Math.sin(this.t) * this.factor;
            this.endY += Math.cos(this.t) * this.factor;
            this.cp1x += Math.sin(this.t) * this.factor2;
            this.cp1y += Math.cos(this.t) * this.factor2;
        }

        this.t++;

        this.rotateCanvasDegrees(this.rot);

        if (this.t % (this.speed * 270) === 0) {
            this.initializeProperties();
            this.setupDrawingStyles();
            this.ctx.beginPath();
        }

        requestAnimationFrame(this.draw);
    }
}
