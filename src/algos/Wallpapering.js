import AL from '../AlgorithmLoader.js';

export default class Wallpapering extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
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
        this.ctx.lineWidth = 3;
        this.ctx.strokeStyle = 'black';
        this.ctx.globalCompositeOperation = 'overlay';
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.strokeRect(this.x, this.y, this.size, this.size);
            this.ctx.fillStyle = AL.randomColor();
            this.ctx.fillRect(this.x, this.y, this.size, this.size);

            this.x += this.size;
            if (this.x > this.w) {
                this.x = 0;
                this.y += this.size;
            }
            if (this.y > this.h) {
                this.x = 0;
                this.y = 0;
                this.size = AL.random(35, 200);

                this.ctx.globalCompositeOperation = AL.pickRandomElement(
                    this.modes
                );
            }
        }

        this.t++;

        requestAnimationFrame(this.draw);
    }
}
