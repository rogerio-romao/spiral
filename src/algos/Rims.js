import AL from '../AlgorithmLoader.js';

export default class Rims extends AL {
    constructor() {
        super();

        this.name = 'Rims';

        this.initializeProperties();
        this.setupConstantStyles();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeProperties() {
        this.gap = AL.random(4, 100);
        this.rotate = AL.random(1, 6);
        this.startAngle = AL.random(0, 100);
        this.endAngle = AL.random(101, 360);
        this.radius = AL.random(30, AL.h);
        this.radius2 = AL.random(10, this.radius);
    }

    setupConstantStyles() {
        AL.ctx.strokeStyle = ' black';
    }

    setupDrawingStyles() {
        AL.ctx.fillStyle = AL.randomColor(5, 255, 0.01, 0.01);
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.stagger %= 3;

            if (this.stagger === 0) {
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

            if (this.stagger === 1) {
                AL.ctx.ellipse(
                    AL.w / 2,
                    AL.h / 2,
                    this.radius2,
                    this.radius,
                    this.rotate,
                    this.startAngle + this.gap,
                    this.endAngle + this.gap,
                );
            }

            if (this.stagger === 2) {
                AL.ctx.ellipse(
                    this.startAngle + this.gap,
                    this.endAngle + this.gap,
                    this.radius,
                    this.radius2,
                    -this.rotate,
                    AL.w / 2,
                    AL.h / 2,
                );
            }
        }

        AL.ctx.fill();
        AL.ctx.stroke();

        this.t += 1;

        this.rotateCanvasRadians(this.rotate);

        if (this.t % (this.speed * 150) === 0) {
            this.speed = AL.random(1, 10);
            this.initializeProperties();
            this.setupDrawingStyles();
            AL.ctx.beginPath();
        }

        this.requestFrame();
    }
}
