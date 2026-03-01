import AL from '../AlgorithmLoader.js';

export default class PaletteSquares extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.name = 'PaletteSquares';

        this.initializeConstantProperties();
        this.initializeProperties();

        this.requestFrame();
    }

    initializeConstantProperties() {
        this.modes = ['hue', 'saturation', 'luminosity', 'alpha', 'random'];
        this.mode = AL.pickRandomElement(this.modes);
        this.ctx.strokeStyle = 'black';
        this.ctx.lineWidth = 4;
    }

    initializeProperties() {
        this.rotation = AL.random(1, 100);
        this.colors = AL.generateHSLAPalette(5, this.mode, 30);
        this.squares = Array.from(
            { length: this.colors.length },
            (_, index) => ({
                color: this.colors[index],
                size: AL.random(10, 300),
                x: AL.random(0, this.w),
                y: AL.random(0, this.h),
            }),
        );
    }

    draw() {
        if (this.t % this.speed === 0) {
            for (const square of this.squares) {
                this.ctx.fillStyle = square.color;
                this.ctx.fillRect(
                    square.x - square.size / 2,
                    square.y - square.size / 2,
                    square.size,
                    square.size,
                );
                this.ctx.strokeRect(
                    square.x - square.size / 2,
                    square.y - square.size / 2,
                    square.size,
                    square.size,
                );
            }
        }

        this.rotateCanvasRadians(this.rotation);

        this.t++;

        if (this.t % (this.speed * 200) === 0) {
            this.initializeProperties();
        }

        if (this.t % (this.speed * 400) === 0) {
            this.mode = AL.pickRandomElement(this.modes);
        }

        this.requestFrame();
    }
}
