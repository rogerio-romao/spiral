import AL from '../AlgorithmLoader.js';

export default class Lollipottery extends AL {
    constructor() {
        super();

        this.name = 'Lollipottery';

        this.initializeProperties();
        this.setupConstantStyles();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeProperties() {
        this.radius = AL.random(50, Math.max(AL.w, AL.h) / 2);
        this.alter = AL.random(-50, 50);
    }

    setupConstantStyles() {
        AL.ctx.shadowBlur = 4;
    }

    setupDrawingStyles() {
        AL.ctx.lineWidth = AL.random(2, 14);
        AL.ctx.strokeStyle = AL.randomColor();
        AL.ctx.shadowColor = AL.randomColor();
        AL.ctx.globalCompositeOperation = 'overlay';
    }

    draw() {
        if (this.t % this.speed === 0) {
            AL.ctx.arc(AL.w / 2, AL.h / 2, this.radius, 0, 2 * Math.PI);

            this.radius += this.alter;
            if (this.radius > Math.max(AL.w, AL.h) || this.radius <= 40) {
                this.initializeProperties();
                AL.ctx.lineWidth = AL.random(2, 14);
            }

            AL.ctx.stroke();
            AL.ctx.beginPath();
        }

        this.t += 1;

        if (this.t % (this.speed * 150) === 0) {
            this.initializeProperties();
            this.setupDrawingStyles();
            AL.ctx.beginPath();
        }

        if (this.t % (this.speed * 600) === 0) {
            AL.ctx.globalCompositeOperation = 'source-over';
        }

        this.requestFrame();
    }
}
