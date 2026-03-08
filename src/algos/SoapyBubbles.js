import AL from '../AlgorithmLoader.js';

export default class SoapyBubbles extends AL {
    constructor() {
        super();

        this.name = 'Soapy Bubbles';

        this.initializeProperties();
        this.setupConstantStyles();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeProperties() {
        this.size = AL.random(5, 50);
        this.rotate = AL.random(1, 61);
        this.length = Math.random() * 5 + 1;
        this.position = AL.createVector(0, 0);
        this.angle = Math.random() * (Math.PI / 4) + 0.1;

        this.velocity = AL.createVector(0, 0);
        this.velocity.length = this.length;
        this.velocity.angle = this.angle;
    }

    setupConstantStyles() {
        AL.ctx.shadowBlur = 30;
        AL.ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    }

    setupDrawingStyles() {
        AL.ctx.strokeStyle = AL.ctx.shadowColor = AL.randomColor(50, 255, 0.5, 1);
    }

    draw() {
        if (this.t % this.speed === 0) {
            AL.ctx.beginPath();
            AL.ctx.arc(this.position.x, this.position.y, this.size, 0, 2 * Math.PI);
            AL.ctx.stroke();
            AL.ctx.fill();

            this.position.addTo(this.velocity);
        }

        this.t += 1;

        if (this.t % (this.speed * 360) === 0) {
            this.initializeProperties();
            this.setupDrawingStyles();
        }

        this.rotateCanvasDegrees(this.rotate);

        this.requestFrame();
    }
}
