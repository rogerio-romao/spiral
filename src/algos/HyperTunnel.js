import AL from '../AlgorithmLoader.js';

export default class HyperTunnel extends AL {
    constructor() {
        super();

        this.name = 'HyperTunnel';

        this.initializeProperties();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeProperties() {
        this.rotate = AL.random(95, 175);
        this.side = AL.random(25, Math.min(AL.w, AL.h));
    }

    setupDrawingStyles() {
        this.setFillStyle();
        AL.ctx.strokeStyle = AL.randomColor(5, 255, 0.25, 0.25);
    }

    draw() {
        if (this.t % this.speed === 0) {
            AL.ctx.beginPath();
            AL.ctx.moveTo(AL.w / 2, AL.h / 2);
            AL.ctx.lineTo(AL.w / 2 - this.side / 2, AL.h / 2 - this.side / 2);
            AL.ctx.stroke();
            AL.ctx.moveTo(AL.w / 2, AL.h / 2);
            AL.ctx.lineTo(AL.w / 2 + this.side / 2, AL.h / 2 - this.side / 2);
            AL.ctx.stroke();
            AL.ctx.lineTo(AL.w / 2 - this.side / 2, AL.h / 2 - this.side / 2);
            AL.ctx.stroke();
            AL.ctx.fill();

            this.rotateCanvasDegrees(this.rotate);
        }

        this.t += 1;

        if (this.t % (this.speed * (360 / this.rotate)) === 0) {
            this.side = AL.random(25, Math.min(AL.w, AL.h));
            this.setupDrawingStyles();
        }

        if (this.t % (this.speed * 75) === 0) {
            this.initializeProperties();
            this.setupDrawingStyles();
        }

        this.requestFrame();
    }

    setFillStyle() {
        AL.ctx.fillStyle =
            this.side > Math.min(AL.w, AL.h) / 2
                ? AL.randomColor(5, 255, 0.02, 0.02)
                : AL.randomColor(5, 255, 0.2, 0.2);
    }
}
