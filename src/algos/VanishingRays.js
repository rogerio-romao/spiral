import AL from '../AlgorithmLoader.js';

export default class VanishingRays extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.name = 'Vanishing Rays';

        this.initializeBaseProperties();
        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeBaseProperties() {
        this.letters = [
            1801, 1802, 1803, 1807, 1814, 1816, 1821, 1826, 1827, 1828, 1829,
            1830, 1831, 1833, 1834, 1835, 1836, 1837, 1838, 1839, 1869, 1872,
            1873, 1877, 1879, 1883, 1884, 1888, 1890, 1894, 1899,
        ];
        this.rotations = [20, 24, 30, 36, 40, 45, 60, 72, 80];
    }

    initializeProperties() {
        this.angle = 1;
        this.incAlpha = 0;
        this.fontSize = AL.random(30, 500);
        this.rotate = AL.pickRandomElement(this.rotations);
        this.letter = String.fromCharCode(AL.pickRandomElement(this.letters));
    }

    setupDrawingStyles() {
        this.ctx.fillStyle = AL.randomColor(50, 200, 0.0025, 0.0025);
        this.ctx.strokeStyle = AL.randomColor(0, 255, 0.8, 0.8);
        this.ctx.font = `bold ${this.fontSize}px sans-serif`;
    }

    draw() {
        if (this.t % this.speed === 0) {
            if (this.t % 6 === 0) {
                this.ctx.fillRect(0, 0, this.w, this.h);
            }

            this.ctx.strokeText(this.letter.repeat(15), this.w / 2, this.h / 2);

            this.rotateCanvasDegrees(this.rotate * this.angle);
        }

        this.t++;

        if (this.t % (this.speed * (1440 / this.rotate)) === 0) {
            this.ctx.strokeStyle = AL.randomColor(0, 255, 0.8, 0.8);
            this.fontSize = AL.random(30, 500);
            this.ctx.font = `bold ${this.fontSize}px sans-serif`;
            this.angle *= -1;
        }

        if (this.t % (this.speed * 360) === 0) {
            this.ctx.fillStyle = AL.randomColor(
                0,
                255,
                0.006 + this.incAlpha,
                0.006 + this.incAlpha
            );
            this.incAlpha += 0.002;
        }

        if (this.t % (this.speed * 720) === 0) {
            this.letter = String.fromCharCode(
                AL.pickRandomElement(this.letters)
            );
        }

        requestAnimationFrame(this.draw);
    }
}
