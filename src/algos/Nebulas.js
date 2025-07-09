import AL from '../AlgorithmLoader.js';

export default class Nebulas extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupConstantStyles();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.gap = AL.random(4, 100);
        this.rotate = AL.random(3, 160);
        this.length = AL.random(50, Math.min(this.w, this.h) / 1.5);
    }

    setupConstantStyles() {
        this.ctx.shadowBlur = 15;
        this.ctx.shadowOffsetX = 5;
        this.ctx.shadowOffsetY = 5;
        this.ctx.shadowColor = 'rgba(255,255,255,0.7)';
    }

    setupDrawingStyles() {
        this.ctx.fillStyle = this.ctx.strokeStyle = AL.randomColor(
            5,
            255,
            0.02,
            0.02
        );
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.lineWidth = AL.random(1, 200);
            this.ctx.strokeRect(this.w / 2, this.h / 2, this.length, this.gap);

            this.rotateCanvasRadians(this.rotate);

            this.length = AL.random(10, Math.max(this.w, this.h));
            this.rotate = AL.random(3, 160);
            this.gap += AL.random(2, 10);
            if (this.gap > 1000) this.gap = 1;
        }

        this.t++;

        if (this.t % (this.speed * 10) === 0) {
            this.ctx.fillRect(
                AL.random(0, this.w),
                AL.random(0, this.h),
                this.gap,
                this.gap
            );
        }

        if (this.t % (this.speed * 70) === 0) {
            this.rotate = -this.rotate;

            this.setupDrawingStyles();
        }

        requestAnimationFrame(this.draw);
    }
}
