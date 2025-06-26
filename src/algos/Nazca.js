import AL from '../AlgorithmLoader.js';

export default class Nazca extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeConstantProperties();
        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeConstantProperties() {
        this.cycles = 0;
        this.modes = ['soft-light', 'overlay', 'color'];
    }

    initializeProperties() {
        this.r = 1;
        this.i = AL.random(13, 60);
        this.a = AL.random(1, 180);
    }

    setupDrawingStyles() {
        this.ctx.fillStyle = AL.randomColor(0, 255, 0.15, 0.55);
        this.ctx.strokeStyle = AL.randomColor(0, 255, 0.75, 1);
        this.ctx.globalCompositeOperation = 'soft-light';
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.arc(
                this.w / 2,
                this.h / 2,
                this.r,
                0,
                Math.random() * Math.PI
            );
            this.ctx.fill();
            this.ctx.stroke();
            this.r += this.i;
        }

        this.t++;

        this.rotateCanvasRadians(-this.a);

        if (this.r > Math.max(this.w, this.h)) {
            this.cycles++;
            if (this.cycles % 10 === 0) {
                this.ctx.globalCompositeOperation = AL.pickRandomElement(
                    this.modes
                );
            }

            this.initializeProperties();

            this.ctx.lineWidth = AL.random(1, 7);
            this.ctx.fillStyle = AL.randomColor(0, 255, 0.15, 0.55);
            this.ctx.strokeStyle = AL.randomColor(0, 255, 0.75, 1);
            this.ctx.beginPath();
        }

        requestAnimationFrame(this.draw);
    }
}
