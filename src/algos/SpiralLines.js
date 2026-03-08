import AL from '../AlgorithmLoader.js';

export default class SpiralLines extends AL {
    constructor() {
        super();

        this.name = 'Spiral Lines';

        this.initializeProperties();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeProperties() {
        this.cycles = 1;
        this.bw = Math.random();
        this.gap = AL.random(4, 100);
        this.rotate = AL.random(1, 359);
        this.radius = AL.random(10, AL.h);
        this.length = AL.random(50, Math.min(AL.w, AL.h) / 1.5);
    }

    setupDrawingStyles() {
        AL.ctx.strokeStyle = AL.randomColor(5, 255, 0.5, 0.5);
        AL.ctx.moveTo(AL.w / 2, AL.h / 2);
        AL.ctx.lineWidth = AL.random(1, 8);
        AL.ctx.beginPath();
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.stagger %= 3;

            if (this.stagger === 0) {
                AL.ctx.moveTo(AL.w / 2 - this.radius - this.length / 2, AL.h / 2 + this.length / 2);
                AL.ctx.lineTo(AL.w / 2 - this.radius - this.length / 2, AL.h / 2 - this.length / 2);
                AL.ctx.stroke();
            }

            if (this.stagger === 1) {
                AL.ctx.lineTo(AL.w / 2 - this.radius - this.length, AL.h / 2);
                AL.ctx.stroke();
            }

            if (this.stagger === 2) {
                AL.ctx.lineTo(AL.w / 2 - this.radius - this.length / 2, AL.h / 2 + this.length / 2);
                AL.ctx.stroke();
            }

            this.rotateCanvasDegrees(this.rotate);

            this.length += this.gap;
            if (this.length > Math.max(AL.w, AL.h)) {
                this.cycles += 1;
                this.length = this.gap;

                AL.ctx.beginPath();
                AL.ctx.strokeStyle = AL.randomColor(5, 255, 0.5, 0.5);
                AL.ctx.arc(AL.w / 2, AL.h / 2, this.radius, 0, 360);

                this.bw = Math.random();
                this.radius = AL.random(5, 65);
                this.gap = AL.random(2, 30);
            }
        }

        this.t += 1;

        if (this.cycles % 9 === 0) {
            this.bw < 0.5
                ? (AL.ctx.strokeStyle = 'rgba(255,255,255, .75)')
                : (AL.ctx.strokeStyle = 'rgba(0,0,0, .75)');
        }

        this.requestFrame();
    }
}
