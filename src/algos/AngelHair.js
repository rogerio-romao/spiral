import AL from '../AlgorithmLoader.js';

export default class AngelHair extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeBaseProperties();
        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeBaseProperties() {
        this.speed = 3;
    }

    initializeProperties() {
        this.x1 = AL.random(0, this.w);
        this.y1 = AL.random(0, this.h);
        this.x2 = AL.random(0, this.w);
        this.y2 = AL.random(0, this.h);
        this.rotate = AL.random(2, 359);
        this.radius1 = AL.random(20, 300);
        this.radius2 = AL.random(20, 300);
    }

    setupDrawingStyles() {
        this.ctx.lineWidth = 0.3;
        this.ctx.setLineDash([1, 4]);
        this.ctx.strokeStyle = AL.randomColor(120, 255, 0.66, 0.95);
        this.ctx.globalCompositeOperation = 'hard-light';
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.stagger = this.stagger % 4;

            if (this.stagger === 0) {
                this.ctx.moveTo(this.y2, this.x1);
            }

            if (this.stagger === 1) {
                this.ctx.arcTo(
                    this.w / 2,
                    this.h,
                    this.x1,
                    this.y1,
                    this.radius1
                );
                this.ctx.stroke();
            }

            if (this.stagger === 2) {
                this.ctx.arcTo(
                    this.w,
                    this.h / 2,
                    this.x2,
                    this.y2,
                    this.radius2
                );
                this.ctx.stroke();
            }

            if (this.stagger === 3) {
                this.rotateCanvasRadians(this.rotate);
            }
        }

        this.t++;
        this.stagger++;

        if (this.t % (this.speed * 360) === 0) {
            this.initializeProperties();

            if (Math.random() < 0.075) {
                this.ctx.strokeStyle = 'white';
            } else {
                this.ctx.strokeStyle = AL.randomColor(120, 255, 0.66, 0.95);
            }
            this.ctx.beginPath();
        }

        requestAnimationFrame(this.draw);
    }
}
