import AL from '../AlgorithmLoader.js';

export default class Discos extends AL {
    constructor() {
        super();

        this.name = 'Discos';

        this.initializeProperties();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeProperties() {
        this.color1 = AL.randomColor(5, 255, 0.5, 0.5);
        this.color2 = AL.randomColor(5, 255, 0.5, 0.5);
        this.startAngle = AL.random(0, 100);
        this.radius = AL.random(10, AL.h);
        this.endAngle = Math.PI;
        this.anti = false;
    }

    setupDrawingStyles() {
        AL.ctx.fillStyle = this.color1;
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.stagger %= 3;

            if (this.stagger === 0) {
                AL.ctx.moveTo(AL.w / 2, AL.h / 2);
                AL.ctx.beginPath();
                AL.ctx.strokeStyle = this.color1;
                AL.ctx.lineWidth = AL.random(0, 100);
                AL.ctx.arc(
                    AL.w / 2,
                    AL.h / 2,
                    this.radius,
                    this.startAngle,
                    this.endAngle,
                    this.anti,
                );
                AL.ctx.stroke();
            }

            if (this.stagger === 1) {
                AL.ctx.beginPath();
                AL.ctx.strokeStyle = this.color2;
                this.anti = !this.anti;
                this.radius = AL.random(0, AL.h);
                AL.ctx.arc(
                    AL.w / 2,
                    AL.h / 2,
                    this.radius,
                    this.startAngle,
                    this.endAngle,
                    this.anti,
                );
                AL.ctx.stroke();
            }

            if (this.stagger === 2) {
                AL.ctx.beginPath();
                this.radius = AL.random(0, AL.h);
                AL.ctx.fillRect(AL.w / 2, AL.h / 2, AL.w, 2);
                AL.ctx.stroke();
            }

            AL.ctx.closePath();

            this.stagger += 1;
        }

        this.t += 1;

        if (this.t % (this.speed * 40) === 0) {
            this.rotateCanvasDegrees(30);
        }

        if (this.t % (this.speed * 200) === 0) {
            this.color1 = AL.ctx.fillStyle = AL.randomColor(5, 255, 0.5, 0.5);
            this.color2 = AL.randomColor(5, 255, 0.5, 0.5);
        }

        this.requestFrame();
    }
}
