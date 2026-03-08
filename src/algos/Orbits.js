import AL from '../AlgorithmLoader.js';

export default class Orbits extends AL {
    constructor() {
        super();

        this.name = 'Orbits';

        this.initializeBaseProperties();
        this.initializeProperties();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeBaseProperties() {
        this.rotate = AL.random(1, 6);
        this.endAngle = AL.random(101, 360);
    }

    initializeProperties() {
        this.startAngle = AL.random(0, 100);
        this.radius = AL.random(30, AL.h);
        this.radius2 = AL.random(10, this.radius);
    }

    setupDrawingStyles() {
        AL.ctx.strokeStyle = AL.randomColor(5, 255, 0.2, 0.2);
    }

    draw() {
        if (this.t % this.speed === 0) {
            AL.ctx.ellipse(
                AL.w / 2,
                AL.h / 2,
                this.radius,
                this.radius2,
                this.rotate,
                this.startAngle,
                this.endAngle,
            );
        }
        AL.ctx.stroke();

        this.t += 1;

        this.rotateCanvasRadians(this.rotate);

        if (this.t % (this.speed * 150) === 0) {
            this.initializeProperties();
            this.rotate = AL.random(-3, 3);

            this.setupDrawingStyles();
            AL.ctx.beginPath();
        }

        this.requestFrame();
    }
}
