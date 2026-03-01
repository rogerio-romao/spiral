import AL from '../AlgorithmLoader.js';

export default class CrystalTiles extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.name = 'Crystal Tiles';

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

        this.gray = AL.random(50, 215);
        this.size = AL.random(50, 150);
        this.rotate = AL.random(1, 15);
        this.speed = 2;
        this.y = 0;
        this.x = 0;
    }

    setupDrawingStyles() {
        this.ctx.globalCompositeOperation = 'overlay';
        this.ctx.lineWidth = AL.random(1, 4);
        this.ctx.strokeStyle = 'white';
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

                this.ctx.globalCompositeOperation = AL.pickRandomElement(
                    this.modes,
                );

                this.rotateCanvasRadians(this.rotate);
            }
        }

        this.t += 1;

        this.requestFrame();
    }
}
