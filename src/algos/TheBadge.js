import AL from '../AlgorithmLoader.js';

export default class TheBadge extends AL {
    constructor() {
        super();

        this.name = 'The Badge';

        this.initializeProperties();
        this.setupConstantStyles();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeProperties() {
        this.rotate = AL.random(0, 360);
        this.randCol = AL.random(0, 255);
        this.length = AL.random(50, Math.min(AL.w, AL.h) / 1.5);
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

        AL.ctx.lineWidth = 3;
        AL.ctx.strokeStyle = 'white';
    }

    setupDrawingStyles() {
        AL.ctx.fillStyle = `rgb(${this.randCol + AL.random(-28, 28)},${
            this.randCol + AL.random(-28, 28)
        },${this.randCol + AL.random(-28, 28)})`;
    }

    draw() {
        if (this.t % this.speed === 0) {
            AL.ctx.fillRect(
                AL.w / 2 - this.length * 1.5,
                AL.h / 2 - this.length * 1.5,
                3 * this.length,
                3 * this.length,
            );

            AL.ctx.strokeRect(
                AL.w / 2 - this.length * 1.5,
                AL.h / 2 - this.length * 1.5,
                3 * this.length,
                3 * this.length,
            );

            this.rotateCanvasDegrees(this.rotate);
        }

        this.t += 1;

        if (this.t % (this.speed * 25) === 0) {
            this.length = AL.random(5, Math.min(AL.w, AL.h) / 3);
            this.randCol = AL.random(0, 255);

            this.setupDrawingStyles();
        }

        if (this.t % (this.speed * 50) === 0) {
            this.rotate = AL.random(0, 360);
            AL.ctx.globalCompositeOperation = AL.pickRandomElement(this.modes);
        }

        this.requestFrame();
    }
}
