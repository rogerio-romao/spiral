import AL from '../AlgorithmLoader.js';

export default class SpiralText extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.name = 'Spiral Text';

        this.initializeProperties();
        this.setupConstantStyles();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.x = AL.random(0, this.w);
        this.y = AL.random(0, this.h);
        this.rotate = AL.random(1, 20);
        this.picker = AL.random(0, 11);
    }

    setupConstantStyles() {
        this.ctx.textAlign = 'center';
        this.ctx.globalCompositeOperation = 'color';
    }

    setupDrawingStyles() {
        this.ctx.strokeStyle = AL.randomColor(0, 255, 1, 1);
        this.ctx.font = `bold ${AL.random(10, 400)}px sans-serif`;
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.strokeText('SPIRAL', this.x, this.y);

            this.rotateCanvasDegrees(this.rotate);

            this.x = AL.random(0, this.w);
        }

        this.t++;

        if (this.t % (this.speed * 90) === 0) {
            this.y = AL.random(0, this.h);
            this.picker = AL.random(0, 11);

            if (this.picker === 0) {
                this.ctx.strokeStyle = 'white';
            } else if (this.picker === 1) {
                this.ctx.strokeStyle = 'black';
            } else if (this.picker === 2 || this.picker === 3) {
                this.ctx.globalCompositeOperation = 'color-dodge';
            } else if (this.picker === 4 || this.picker === 5) {
                this.ctx.globalCompositeOperation = 'source-over';
            } else if (this.picker === 6) {
                this.ctx.globalCompositeOperation = 'darken';
            } else if (this.picker === 7) {
                this.ctx.globalCompositeOperation = 'color-burn';
            } else {
                this.ctx.globalCompositeOperation = 'color';
            }

            this.setupDrawingStyles();
        }

        if (this.t % (this.speed * 180) === 0) {
            this.rotate = AL.random(1, 30);
        }

        requestAnimationFrame(this.draw);
    }
}
