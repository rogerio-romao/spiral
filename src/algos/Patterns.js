import AL from '../AlgorithmLoader.js';

export default class Patterns extends AL {
    constructor() {
        super();

        this.name = 'Patterns';

        this.initializeProperties();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeProperties() {
        this.radius = AL.random(10, 250);
        this.rows = Math.ceil(AL.h / 100) + 2;
        this.cols = Math.ceil(AL.w / 100) + 2;
    }

    setupDrawingStyles() {
        AL.ctx.lineWidth = 3;
        AL.ctx.globalAlpha = 0.1;
        AL.ctx.strokeStyle = 'white';
        AL.ctx.globalCompositeOperation = 'overlay';
        AL.ctx.fillStyle = AL.randomColor(0, 255, 0.05, 0.6);
    }

    draw() {
        if (this.t % this.speed === 0) {
            for (let i = 0; i <= this.rows; i++) {
                for (let j = 0; j <= this.cols; j++) {
                    AL.ctx.beginPath();
                    AL.ctx.arc(100 * j - 50, 100 * i - 50, this.radius, 0, 2 * Math.PI);
                    AL.ctx.stroke();
                    AL.ctx.fill();
                }
            }
        }

        this.t += 1;

        if (this.t % (this.speed * 40) === 0) {
            this.radius = AL.random(10, 250);

            AL.ctx.globalCompositeOperation = 'xor';
            AL.ctx.strokeStyle = 'black';
            AL.ctx.fillStyle = AL.randomColor(0, 255, 0.05, 0.6);
            AL.ctx.beginPath();
            AL.ctx.arc(AL.w / 2, AL.h / 2, this.radius * 3, 0, 2 * Math.PI);
            AL.ctx.stroke();
            AL.ctx.fill();
            AL.ctx.globalCompositeOperation = 'overlay';
            AL.ctx.strokeStyle = 'white';
        }

        this.requestFrame();
    }
}
