import AL from '../AlgorithmLoader.js';

export default class SpiralText extends AL {
    constructor() {
        super();

        this.name = 'Spiral Text';

        this.initializeProperties();
        this.setupConstantStyles();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeProperties() {
        this.x = AL.random(0, AL.w);
        this.y = AL.random(0, AL.h);
        this.rotate = AL.random(1, 20);
        this.picker = AL.random(0, 11);
    }

    setupConstantStyles() {
        AL.ctx.textAlign = 'center';
        AL.ctx.globalCompositeOperation = 'color';
    }

    setupDrawingStyles() {
        AL.ctx.strokeStyle = AL.randomColor(0, 255, 1, 1);
        AL.ctx.font = `bold ${AL.random(10, 400)}px sans-serif`;
    }

    draw() {
        if (this.t % this.speed === 0) {
            AL.ctx.strokeText('SPIRAL', this.x, this.y);

            this.rotateCanvasDegrees(this.rotate);

            this.x = AL.random(0, AL.w);
        }

        this.t += 1;

        if (this.t % (this.speed * 90) === 0) {
            this.y = AL.random(0, AL.h);
            this.picker = AL.random(0, 11);

            if (this.picker === 0) {
                AL.ctx.strokeStyle = 'white';
            } else if (this.picker === 1) {
                AL.ctx.strokeStyle = 'black';
            } else if (this.picker === 2 || this.picker === 3) {
                AL.ctx.globalCompositeOperation = 'color-dodge';
            } else if (this.picker === 4 || this.picker === 5) {
                AL.ctx.globalCompositeOperation = 'source-over';
            } else if (this.picker === 6) {
                AL.ctx.globalCompositeOperation = 'darken';
            } else if (this.picker === 7) {
                AL.ctx.globalCompositeOperation = 'color-burn';
            } else {
                AL.ctx.globalCompositeOperation = 'color';
            }

            this.setupDrawingStyles();
        }

        if (this.t % (this.speed * 180) === 0) {
            this.rotate = AL.random(1, 30);
        }

        this.requestFrame();
    }
}
