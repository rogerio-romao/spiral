import AL from '../AlgorithmLoader.js';

export default class PaletteSquares extends AL {
    constructor() {
        super();

        this.name = 'PaletteSquares';

        this.initializeConstantProperties();
        this.initializeProperties();

        this.requestFrame();
    }

    initializeConstantProperties() {
        this.modes = ['hue', 'saturation', 'luminosity', 'alpha', 'random'];
        this.mode = AL.pickRandomElement(this.modes);
        AL.ctx.strokeStyle = 'black';
        AL.ctx.lineWidth = 4;
    }

    initializeProperties() {
        this.rotation = AL.random(1, 100);
        this.colors = AL.generateHSLAPalette(5, this.mode, 30);
        this.squares = Array.from({ length: this.colors.length }, (_, index) => ({
            color: this.colors[index],
            size: AL.random(10, 300),
            x: AL.random(0, AL.w),
            y: AL.random(0, AL.h),
        }));
    }

    draw() {
        if (this.t % this.speed === 0) {
            for (const square of this.squares) {
                AL.ctx.fillStyle = square.color;
                AL.ctx.fillRect(
                    square.x - square.size / 2,
                    square.y - square.size / 2,
                    square.size,
                    square.size,
                );
                AL.ctx.strokeRect(
                    square.x - square.size / 2,
                    square.y - square.size / 2,
                    square.size,
                    square.size,
                );
            }
        }

        this.rotateCanvasRadians(this.rotation);

        this.t += 1;

        if (this.t % (this.speed * 200) === 0) {
            this.initializeProperties();
        }

        if (this.t % (this.speed * 400) === 0) {
            this.mode = AL.pickRandomElement(this.modes);
        }

        this.requestFrame();
    }
}
