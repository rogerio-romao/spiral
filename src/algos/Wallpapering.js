import BA from '../BaseAlgorithm.js';

export default class Wallpapering extends BA {
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
        this.size = BA.random(50, 200);
    }

    setupDrawingStyles() {
        this.ctx.strokeStyle = 'black';
        this.ctx.lineWidth = 3;
        this.ctx.globalCompositeOperation = 'overlay';
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.strokeRect(this.x, this.y, this.size, this.size);
            this.ctx.fillStyle = BA.randomColor();
            this.ctx.fillRect(this.x, this.y, this.size, this.size);

            this.x += this.size;
            if (this.x > this.w) {
                this.x = 0;
                this.y += this.size;
            }
            if (this.y > this.h) {
                this.x = 0;
                this.y = 0;
                this.size = BA.random(35, 200);

                this.ctx.globalCompositeOperation =
                    this.modes[BA.random(0, this.modes.length)];
            }
        }

        this.t++;

        requestAnimationFrame(this.draw);
    }
}
