import AL from '../AlgorithmLoader.js';

export default class Offsets extends AL {
    constructor() {
        super();

        this.name = 'Offsets';

        this.initializeProperties();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeProperties() {
        this.rotate = AL.random(7, 27);
        this.length = AL.random(20, Math.max(AL.w, AL.h));
    }

    setupDrawingStyles() {
        AL.ctx.shadowBlur = 3;
        AL.ctx.fillStyle = AL.randomColor();
        AL.ctx.shadowColor = AL.randomColor();
        AL.ctx.shadowOffsetX = AL.random(-200, 200);
        AL.ctx.shadowOffsetY = AL.random(-200, 200);
        AL.ctx.strokeStyle = AL.randomColor(0, 255, 0.1, 0.1);
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.stagger %= 2;

            if (this.stagger === 0) {
                AL.ctx.lineTo(AL.w / 2 - this.length, AL.h / 2);
                AL.ctx.stroke();
            }

            if (this.stagger === 1) {
                AL.ctx.lineTo(AL.w / 2, AL.h / 2 - this.length);
                AL.ctx.stroke();
            }

            this.rotateCanvasRadians(this.rotate);

            this.stagger += 1;
        }

        this.t += 1;

        if (this.t % (this.speed * 40) === 0) {
            AL.ctx.fill();
            AL.ctx.beginPath();
            AL.ctx.fillStyle = AL.randomColor();
            this.length = AL.random(20, Math.max(AL.w, AL.h));
        }

        if (this.t % (this.speed * 200) === 0) {
            AL.ctx.shadowColor = AL.randomColor();
            AL.ctx.shadowOffsetX = AL.random(-200, 200);
            AL.ctx.shadowOffsetY = AL.random(-200, 200);
        }

        if (this.t % (this.speed * 400) === 0) {
            AL.ctx.strokeStyle = AL.randomColor(0, 255, 0.1, 0.1);
            this.rotate = AL.random(1, 37);
        }

        this.requestFrame();
    }
}
