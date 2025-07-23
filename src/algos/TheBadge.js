import AL from '../AlgorithmLoader.js';

export default class TheBadge extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupConstantStyles();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.rotate = AL.random(0, 360);
        this.randCol = AL.random(0, 255);
        this.length = AL.random(50, Math.min(this.w, this.h) / 1.5);
    }

    setupConstantStyles() {
        this.modes = [
            'difference',
            'soft-light',
            'color',
            'lighten',
            'darken',
            'overlay',
            'source-atop',
        ];

        this.ctx.lineWidth = 3;
        this.ctx.strokeStyle = 'white';
    }

    setupDrawingStyles() {
        this.ctx.fillStyle = `rgb(${this.randCol + AL.random(-28, 28)},${
            this.randCol + AL.random(-28, 28)
        },${this.randCol + AL.random(-28, 28)})`;
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.fillRect(
                this.w / 2 - this.length * 1.5,
                this.h / 2 - this.length * 1.5,
                3 * this.length,
                3 * this.length
            );

            this.ctx.strokeRect(
                this.w / 2 - this.length * 1.5,
                this.h / 2 - this.length * 1.5,
                3 * this.length,
                3 * this.length
            );

            this.rotateCanvasDegrees(this.rotate);
        }

        this.t++;

        if (this.t % (this.speed * 25) === 0) {
            this.length = AL.random(5, Math.min(this.w, this.h) / 3);
            this.randCol = AL.random(0, 255);

            this.setupDrawingStyles();
        }

        if (this.t % (this.speed * 50) === 0) {
            this.rotate = AL.random(0, 360);
            this.ctx.globalCompositeOperation = AL.pickRandomElement(
                this.modes
            );
        }

        requestAnimationFrame(this.draw);
    }
}
