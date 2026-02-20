import AL from '../AlgorithmLoader.js';

export default class SoapyBubbles extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

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
        this.ctx.shadowBlur = 30;
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    }

    setupDrawingStyles() {
        this.ctx.strokeStyle = this.ctx.shadowColor = AL.randomColor(
            50,
            255,
            0.5,
            1,
        );
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.beginPath();
            this.ctx.arc(
                this.position.x,
                this.position.y,
                this.size,
                0,
                2 * Math.PI,
            );
            this.ctx.stroke();
            this.ctx.fill();

            this.position.addTo(this.velocity);
        }

        this.t++;

        if (this.t % (this.speed * 320) === 0) {
            this.initializeProperties();
            this.setupDrawingStyles();
        }

        this.rotateCanvasDegrees(this.rotate);

        this.requestFrame();
    }
}
