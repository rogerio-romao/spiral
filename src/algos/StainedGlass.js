import AL from '../AlgorithmLoader.js';

export default class StainedGlass extends AL {
    constructor() {
        super();

        this.name = 'Stained Glass';

        this.initializeConstantProperties();
        this.initializeProperties();
        this.setupConstantStyles();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeConstantProperties() {
        // Grid coordinates for stagger values 0-29
        this.gridPositions = [
            [0, 0],
            [1, 0],
            [2, 0],
            [3, 0],
            [4, 0],
            [5, 0],
            [5, 1],
            [4, 1],
            [3, 1],
            [2, 1],
            [1, 1],
            [0, 1],
            [0, 2],
            [1, 2],
            [2, 2],
            [3, 2],
            [4, 2],
            [5, 2],
            [5, 3],
            [4, 3],
            [3, 3],
            [2, 3],
            [1, 3],
            [0, 3],
            [0, 4],
            [1, 4],
            [2, 4],
            [3, 4],
            [4, 4],
            [5, 4],
        ];
    }

    initializeProperties() {
        this.length = AL.w / 6;
        this.height = AL.h / 5;
        this.random1 = AL.random(0, 3);
        this.random2 = AL.random(1, 359);
    }

    setupConstantStyles() {
        this.modes = ['color', 'hue', 'saturation', 'overlay'];

        AL.ctx.beginPath();
        AL.ctx.lineWidth = 5;
        AL.ctx.strokeStyle = 'black';
        AL.ctx.globalCompositeOperation = 'color';
    }

    setupDrawingStyles() {
        AL.ctx.fillStyle = AL.randomColor(0, 255, 0, 1);
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.stagger = AL.random(0, 30);

            if (this.stagger < this.gridPositions.length) {
                const [col, row] = this.gridPositions[this.stagger];
                AL.ctx.strokeRect(col * this.length, row * this.height, this.length, this.height);
                AL.ctx.fillRect(col * this.length, row * this.height, this.length, this.height);
                this.setupDrawingStyles();
            }
        }

        this.t += 1;

        if (this.t % (this.speed * 50) === 0) {
            this.random1 = AL.random(0, 3);

            this.rotateCanvasDegrees(this.random2);

            AL.ctx.globalCompositeOperation = AL.pickRandomElement(this.modes);

            AL.ctx.fillRect(
                AL.w / 2 - this.random1 * this.length,
                AL.h / 2 - this.height * 1.5,
                this.random1 * 2 * this.length,
                3 * this.height,
            );
            AL.ctx.strokeRect(
                AL.w / 2 - this.random1 * this.length,
                AL.h / 2 - this.height * 2.5,
                this.random1 * 2 * this.length,
                5 * this.height,
            );
        }

        this.requestFrame();
    }
}
