import AL from '../AlgorithmLoader.js';

export default class Wallpapering extends AL {
    constructor() {
        super();

        this.name = 'Wallpapering';

        this.initializeProperties();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeProperties() {
        this.modes = [
            'source-over',
            'lighter',
            'xor',
            'overlay',
            'multiply',
            'screen',
            'overlay',
            'darken',
            'lighten',
            'color-dodge',
            'color-burn',
            'hard-light',
            'overlay',
            'soft-light',
            'difference',
            'saturation',
            'luminosity',
            'overlay',
        ];

        this.y = 0;
        this.x = 0;
        this.size = AL.random(50, 200);
    }

    setupDrawingStyles() {
        AL.ctx.lineWidth = 3;
        AL.ctx.strokeStyle = 'black';
        AL.ctx.globalCompositeOperation = 'overlay';
    }

    draw() {
        if (this.t % this.speed === 0) {
            AL.ctx.strokeRect(this.x, this.y, this.size, this.size);
            AL.ctx.fillStyle = AL.randomColor();
            AL.ctx.fillRect(this.x, this.y, this.size, this.size);

            this.x += this.size;
            if (this.x > AL.w) {
                this.x = 0;
                this.y += this.size;
            }
            if (this.y > AL.h) {
                this.x = 0;
                this.y = 0;
                this.size = AL.random(35, 200);

                AL.ctx.globalCompositeOperation = AL.pickRandomElement(this.modes);
            }
        }

        this.t += 1;

        this.requestFrame();
    }
}
