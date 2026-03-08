import AL from '../AlgorithmLoader.js';

export default class Quadrants extends AL {
    constructor() {
        super();

        this.name = 'Quadrants';

        this.initializeProperties();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeProperties() {
        this.radius = AL.random(5, 250);
    }

    setupDrawingStyles() {
        AL.ctx.strokeStyle = AL.ctx.fillStyle = AL.randomColor(0, 255, 0.3, 0.3);
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.stagger %= 5;

            if (this.stagger === 0) {
                AL.ctx.arc(AL.w / 4, AL.h / 4, this.radius, 0, 360);
                AL.ctx.stroke();
                AL.ctx.beginPath();
            }

            if (this.stagger === 1) {
                AL.ctx.arc(AL.w * 0.75, AL.h / 4, this.radius, 0, 360);
                AL.ctx.stroke();
                AL.ctx.beginPath();
            }

            if (this.stagger === 2) {
                AL.ctx.arc(AL.w / 4, AL.h * 0.75, this.radius, 0, 360);
                AL.ctx.stroke();
                AL.ctx.beginPath();
            }

            if (this.stagger === 3) {
                AL.ctx.arc(AL.w * 0.75, AL.h * 0.75, this.radius, 0, 360);
                AL.ctx.stroke();
                AL.ctx.beginPath();
            }

            if (this.stagger === 4) {
                AL.ctx.arc(AL.w / 2, AL.h / 2, this.radius, 0, 360);
                AL.ctx.stroke();
                AL.ctx.beginPath();
            }

            this.stagger += 1;
        }

        this.t += 1;

        if (this.t % (this.speed * 15) === 0) {
            this.radius = AL.random(10, 350);
        }

        if (this.t % (this.speed * 45) === 0) {
            this.setupDrawingStyles();
        }

        if (this.t % (this.speed * 225) === 0) {
            AL.ctx.lineWidth = AL.random(1, 40);
            AL.ctx.strokeStyle = AL.ctx.fillStyle = 'black';
        }

        this.requestFrame();
    }
}
