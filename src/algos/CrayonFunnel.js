import AL from '../AlgorithmLoader.js';

export default class CrayonFunnel extends AL {
    constructor() {
        super();

        this.name = 'Crayon Funnel';

        this.initializeProperties();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeProperties() {
        this.x = AL.random(AL.w / 3, AL.w * 0.66);
        this.y = AL.random(AL.h / 3, AL.h * 0.66);
        this.increment = AL.random(1, 6);
        this.rotate = AL.random(1, 150);
        this.radius = AL.random(5, 60);
    }

    setupDrawingStyles() {
        AL.ctx.strokeStyle = AL.randomColor(0, 255, 1, 1);
        AL.ctx.lineWidth = 2;
    }

    draw() {
        if (this.t % this.speed === 0) {
            AL.ctx.beginPath();
            AL.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
            this.radius += this.increment;
            AL.ctx.stroke();
        }

        this.t += 1;

        this.rotateCanvasRadians(this.rotate);

        if (this.t % (this.speed * 180) === 0) {
            this.initializeProperties();

            if (Math.random() < 0.5) {
                this.strokeStyle = Math.random() < 0.5 ? 'white' : 'black';
            } else {
                AL.ctx.strokeStyle = AL.randomColor(0, 255, 1, 1);
            }
        }

        this.requestFrame();
    }
}
