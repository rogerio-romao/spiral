import BA from '../BaseAlgorithm.js';

export default class DeepSea extends BA {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.rotations = [
            4, 5, 6, 8, 9, 10, 12, 15, 18, 20, 24, 30, 36, 40, 45, 72, 90,
        ];
        this.rot = this.rotations[BA.random(0, this.rotations.length)];
        this.startX = BA.random(0, this.w);
        this.startY = BA.random(0, this.h);
        this.cp1x = BA.random(0, this.w);
        this.cp1y = BA.random(0, this.h);
        this.cp2x = BA.random(0, this.w);
        this.cp2y = BA.random(0, this.h);
        this.endX = BA.random(0, this.w);
        this.endY = BA.random(0, this.h);
        this.factor = BA.random(180, 850);
        this.factor2 = BA.random(36, 170);
    }

    setupDrawingStyles() {
        this.ctx.strokeStyle = BA.randomColor(50, 200, 0.35, 0.7);
        this.ctx.shadowColor = BA.randomColor(75, 200, 0.3, 0.5);
        this.ctx.lineWidth = 0.1;
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.045)';
        this.ctx.shadowBlur = 2;
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
        this.ctx.translate(this.w / 2, this.h / 2);
        this.ctx.rotate((this.rot * Math.PI) / 180);
        this.ctx.translate(-this.w / 2, -this.h / 2);

        if (this.t % (this.speed * 270) === 0) {
            this.startX = BA.random(0, this.w);
            this.startY = BA.random(0, this.h);
            this.cp1x = BA.random(0, this.w);
            this.cp1y = BA.random(0, this.h);
            this.cp2x = BA.random(0, this.w);
            this.cp2y = BA.random(0, this.h);
            this.endX = BA.random(0, this.w);
            this.endY = BA.random(0, this.h);
            this.factor = BA.random(180, 850);
            this.factor2 = BA.random(36, 170);
            this.rot = this.rotations[BA.random(0, this.rotations.length)];

            this.ctx.beginPath();
            this.ctx.strokeStyle = BA.randomColor(50, 200, 0.35, 0.7);
            this.ctx.shadowColor = BA.randomColor(75, 255, 0.3, 0.5);
        }

        this.t++;

        requestAnimationFrame(this.draw);
    }
}
