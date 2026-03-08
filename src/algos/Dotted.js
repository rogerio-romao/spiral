import AL from '../AlgorithmLoader.js';

export default class Dotted extends AL {
    constructor() {
        super();

        this.name = 'Dotted';

        this.initializeProperties();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeProperties() {
        this.vx1 = AL.random(0, AL.w);
        this.vx2 = AL.random(0, AL.w);
        this.vx3 = AL.random(0, AL.w);
        this.vy1 = AL.random(0, AL.h);
        this.vy2 = AL.random(0, AL.h);
        this.vy3 = AL.random(0, AL.h);
    }

    setupDrawingStyles() {
        AL.ctx.strokeStyle = AL.randomColor(5, 255, 0.75, 0.75);
        AL.ctx.fillStyle = AL.randomColor(5, 255, 0.015, 0.015);
        AL.ctx.globalCompositeOperation = 'overlay';
        AL.ctx.setLineDash([14, 6]);
        AL.ctx.lineWidth = 2;
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.stagger %= 3;

            if (this.stagger === 0) {
                AL.ctx.moveTo(AL.w / 2, AL.h / 2);
                AL.ctx.lineTo(this.vx2, this.vy2);
                AL.ctx.stroke();
            }

            if (this.stagger === 1) {
                AL.ctx.lineTo(this.vx3, this.vy3);
                AL.ctx.stroke();
            }

            if (this.stagger === 2) {
                AL.ctx.lineTo(this.vx1, this.vy1);
                AL.ctx.stroke();

                this.initializeProperties();

                AL.ctx.beginPath();
            }

            this.stagger += 1;
        }

        this.t += 1;

        if (this.t % (this.speed * 5) === 0) {
            AL.ctx.fillRect(0, 0, AL.w, AL.h);
        }

        if (this.t % (this.speed * 70) === 0) {
            AL.ctx.setLineDash([AL.random(1, 20), AL.random(7, 50)]);
            AL.ctx.lineWidth = AL.random(1, 29);
        }

        if (this.t % (this.speed * 200) === 0) {
            AL.ctx.fillStyle = AL.randomColor(5, 255, 0.015, 0.015);
        }

        if (this.t % (this.speed * 280) === 0) {
            AL.ctx.strokeStyle = AL.randomColor(5, 255, 0.75, 0.75);
        }

        this.requestFrame();
    }
}
