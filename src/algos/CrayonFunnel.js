import AL from '../AlgorithmLoader.js';

export default class CrayonFunnel extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.name = 'Crayon Funnel';

        this.initializeProperties();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeProperties() {
        this.x = AL.random(this.w / 3, this.w * 0.66);
        this.y = AL.random(this.h / 3, this.h * 0.66);
        this.increment = AL.random(1, 6);
        this.rotate = AL.random(1, 150);
        this.radius = AL.random(5, 60);
    }

    setupDrawingStyles() {
        this.ctx.strokeStyle = AL.randomColor(0, 255, 1, 1);
        this.ctx.lineWidth = 2;
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.beginPath();
            this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
            this.radius += this.increment;
            this.ctx.stroke();
        }

        this.t++;

        this.rotateCanvasRadians(this.rotate);

        if (this.t % (this.speed * 180) === 0) {
            this.initializeProperties();

            if (Math.random() < 0.5) {
                this.strokeStyle = Math.random() < 0.5 ? 'white' : 'black';
            } else {
                this.ctx.strokeStyle = AL.randomColor(0, 255, 1, 1);
            }
        }

        this.requestFrame();
    }
}
