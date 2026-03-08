import AL from '../AlgorithmLoader.js';

export default class PietriDish extends AL {
    constructor() {
        super();

        this.name = 'Pietri Dish';

        this.initializeProperties();
        this.setupConstantStyles();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeProperties() {
        this.y = 0;
        this.x = 0;
        this.size = AL.random(15, 115);
        this.rotate = AL.random(1, 90);
    }

    setupConstantStyles() {
        AL.ctx.shadowBlur = 35;
        AL.ctx.globalCompositeOperation = 'overlay';
        AL.ctx.shadowColor = AL.randomColor(100, 255, 0.75, 1);
    }

    setupDrawingStyles() {
        AL.ctx.fillStyle = AL.randomColor();
        AL.ctx.lineWidth = AL.random(2, 18);
        AL.ctx.strokeStyle = AL.randomColor();
        AL.ctx.shadowColor = AL.randomColor(100, 255, 0.75, 1);
    }

    draw() {
        if (this.t % this.speed === 0) {
            AL.ctx.beginPath();
            AL.ctx.arc(
                this.x - this.size / 2,
                this.y - this.size / 2,
                this.size / 2,
                0,
                2 * Math.PI,
            );
            AL.ctx.stroke();
            AL.ctx.fill();

            this.x += this.size;
            if (this.x > AL.w) {
                this.x = 0;
                this.y += this.size;
            }
            if (this.y > AL.h) {
                this.x = 0;
                this.y = 0;
                this.size = AL.random(15, 115);
            }
        }

        this.t += 1;

        if (this.t % (this.speed * 150) === 0) {
            this.rotate = AL.random(1, 90);

            AL.ctx.fillStyle = Math.random() < 0.2 ? 'black' : AL.randomColor();

            AL.ctx.lineWidth = AL.random(2, 18);
            AL.ctx.shadowColor = AL.randomColor(100, 255, 0.75, 1);
        }

        if (this.t % (this.speed * 450) === 0) {
            AL.ctx.beginPath();
            this.size = AL.random(15, 85);
            AL.ctx.strokeStyle = AL.randomColor();
        }

        this.rotateCanvasDegrees(this.rotate);

        this.requestFrame();
    }
}
