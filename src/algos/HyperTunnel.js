import AL from '../AlgorithmLoader.js';

export default class HyperTunnel extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.name = 'HyperTunnel';

        this.initializeProperties();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeProperties() {
        this.rotate = AL.random(95, 175);
        this.side = AL.random(25, Math.min(this.w, this.h));
    }

    setupDrawingStyles() {
        this.setFillStyle();
        this.ctx.strokeStyle = AL.randomColor(5, 255, 0.25, 0.25);
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.beginPath();
            this.ctx.moveTo(this.w / 2, this.h / 2);
            this.ctx.lineTo(
                this.w / 2 - this.side / 2,
                this.h / 2 - this.side / 2,
            );
            this.ctx.stroke();
            this.ctx.moveTo(this.w / 2, this.h / 2);
            this.ctx.lineTo(
                this.w / 2 + this.side / 2,
                this.h / 2 - this.side / 2,
            );
            this.ctx.stroke();
            this.ctx.lineTo(
                this.w / 2 - this.side / 2,
                this.h / 2 - this.side / 2,
            );
            this.ctx.stroke();
            this.ctx.fill();

            this.rotateCanvasDegrees(this.rotate);
        }

        this.t += 1;

        if (this.t % (this.speed * (360 / this.rotate)) === 0) {
            this.side = AL.random(25, Math.min(this.w, this.h));
            this.setupDrawingStyles();
        }

        if (this.t % (this.speed * 75) === 0) {
            this.initializeProperties();
            this.setupDrawingStyles();
        }

        this.requestFrame();
    }

    setFillStyle() {
        this.ctx.fillStyle =
            this.side > Math.min(this.w, this.h) / 2
                ? AL.randomColor(5, 255, 0.02, 0.02)
                : AL.randomColor(5, 255, 0.2, 0.2);
    }
}
