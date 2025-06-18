import AL from '../AlgorithmLoader.js';

export default class CrystalTiles extends AL {
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

        this.speed = 2;
        this.gray = AL.random(50, 215);
        this.y = 0;
        this.x = 0;
        this.size = AL.random(50, 150);
        this.rotate = AL.random(1, 15);
    }

    setupDrawingStyles() {
        this.ctx.strokeStyle = 'white';
        this.ctx.globalCompositeOperation = 'overlay';
        this.ctx.lineWidth = AL.random(1, 4);
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
                this.size = AL.random(35, 150);

                this.ctx.globalCompositeOperation =
                    this.modes[AL.random(0, this.modes.length)];

                this.rotateCanvasRadians(this.rotate);
            }
        }

        this.t++;

        requestAnimationFrame(this.draw);
    }
}
