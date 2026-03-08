import AL from '../AlgorithmLoader.js';

export default class DysonSpheres extends AL {
    constructor() {
        super();

        this.name = 'Dyson Spheres';

        this.initializeProperties();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeProperties() {
        this.length = AL.random(60, Math.max(AL.h / 2, AL.h - 60));
        this.height = AL.random(20, AL.h / 2 - 40);
        this.rotate = AL.random(1, 6);
    }

    setupDrawingStyles() {
        AL.ctx.shadowBlur = 20;
        AL.ctx.shadowOffsetX = 1;
        AL.ctx.shadowOffsetY = 1;
        AL.ctx.shadowColor = AL.ctx.strokeStyle = AL.randomColor(5, 255, 0.33, 0.33);
    }

    draw() {
        if (this.t % this.speed === 0) {
            AL.ctx.ellipse(AL.w / 2, AL.h / 2, this.length, this.height, this.rotate, 0, 0);
            AL.ctx.stroke();
        }

        this.t += 1;

        if (this.t % (this.speed * 170) === 0) {
            AL.ctx.beginPath();

            const color = Math.random();
            if (color < 0.2) {
                AL.ctx.shadowBlur = 10;
                AL.ctx.shadowOffsetX = 0;
                AL.ctx.shadowOffsetY = 0;
                AL.ctx.shadowColor = AL.ctx.strokeStyle = 'black';
            } else if (color < 0.4) {
                AL.ctx.shadowBlur = 10;
                AL.ctx.shadowOffsetX = 0;
                AL.ctx.shadowOffsetY = 0;
                AL.ctx.shadowColor = AL.ctx.strokeStyle = 'white';
            } else {
                AL.ctx.shadowBlur = 20;
                AL.ctx.shadowColor = AL.ctx.strokeStyle = AL.randomColor(5, 255, 0.33, 0.33);
            }

            this.length = AL.random(60, Math.max(AL.h / 2, AL.h - 60));
            this.height = AL.random(20, AL.h / 2 - 40);
        }

        this.rotate = AL.random(0, 360);

        this.requestFrame();
    }
}
